// const API_BASE = 'http://localhost:5001/api'; // Change this to your backend URL

// // DOM ready
// document.addEventListener('DOMContentLoaded', function() {
//     addSliderListeners();
// });

// // Tab functionality
// function showTab(tabName) {
//     document.querySelectorAll('.tab-content').forEach(tab => {
//         tab.classList.remove('active');
//     });
    
//     document.querySelectorAll('.tab').forEach(tab => {
//         tab.classList.remove('active');
//     });
    
//     document.getElementById(tabName).classList.add('active');
//     event.target.classList.add('active');
// }

// // Show alert
// function showAlert(containerId, message, type = 'success') {
//     const container = document.getElementById(containerId);
//     container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
//     setTimeout(() => {
//         container.innerHTML = '';
//     }, 5000);
// }

// // Show loading
// function showLoading(containerId, show = true) {
//     const container = document.getElementById(containerId);
//     if (show) {
//         container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';
//     }
// }

// // Register Student
// document.getElementById('studentForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const btn = document.getElementById('registerBtn');
//     btn.disabled = true;
//     btn.textContent = 'Registering...';
    
//     try {
//         const formData = {
//             enroll_id: document.getElementById('enroll_id').value.trim(),
//             course: document.getElementById('course').value,
//             batch: document.getElementById('batch').value.trim(),
//             sem: document.getElementById('sem').value.trim()
//         };

//         const response = await fetch(`${API_BASE}/students`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData)
//         });

//         const result = await response.json();

//         if (result.status === 1) {
//             showAlert('registerAlert', '✅ Student registered successfully! Feedback documents generated.', 'success');
//             document.getElementById('studentForm').reset();
//         } else {
//             showAlert('registerAlert', result.message || 'Registration failed', 'error');
//         }
//     } catch (error) {
//         showAlert('registerAlert', '❌ Network error. Please check if backend is running on port 5000.', 'error');
//         console.error('Error:', error);
//     } finally {
//         btn.disabled = false;
//         btn.textContent = 'Register Student';
//     }
// });

// // Load feedback forms for student
// async function loadFeedbackForms() {
//     const enrollId = document.getElementById('feedbackEnrollId').value.trim();
//     if (!enrollId) {
//         showAlert('feedbackAlert', 'Please enter enrollment ID', 'error');
//         return;
//     }

//     showLoading('feedbackAlert');

//     try {
//         const response = await fetch(`${API_BASE}/DavvFeedback/${enrollId}`);
        
//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//         }
        
//         const feedbackData = await response.json();

//         if (feedbackData.length === 0) {
//             showAlert('feedbackAlert', 'No feedback forms found. Please register student first.', 'error');
//             document.getElementById('feedbackForms').style.display = 'none';
//             return;
//         }

//         document.getElementById('feedbackForms').style.display = 'block';
        
//         let formsHtml = '';
//         feedbackData.forEach((item, index) => {
//             formsHtml += `
//                 <div class="result-card">
//                     <h3>📚 ${item.sname}</h3>
//                     <p><strong>👨‍🏫 Teacher:</strong> ${item.tname}</p>
//                     <div class="feedback-grid">
//                         ${createRatingSliders(`form_${index}`)}
//                         ${createYesNoQuestions(`form_${index}`)}
//                     </div>
//                     <div class="form-group">
//                         <label>Strengths</label>
//                         <textarea name="strengths_${index}" placeholder="What are the teacher&apos;s strengths?"></textarea>
//                     </div>
//                     <div class="form-group">
//                         <label>Weaknesses/Areas for Improvement</label>
//                         <textarea name="weaknesses_${index}" placeholder="Areas where teacher can improve?"></textarea>
//                     </div>
//                     <div class="form-group">
//                         <label>Suggestions</label>
//                         <textarea name="suggestions_${index}" placeholder="Any suggestions for improvement?"></textarea>
//                     </div>
//                     <input type="hidden" name="doc_id_${index}" value="${item._id}">
//                     <input type="hidden" name="tname_${index}" value="${item.tname}">
//                     <input type="hidden" name="sname_${index}" value="${item.sname}">
//                 </div>
//                 <hr>
//             `;
//         });

//         document.getElementById('teacherFeedbacks').innerHTML = formsHtml;
//         document.getElementById('submitFeedbackBtn').style.display = 'block';
//         showAlert('feedbackAlert', `✅ Loaded ${feedbackData.length} feedback forms! Fill and submit.`, 'success');

//         addSliderListeners();

