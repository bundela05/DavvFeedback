let express =require ("express")
let mongoose = require ("mongoose")
require("dotenv").config()

let app = express ()
app.use(express.json())

// students collection schema
const studentsSchema = new mongoose.Schema({
    enroll_id: { type: String, required: true, unique: true },
    course: { type: String, required: true },
    batch: { type: String, required: true },
    sem: { type: String, required: true }
});
//student schema model
const students = mongoose.model("students", studentsSchema,"students");

//classes schema (nested doc in teacher document)
const classesSchema = new mongoose.Schema(
    {
      subcode: {type: String, required: true },//"DS6A513"
      course: {type: String, required: true }, //"M.tech-5yrs"
      batch: {type: String, required: true },//"23-28"
      sem: {type: String, required: true },//6
      sname: {type: String, required: true } //"Nosql"
    },{ _id: false });

// teacher schema 
const teacherSchema = new mongoose.Schema({
    tname : {type: String, required: true},
    classes: [classesSchema]
})
//teachers model
const teachers = mongoose.model("teachers", teacherSchema,"teachers");

//defining function for agrregation pipeline
const aggrFunc = async (enroll_id)=> {
    try{
        await teachers.aggregate([{
            $lookup: {
            from: "students",
            localField: "classes.course",
            foreignField: "course",
            as: "filterData"
            }
        },
        { $unwind: "$classes" },
        { $unwind: "$filterData" },
        {
            $match: {
            $expr: {
                $and: [
                { $eq: ["$classes.course", "$filterData.course"] },
                { $eq: ["$classes.batch", "$filterData.batch"] },
                { $eq: ["$classes.sem", "$filterData.sem"] }
                ]
            },
            "filterData.enroll_id": enroll_id
            }
        },
        {
            $project: {
            _id: {$concat: ["$filterData.enroll_id","_","$classes.subcode"]},
            tname: 1,
            sname: "$classes.sname",
            course: "$classes.course",
            batch: "$classes.batch",
            sem: "$classes.sem",
            enroll_id: "$filterData.enroll_id"
            }
        },
        {
        $merge: {
            into: "DavvFeedback",
            on: ["_id"],
            whenMatched: "merge",   // or "replace"
            whenNotMatched: "insert"
        }
        }]);
    }catch (err) {
        console.error("DETAILED AGGREGATION ERROR:", err.code, err.errmsg || err.message);
    }
    
};

//post request
app.post("/api/students", async (req,res)=>{
    try{
        const {enroll_id, course, batch, sem }= req.body;
        const newstudents = new students({ enroll_id, course, batch, sem });
        await newstudents.save();

        await aggrFunc(enroll_id);

        res.status(201).json({
            status:1,
            message: "student saved and feedback docs generated."
        });
    }catch(err){
        console.error("Post error", err.message);
        if(!res.headersSent){
            res.status(500).json({status:0,message:"error", err: err.message});
        }
    }
})

//mongodb connection
mongoose.connect(process.env.URL).then(()=>{
    console.log("connected to mongodb")
    app.listen(process.env.PORT,()=>{
        console.log("server running on port "+ process.env.PORT)
    })
})