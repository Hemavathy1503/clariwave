// ==============================
// INIT ON LOAD
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initPredictPage();
    initFormEnhancements();
    initFloatingLabels();
    initInputRestrictions();
});


// ==============================
// NAVIGATION
// ==============================
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".section");

    navItems.forEach(item => {
        item.addEventListener("click", function () {

            // Remove active + clicked from all
            navItems.forEach(i => {
                i.classList.remove("active-nav");
                i.classList.remove("clicked");
            });

            // Add to current
            this.classList.add("active-nav");
            this.classList.add("clicked");

            // Hide all sections
            sections.forEach(sec => {
                sec.classList.remove("active");
                sec.style.display = 'none';
            });

            // Get section id
            const sectionId = this.getAttribute("data-section");
            const targetSection = document.getElementById(sectionId);

            // Show selected section
            if (targetSection) {
                targetSection.style.display = 'flex';
                targetSection.classList.add("active");
            }

            // ✅ ADD IT HERE
            if (sectionId === "analytics") {
                renderUserAnalytics();
            }
        });
    });
}
// ==============================
// AUTO FOCUS (PREDICT PAGE)
// ==============================
function initPredictPage() {
    const predictSection = document.getElementById('predict');
    if (predictSection && predictSection.classList.contains('active')) {
        const textBox = document.getElementById('text');
        if (textBox) textBox.focus();
    }
}


// ==============================
// MAIN PREDICT FUNCTION
// ==============================
function predict() {

    clearErrors();

    const formData = getFormData();

    const validation = validateForm(formData);
    if (!validation.isValid) {
        showValidationErrors(validation.errors);
        return;
    }

    showLoading(true);

    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(result => handlePredictionResult(result))
    .catch(error => handlePredictionError(error))
    .finally(() => showLoading(false));
}


// ==============================
// GET FORM DATA
// ==============================
function getFormData() {
    return {
        text: document.getElementById('text').value.trim(),
        age: Number(document.getElementById('age').value) || 0,
        gpa: Number(document.getElementById('gpa').value) || 0,
        stress: Number(document.getElementById('stress').value) || 0,
        anxiety: Number(document.getElementById('anxiety').value) || 0,
        depression: Number(document.getElementById('depression').value) || 0,
        sleep: Number(document.getElementById('sleep').value) || 0,
        steps: Number(document.getElementById('steps').value) || 0,
        sentiment: Number(document.getElementById('sentiment').value) || 0,
        gender: document.getElementById('gender').value,
        mood: document.getElementById('mood').value
    };
}


// ==============================
// VALIDATION
// ==============================
function validateForm(data) {
    const errors = [];

    if (!data.text || data.text.length < 10) errors.push('text');
    if (data.age <= 0 || data.age > 120) errors.push('age');
    if (!data.gpa || data.gpa < 0 || data.gpa > 4.0) errors.push('gpa');
    if (!data.gender) errors.push('gender');
    if (!data.mood) errors.push('mood');

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}


// ==============================
// SHOW ERRORS
// ==============================
function showValidationErrors(errors) {
    errors.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.classList.add('error');
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    alert(`Please fix: ${errors.join(', ')}`);
}


// ==============================
// CLEAR ERRORS
// ==============================
function clearErrors() {
    document.querySelectorAll('.input-group input, .input-group textarea, .enhanced-select select')
        .forEach(input => input.classList.remove('error'));
}


// ==============================
// LOADING STATE
// ==============================
function showLoading(show) {
    const btn = document.querySelector('button');

    if (!btn) return;

    if (show) {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span>Analyzing...';
        btn.classList.add('loading');
    } else {
        btn.disabled = false;
        btn.innerHTML = '🔮 Analyze My Mental State';
        btn.classList.remove('loading');
    }
}


// ==============================
// HANDLE RESULT
// ==============================
function handlePredictionResult(result) {

    if (result.error) {
        alert(`Error: ${result.error}`);
        return;
    }

    // Show result in Predict page
    document.getElementById('prediction').innerText =
        `Prediction: ${result.prediction}`;

    document.getElementById('confidence').innerText =
        `Confidence: ${Math.round(result.confidence)}%`;

    const resultBox = document.getElementById('resultBox');
    resultBox.style.display = 'block';
    resultBox.classList.add('show');

    // ✅ STORE USER DATA HERE (THIS IS THE CORRECT PLACE)
    window.lastUserData = {
        ...getFormData(),   // current form values
        prediction: result.prediction,
        confidence: result.confidence
    };
}
// ==============================
// ERROR HANDLING
// ==============================
function handlePredictionError(error) {
    console.error(error);
    alert("Server error. Please try again.");
}


// ==============================
// FORM ENHANCEMENTS
// ==============================
function initFormEnhancements() {

    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach((input, index, arr) => {

        // ENTER NAVIGATION
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.tagName !== 'TEXTAREA') {
                e.preventDefault();

                const next = arr[index + 1];
                if (next) next.focus();
                else predict();
            }
        });

        // CLEAR ERROR ON TYPE
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}


// ==============================
// FLOATING LABEL FIX
// ==============================
function initFloatingLabels() {
    document.querySelectorAll('.input-group input, .input-group textarea, .enhanced-select select')
        .forEach(input => {

            if (input.value) {
                const label = input.nextElementSibling;

                if (label && label.tagName === 'LABEL') {
                    label.style.top = '-10px';
                    label.style.fontSize = '13px';
                    label.style.color = '#FADCD5';
                    label.style.background = 'rgba(118,93,103,0.98)';
                    label.style.padding = '4px 12px';
                    label.style.borderRadius = '8px';
                }
            }
        });
}
function initInputRestrictions() {

    const rules = {
        age: { min: 1, max: 100 },
        gpa: { min: 0.01, max: 4.0 },
        stress: { min: 1, max: 5 },
        sleep: { min: 1, max: 24 },
        sentiment: { min: -1, max: 1 }
    };

    Object.keys(rules).forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener("input", function () {
            let value = this.value;

            // Allow empty (user typing)
            if (value === "") return;

            let num = Number(value);

            if (isNaN(num)) {
                this.value = "";
                return;
            }

            // Apply limits
            if (num < rules[id].min) {
                this.value = rules[id].min;
            }

            if (num > rules[id].max) {
                this.value = rules[id].max;
            }
        });
    });
}
function renderUserAnalytics() {

    const data = window.lastUserData;

    if (!data) return; // No prediction yet

    // Show container
    const container = document.getElementById("analyticsResult");
    container.style.display = "block";

    // Show text
    document.getElementById("a_prediction").innerText =
        `Prediction: ${data.prediction}`;

    document.getElementById("a_confidence").innerText =
        `Confidence: ${Math.round(data.confidence)}%`;

    // Get canvas
    const ctx = document.getElementById("userChart").getContext("2d");

    // Destroy old chart if exists
    if (window.userChartInstance) {
        window.userChartInstance.destroy();
    }

    // Create chart
    window.userChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Stress", "Anxiety", "Depression",
                "Sleep", "Steps", "Sentiment"
            ],
            datasets: [{
                label: "Your Mental Metrics",
                data: [
                    data.stress,
                    data.anxiety,
                    data.depression,
                    data.sleep,
                    data.steps,
                    data.sentiment
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Prediction: ${data.prediction} (${Math.round(data.confidence)}%)`
                }
            }
        }
    });
}
// ==============================
// GLOBAL ACCESS
// ==============================
window.predict = predict;