//     } catch (error) {
//         showAlert('feedbackAlert', `Error loading forms: ${error.message}`, 'error');
//         document.getElementById('feedbackForms').style.display = 'none';
//     }
// }

// // Create rating sliders
// function createRatingSliders(formPrefix) {
//     const ratings = [
//         {key: 'conceptualClarity', label: 'Conceptual Clarity'},
//         {key: 'motivation', label: 'Motivation'},
//         {key: 'communicationSkills', label: 'Communication Skills'},
//         {key: 'regularityPunctuality', label: 'Regularity & Punctuality'},
//         {key: 'subjectKnowledge', label: 'Subject Knowledge'},
//         {key: 'practicalExamples', label: 'Practical Examples'},
//         {key: 'interactionGuidance', label: 'Interaction & Guidance'},
//         {key: 'itSkills', label: 'IT Skills'},
//         {key: 'overallPerformance', label: 'Overall Performance'}
//     ];

//     let html = '';
//     ratings.forEach(rating => {
//         html += `
//             <div class="form-group">
//                 <label>${rating.label} (1-5)</label>
//                 <div class="slider-container">
//                     <input type="range" class="slider" name="${rating.key}_${formPrefix}" min="1" max="5" value="3" step="1">
//                     <div class="slider-value" id="${rating.key}_value_${formPrefix}">3</div>
//                 </div>
//             </div>
//         `;
//     });
//     return html;
// }

// // Create Yes/No questions
// function createYesNoQuestions(formPrefix) {
//     const questions = [
//         {key: 'resultDeclaredTwoWeeks', label: 'Results declared within 2 weeks?'},
//         {key: 'adequateAssignments', label: 'Adequate assignments given?'},
//         {key: 'recommendForSameSubject', label: 'Recommend for same subject?'},
//         {key: 'recommendForOtherSubject', label: 'Recommend for other subjects?'},
//         {key: 'syllabusAdequacy', label: 'Syllabus coverage adequate?'}
//     ];

//     let html = '';
//     questions.forEach(question => {
//         html += `
//             <div class="form-group">
//                 <label>${question.label}</label>
//                 <select name="${question.key}_${formPrefix}" required>
//                     <option value="">Select</option>
//                     <option value="Yes">✅ Yes</option>
//                     <option value="No">❌ No</option>
//                 </select>
//             </div>
//         `;
//     });
//     return html;
// }

// // Add slider event listeners
// function addSliderListeners() {
//     document.querySelectorAll('.slider').forEach(slider => {
//         slider.removeEventListener('input', handleSliderChange); // Prevent duplicates
//         slider.addEventListener('input', handleSliderChange);
//     });
// }

// function handleSliderChange(e) {
//     const slider = e.target;
//     const valueDisplay = document.getElementById(slider.name + '_value');
//     if (valueDisplay) {
//         valueDisplay.textContent = slider.value;
//     }
// }

// // New function for individual submission
// async function submitSingleFeedback(docId, index) {
//     const btn = document.querySelector(`button[onclick="submitSingleFeedback('${docId}', ${index})"]`);
//     const originalText = btn.textContent;
//     btn.disabled = true;
//     btn.textContent = '⏳ Saving...';

//     try {
//         // Build the structure to match your Mongoose Schema's "feedback" field
//         const feedbackData = {
//             conceptualClarity: Number(document.querySelector(`input[name="conceptualClarity_form_${index}"]`).value),
//             motivation: Number(document.querySelector(`input[name="motivation_form_${index}"]`).value),
//             communicationSkills: Number(document.querySelector(`input[name="communicationSkills_form_${index}"]`).value),
//             regularityPunctuality: Number(document.querySelector(`input[name="regularityPunctuality_form_${index}"]`).value),
//             subjectKnowledge: Number(document.querySelector(`input[name="subjectKnowledge_form_${index}"]`).value),
//             practicalExamples: Number(document.querySelector(`input[name="practicalExamples_form_${index}"]`).value),
//             interactionGuidance: Number(document.querySelector(`input[name="interactionGuidance_form_${index}"]`).value),
//             itSkills: Number(document.querySelector(`input[name="itSkills_form_${index}"]`).value),
//             overallPerformance: Number(document.querySelector(`input[name="overallPerformance_form_${index}"]`).value),

