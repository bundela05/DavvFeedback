let express =require ("express")
let mongoose = require ("mongoose")
require("dotenv").config()

let app = express ()
app.use(express.json())

const studentsSchema = new mongoose.Schema({
    enroll_id: { type: String, required: true, unique: true },
    course: { type: String, required: true },
    batch: { type: String, required: true },
    sem: { type: Number, required: true }
});
const students = mongoose.model("students", studentsSchema,"students");

app.post("/api/students",async (req,res)=>{
    let{enroll_id,course,batch,sem}=req.body

    const newstudents = new students({ enroll_id, course, batch, sem });
    await newstudents.save().then(()=>{
        res.send({
            status:1,
            message:"Data Saved"
        })
         }).catch((err)=>{
        res.send({status:0,message:"error occured",err})
    })
})

app.get("/api/agg", async (req,res)=>{

})

mongoose.connect(process.env.URL).then(()=>{
    console.log("connected to mongodb")
    app.listen(process.env.PORT,()=>{
        console.log("server running on port "+ process.env.PORT)
    })
})