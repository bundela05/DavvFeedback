const API_BASE = 'http://localhost:5001/api'; // Change this to your backend URL

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
    event.target.classList.add('active');
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.status === 1) {
            showAlert('registerAlert', '✅ Student registered successfully! Feedback documents generated.', 'success');
            document.getElementById('studentForm').reset();
        } else {
            showAlert('registerAlert', result.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showAlert('registerAlert', '❌ Network error. Please check if backend is running on port 5000.', 'error');
        console.error('Error:', error);
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
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const feedbackData = await response.json();

        if (feedbackData.length === 0) {
            showAlert('feedbackAlert', 'No feedback forms found. Please register student first.', 'error');
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
                        ${createRatingSliders(`form_${index}`)}
                        ${createYesNoQuestions(`form_${index}`)}
                    </div>
                    <div class="form-group">
                        <label>Strengths</label>
                        <textarea name="strengths_${index}" placeholder="What are the teacher&apos;s strengths?"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Weaknesses/Areas for Improvement</label>
                        <textarea name="weaknesses_${index}" placeholder="Areas where teacher can improve?"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Suggestions</label>
                        <textarea name="suggestions_${index}" placeholder="Any suggestions for improvement?"></textarea>
                    </div>
                    <input type="hidden" name="doc_id_${index}" value="${item._id}">
                    <input type="hidden" name="tname_${index}" value="${item.tname}">
                    <input type="hidden" name="sname_${index}" value="${item.sname}">
                </div>
                <hr>
            `;
        });

        document.getElementById('teacherFeedbacks').innerHTML = formsHtml;
        document.getElementById('submitFeedbackBtn').style.display = 'block';
        showAlert('feedbackAlert', `✅ Loaded ${feedbackData.length} feedback forms! Fill and submit.`, 'success');

        addSliderListeners();

    } catch (error) {
        showAlert('feedbackAlert', `Error loading forms: ${error.message}`, 'error');
        document.getElementById('feedbackForms').style.display = 'none';
    }
}

// Create rating sliders
function createRatingSliders(formPrefix) {
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

    let html = '';
    ratings.forEach(rating => {
        html += `
            <div class="form-group">
                <label>${rating.label} (1-5)</label>
                <div class="slider-container">
                    <input type="range" class="slider" name="${rating.key}_${formPrefix}" min="1" max="5" value="3" step="1">
                    <div class="slider-value" id="${rating.key}_value_${formPrefix}">3</div>
                </div>
            </div>
        `;
    });
    return html;
}

// Create Yes/No questions
function createYesNoQuestions(formPrefix) {
    const questions = [
        {key: 'resultDeclaredTwoWeeks', label: 'Results declared within 2 weeks?'},
        {key: 'adequateAssignments', label: 'Adequate assignments given?'},
        {key: 'recommendForSameSubject', label: 'Recommend for same subject?'},
        {key: 'recommendForOtherSubject', label: 'Recommend for other subjects?'},
        {key: 'syllabusAdequacy', label: 'Syllabus coverage adequate?'}
    ];

    let html = '';
    questions.forEach(question => {
        html += `
            <div class="form-group">
                <label>${question.label}</label>
                <select name="${question.key}_${formPrefix}" required>
                    <option value="">Select</option>
                    <option value="Yes">✅ Yes</option>
                    <option value="No">❌ No</option>
                </select>
            </div>
        `;
    });
    return html;
}

// Add slider event listeners
function addSliderListeners() {
    document.querySelectorAll('.slider').forEach(slider => {
        slider.removeEventListener('input', handleSliderChange); // Prevent duplicates
        slider.addEventListener('input', handleSliderChange);
    });
}

function handleSliderChange(e) {
    const slider = e.target;
    const valueDisplay = document.getElementById(slider.name + '_value');
    if (valueDisplay) {
        valueDisplay.textContent = slider.value;
    }
}

// Submit feedback
document.getElementById('feedbackForm').add