//             resultDeclaredTwoWeeks: document.querySelector(`select[name="resultDeclaredTwoWeeks_form_${index}"]`).value,
//             adequateAssignments: document.querySelector(`select[name="adequateAssignments_form_${index}"]`).value,
//             recommendForSameSubject: document.querySelector(`select[name="recommendForSameSubject_form_${index}"]`).value,
//             recommendForOtherSubject: document.querySelector(`select[name="recommendForOtherSubject_form_${index}"]`).value,
//             syllabusAdequacy: document.querySelector(`select[name="syllabusAdequacy_form_${index}"]`).value,

//             strengths: document.querySelector(`textarea[name="strengths_${index}"]`).value,
//             weaknesses: document.querySelector(`textarea[name="weaknesses_${index}"]`).value,
//             suggestions: document.querySelector(`textarea[name="suggestions_${index}"]`).value
//         };

//         const response = await fetch(`${API_BASE}/submitFeedback/${docId}`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(feedbackData) // This sends only the 'feedback' object content
//         });

//         const result = await response.json();

//         if (result.status === 1) {
//             btn.textContent = '✅ Submitted';
//             btn.style.background = '#28a745';
//             showAlert('feedbackAlert', `Feedback for subject saved!`, 'success');
//         } else {
//             throw new Error(result.message);
//         }
//     } catch (error) {
//         btn.disabled = false;
//         btn.textContent = originalText;
//         console.error("Submission Error:", error);
//         showAlert('feedbackAlert', '❌ Failed to save feedback.', 'error');
//     }
// }

// // Submit feedback
// document.getElementById('feedbackForm').add

const API_BASE = 'http://localhost:5001/api'; 

// DOM ready
document.addEventListener('DOMContentLoaded', function() {
    addSliderListeners();
});

// Tab functionality
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    // Use event.currentTarget to be safe
    if (event) event.currentTarget.classList.add('active');
}

// Show alert
function showAlert(containerId, message, type = 'success') {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Show loading
function showLoading(containerId, show = true) {
    const container = document.getElementById(containerId);
    if (show) {
        container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';
    }
}

// Register Student
document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.textContent = 'Registering...';
    
    try {
        const formData = {
            enroll_id: document.getElementById('enroll_id').value.trim(),
            course: document.getElementById('course').value,
            batch: document.getElementById('batch').value.trim(),
            sem: document.getElementById('sem').value.trim()
        };

        const response = await fetch(`${API_BASE}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.status === 1) {
            showAlert('registerAlert', '✅ Student registered successfully!', 'success');
            document.getElementById('studentForm').reset();
        } else {
            showAlert('registerAlert', result.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showAlert('registerAlert', '❌ Network error. Check backend on port 5001.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Register Student';
    }
});

// Load feedback forms for student
async function loadFeedbackForms() {
    const enrollId = document.getElementById('feedbackEnrollId').value.trim();
    if (!enrollId) {
        showAlert('feedbackAlert', 'Please enter enrollment ID', 'error');
        return;
    }

    showLoading('feedbackAlert');

    try {
        const response = await fetch(`${API_BASE}/DavvFeedback/${enrollId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const feedbackData = await response.json();
        if (feedbackData.length === 0) {
            showAlert('feedbackAlert', 'No forms found. Register student first.', 'error');
            document.getElementById('feedbackForms').style.display = 'none';
            return;
        }

        document.getElementById('feedbackForms').style.display = 'block';
        let formsHtml = '';
        
        feedbackData.forEach((item, index) => {
            formsHtml += `
                <div class="result-card">
                    <h3>📚 ${item.sname}</h3>
                    <p><strong>👨‍🏫 Teacher:</strong> ${item.tname}</p>
                    <div class="feedback-grid">
                        ${createRatingSliders(index)}
                        ${createYesNoQuestions(index)}
                    </div>
                    <div class="form-group">
                        <label>Strengths</label>
                        <textarea name="strengths_${index}" placeholder="Teacher's strengths..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Weaknesses</label>
                        <textarea name="weaknesses_${index}" placeholder="Areas to improve..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Suggestions</label>
                        <textarea name="suggestions_${index}" placeholder="Any suggestions?"></textarea>
                    </div>
                    <button type="button" class="btn" style="margin-top:15px; background: #4facfe;" 
                            onclick="submitSingleFeedback('${item._id}', ${index})">
                        Submit Feedback for ${item.sname}
                    </button>
                </div>
                <hr>
            `;
        });

        document.getElementById('teacherFeedbacks').innerHTML = formsHtml;
        showAlert('feedbackAlert', `✅ Loaded ${feedbackData.length} forms!`, 'success');
        addSliderListeners();

    } catch (error) {
        showAlert('feedbackAlert', `Error: ${error.message}`, 'error');
    }
}

function createRatingSliders(index) {
    const ratings = [
        {key: 'conceptualClarity', label: 'Conceptual Clarity'},
        {key: 'motivation', label: 'Motivation'},
        {key: 'communicationSkills', label: 'Communication Skills'},
        {key: 'regularityPunctuality', label: 'Regularity & Punctuality'},
        {key: 'subjectKnowledge', label: 'Subject Knowledge'},
        {key: 'practicalExamples', label: 'Practical Examples'},
        {key: 'interactionGuidance', label: 'Interaction & Guidance'},
        {key: 'itSkills', label: 'IT Skills'},
        {key: 'overallPerformance', label: 'Overall Performance'}
    ];

    return ratings.map(r => `
        <div class="form-group">
            <label>${r.label} (1-5)</label>
            <div class="slider-container">
                <input type="range" class="slider" name="${r.key}_form_${index}" min="1" max="5" value="3" step="1">
                <div class="slider-value" id="${r.key}_form_${index}_value">3</div>
            </div>
        </div>
    `).join('');
}

function createYesNoQuestions(index) {
    const questions = [
        {key: 'resultDeclaredTwoWeeks', label: 'Results declared within 2 weeks?'},
        {key: 'adequateAssignments', label: 'Adequate assignments given?'},
        {key: 'recommendForSameSubject', label: 'Recommend for same subject?'},
        {key: 'recommendForOtherSubject', label: 'Recommend for other subjects?'},
        {key: 'syllabusAdequacy', label: 'Syllabus coverage adequate?'}
    ];

    return questions.map(q => `
        <div class="form-group">
            <label>${q.label}</label>
            <select name="${q.key}_form_${index}" required>
                <option value="">Select</option>
                <option value="Yes">✅ Yes</option>
                <option value="No">❌ No</option>
            </select>
        </div>
    `).join('');
}

function addSliderListeners() {
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const valDisplay = document.getElementById(e.target.name + '_value');
            if (valDisplay) valDisplay.textContent = e.target.value;
        });
    });
}

async function submitSingleFeedback(docId, index) {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Saving...';

    try {
        const feedbackData = {
            conceptualClarity: Number(document.querySelector(`input[name="conceptualClarity_form_${index}"]`).value),
            motivation: Number(document.querySelector(`input[name="motivation_form_${index}"]`).value),
            communicationSkills: Number(document.querySelector(`input[name="communicationSkills_form_${index}"]`).value),
            regularityPunctuality: Number(document.querySelector(`input[name="regularityPunctuality_form_${index}"]`).value),
            subjectKnowledge: Number(document.querySelector(`input[name="subjectKnowledge_form_${index}"]`).value),
            practicalExamples: Number(document.querySelector(`input[name="practicalExamples_form_${index}"]`).value),
            interactionGuidance: Number(document.querySelector(`input[name="interactionGuidance_form_${index}"]`).value),
            itSkills: Number(document.querySelector(`input[name="itSkills_form_${index}"]`).value),
            overallPerformance: Number(document.querySelector(`input[name="overallPerformance_form_${index}"]`).value),
            resultDeclaredTwoWeeks: document.querySelector(`select[name="resultDeclaredTwoWeeks_form_${index}"]`).value,
            adequateAssignments: document.querySelector(`select[name="adequateAssignments_form_${index}"]`).value,
            recommendForSameSubject: document.querySelector(`select[name="recommendForSameSubject_form_${index}"]`).value,
            recommendForOtherSubject: document.querySelector(`select[name="recommendForOtherSubject_form_${index}"]`).value,
            syllabusAdequacy: document.querySelector(`select[name="syllabusAdequacy_form_${index}"]`).value,
            strengths: document.querySelector(`textarea[name="strengths_${index}"]`).value,
            weaknesses: document.querySelector(`textarea[name="weaknesses_${index}"]`).value,
            suggestions: document.querySelector(`textarea[name="suggestions_${index}"]`).value
        };

        const response = await fetch(`${API_BASE}/submitFeedback/${docId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });

        if (response.ok) {
            btn.textContent = '✅ Submitted';
            btn.style.background = '#28a745';
            showAlert('feedbackAlert', `Feedback saved for subject!`, 'success');
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        btn.disabled = false;
        btn.textContent = 'Retry';
        showAlert('feedbackAlert', '❌ Error saving feedback.', 'error');
    }
}