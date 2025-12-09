// Application State
let students = [];
let charts = {};
let currentSection = 'home';
let settings = {
    gpaWeight: 25,
    attendanceWeight: 20,
    assignmentWeight: 15,
    studyWeight: 15,
    midtermWeight: 15,
    lmsWeight: 10,
    highRiskThreshold: 0.3,
    mediumRiskThreshold: 0.6,
    emailNotifications: true
};

// Sample Data
const sampleStudents = [
    {
        id: "STU001",
        name: "Alice Johnson",
        age: 20,
        gender: "Female",
        semester: 4,
        previousGPA: 3.2,
        attendance: 85,
        assignmentScores: 78,
        midtermScores: 82,
        studyHours: 25,
        lmsLogins: 95,
        forumPosts: 12,
        parentEducation: "Bachelor",
        financialStatus: "Medium",
        riskLevel: "Low",
        predictedGrade: 3.4,
        passFailProb: 0.92
    },
    {
        id: "STU002",
        name: "Bob Smith",
        age: 19,
        gender: "Male",
        semester: 2,
        previousGPA: 2.1,
        attendance: 62,
        assignmentScores: 55,
        midtermScores: 58,
        studyHours: 15,
        lmsLogins: 35,
        forumPosts: 3,
        parentEducation: "High School",
        financialStatus: "Low",
        riskLevel: "High",
        predictedGrade: 2.2,
        passFailProb: 0.34
    },
    {
        id: "STU003",
        name: "Carol Davis",
        age: 21,
        gender: "Female",
        semester: 6,
        previousGPA: 2.8,
        attendance: 75,
        assignmentScores: 68,
        midtermScores: 72,
        studyHours: 20,
        lmsLogins: 78,
        forumPosts: 8,
        parentEducation: "Master",
        financialStatus: "High",
        riskLevel: "Medium",
        predictedGrade: 2.9,
        passFailProb: 0.71
    },
    {
        id: "STU004",
        name: "David Wilson",
        age: 22,
        gender: "Male",
        semester: 3,
        previousGPA: 3.5,
        attendance: 90,
        assignmentScores: 85,
        midtermScores: 88,
        studyHours: 30,
        lmsLogins: 120,
        forumPosts: 15,
        parentEducation: "PhD",
        financialStatus: "High",
        riskLevel: "Low",
        predictedGrade: 3.6,
        passFailProb: 0.95
    },
    {
        id: "STU005",
        name: "Emily Brown",
        age: 20,
        gender: "Female",
        semester: 5,
        previousGPA: 2.5,
        attendance: 70,
        assignmentScores: 62,
        midtermScores: 65,
        studyHours: 18,
        lmsLogins: 60,
        forumPosts: 5,
        parentEducation: "Bachelor",
        financialStatus: "Medium",
        riskLevel: "Medium",
        predictedGrade: 2.7,
        passFailProb: 0.68
    }
];

// System Metrics
const systemMetrics = {
    totalStudents: 248,
    atRiskStudents: 31,
    averageGPA: 2.94,
    attendanceRate: 78.2,
    interventionSuccess: 67
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load sample data
    students = [...sampleStudents];

    // Setup navigation
    setupNavigation();

    // Update metrics
    updateMetrics();

    // Setup form handlers
    setupFormHandlers();

    // Setup table controls
    setupTableControls();

    // Setup settings handlers
    setupSettingsHandlers();

    // Initialize charts
    initializeCharts();

    // Load students table
    loadStudentsTable();
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);

            // Update active nav
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;

        // Initialize section-specific content
        if (sectionName === 'dashboard') {
            setTimeout(initializeCharts, 100);
        } else if (sectionName === 'students') {
            loadStudentsTable();
        } else if (sectionName === 'analytics') {
            setTimeout(initializeAnalyticsCharts, 100);
        }
    }
}

// Form Handlers
function setupFormHandlers() {

}

async function handleStudentSubmission() {
    const formData = getFormData();

    // ✅ Now await works properly
    const prediction = await predictPerformance(formData);

    // Add to students array with actual prediction data
    const newStudent = {
        ...formData,
        ...prediction,
        id: generateStudentId()
    };

    students.push(newStudent);

    // Show prediction results
    displayPredictionResults(prediction);

    // Update metrics
    updateMetrics();

    // Refresh student table if visible
    if (currentSection === 'students') {
        loadStudentsTable();
    }
}

function getFormData() {
    return {
        name: document.getElementById('student-name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        semester: parseInt(document.getElementById('semester').value),
        previousGPA: parseFloat(document.getElementById('previous-gpa').value),
        attendance: parseInt(document.getElementById('attendance').value),
        assignmentScores: parseInt(document.getElementById('assignment-scores').value),
        midtermScores: parseInt(document.getElementById('midterm-scores').value),
        studyHours: parseInt(document.getElementById('study-hours').value),
        lmsLogins: parseInt(document.getElementById('lms-logins').value),
        forumPosts: parseInt(document.getElementById('forum-posts').value) || 0,
        parentEducation: document.getElementById('parent-education').value,
        financialStatus: document.getElementById('financial-status').value
    };
}

// Prediction Algorithm


async function predictPerformance(studentData) {
    // Normalize values (0-1 scale)
    try {
        // Show loading (optional)
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }

        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                previousGPA: studentData.previousGPA,
                attendance: studentData.attendance,
                assignmentScores: studentData.assignmentScores,
                studyHours: studentData.studyHours,
                midtermScores: studentData.midtermScores,
                lmsActivity: studentData.lmsLogins
            })
        });

        // Hide loading
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        return result;  // { passFailProb, riskLevel, predictedGrade, confidence }

    } catch (error) {
        console.error('Prediction API error:', error);

        // Hide loading and show error
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        showError('Failed to get prediction. Please check if the backend server is running.');

        // Return fallback values
        return {
            passFailProb: 0,
            riskLevel: 'Unknown',
            predictedGrade: 0,
            confidence: 0
        };
    }
}

// Helper functions for error handling (add to app.js)
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function displayPredictionResults(prediction) {
    const resultDiv = document.getElementById('prediction-result');

    // Defensive check for riskLevel before using toLowerCase()
    const riskLevelValue = prediction.riskLevel ? prediction.riskLevel.toLowerCase() : 'unknown';

    // Update risk level text and class safely
    const riskLevelEl = document.getElementById('risk-level');
    riskLevelEl.textContent = prediction.riskLevel || 'Unknown';
    riskLevelEl.className = `risk-level ${riskLevelValue}`;

    // Update probability safely
    document.getElementById('pass-fail-prob').textContent =
        prediction.passFailProb !== undefined && prediction.passFailProb !== null
            ? `${Math.round(prediction.passFailProb * 100)}%`
            : 'N/A';

    // Update predicted grade safely
    document.getElementById('predicted-grade').textContent =
        (typeof prediction.predictedGrade === 'number')
            ? prediction.predictedGrade.toFixed(2)
            : 'N/A';

    // Generate recommendations
    const recommendations = generateRecommendations(prediction);
    const recommendationsList = document.getElementById('recommendation-list');
    recommendationsList.innerHTML = '';

    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });

    // Show results
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });

}

function generateRecommendations(prediction) {
    const recommendations = [];

    if (prediction.riskLevel === 'High') {
        recommendations.push('Schedule immediate academic advisor meeting');
        recommendations.push('Enroll in tutoring program');
        recommendations.push('Increase study hours to at least 25 per week');
        recommendations.push('Improve attendance to above 80%');
    } else if (prediction.riskLevel === 'Medium') {
        recommendations.push('Consider additional study groups');
        recommendations.push('Increase LMS engagement');
        recommendations.push('Focus on assignment completion');
        recommendations.push('Maintain current attendance levels');
    } else {
        recommendations.push('Continue current study habits');
        recommendations.push('Consider peer tutoring opportunities');
        recommendations.push('Explore advanced coursework options');
        recommendations.push('Maintain excellent performance');
    }

    return recommendations;
}

// Utility Functions
function generateStudentId() {
    const existingIds = students.map(s => s.id);
    let newId;
    let counter = students.length + 1;

    do {
        newId = `STU${counter.toString().padStart(3, '0')}`;
        counter++;
    } while (existingIds.includes(newId));

    return newId;
}

function resetForm() {
    document.getElementById('student-form').reset();
    document.getElementById('prediction-result').style.display = 'none';
}

// Metrics
function updateMetrics() {
    const totalStudents = students.length;
    const atRiskCount = students.filter(s => s.riskLevel === 'High').length;
    const averageGPA = students.length > 0 ?
        students.reduce((sum, s) => sum + (s.predictedGrade || s.previousGPA), 0) / students.length : 0;
    const averageAttendance = students.length > 0 ?
        students.reduce((sum, s) => sum + s.attendance, 0) / students.length : 0;

    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('at-risk-students').textContent = atRiskCount;
    document.getElementById('average-gpa').textContent = averageGPA.toFixed(2);
    document.getElementById('attendance-rate').textContent = `${averageAttendance.toFixed(1)}%`;
}

// Students Table
function setupTableControls() {
    const searchInput = document.getElementById('search-students');
    const riskFilter = document.getElementById('filter-risk');

    if (searchInput) {
        searchInput.addEventListener('input', filterStudentsTable);
    }

    if (riskFilter) {
        riskFilter.addEventListener('change', filterStudentsTable);
    }
}

function loadStudentsTable() {
    const tbody = document.getElementById('students-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    students.forEach(student => {
        const row = createStudentRow(student);
        tbody.appendChild(row);
    });
}

function createStudentRow(student) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.semester}</td>
        <td>${student.previousGPA.toFixed(2)}</td>
        <td>${student.attendance}%</td>
        <td><span class="risk-badge ${student.riskLevel.toLowerCase()}">${student.riskLevel}</span></td>
        <td>${(student.predictedGrade || student.previousGPA).toFixed(2)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-sm btn-edit" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-delete" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    return row;
}

function filterStudentsTable() {
    const searchTerm = document.getElementById('search-students').value.toLowerCase();
    const riskFilter = document.getElementById('filter-risk').value;

    const rows = document.querySelectorAll('#students-tbody tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const id = row.cells[0].textContent.toLowerCase();
        const risk = row.cells[6].textContent.trim();

        const matchesSearch = name.includes(searchTerm) || id.includes(searchTerm);
        const matchesRisk = !riskFilter || risk === riskFilter;

        if (matchesSearch && matchesRisk) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function editStudent(studentId) {
    // Placeholder for edit functionality
    alert(`Edit functionality for student ${studentId} would be implemented here`);
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== studentId);
        loadStudentsTable();
        updateMetrics();
    }
}

function exportStudentData() {
    const dataStr = JSON.stringify(students, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'student_data.json';
    link.click();
}

// Charts
function initializeCharts() {
    if (Object.keys(charts).length > 0) {
        // Destroy existing charts
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        charts = {};
    }

    createRiskChart();
    createPerformanceChart();
    createFeatureChart();
    createAttendanceChart();
}

function createRiskChart() {
    const ctx = document.getElementById('risk-chart');
    if (!ctx) return;

    const riskCounts = {
        Low: students.filter(s => s.riskLevel === 'Low').length,
        Medium: students.filter(s => s.riskLevel === 'Medium').length,
        High: students.filter(s => s.riskLevel === 'High').length
    };

    charts.riskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            datasets: [{
                data: [riskCounts.Low, riskCounts.Medium, riskCounts.High],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;

    const semesterData = {};
    students.forEach(student => {
        if (!semesterData[student.semester]) {
            semesterData[student.semester] = [];
        }
        semesterData[student.semester].push(student.predictedGrade || student.previousGPA);
    });

    const semesters = Object.keys(semesterData).sort((a, b) => a - b);
    const avgGrades = semesters.map(sem => {
        const grades = semesterData[sem];
        return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    });

    charts.performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: semesters.map(s => `Semester ${s}`),
            datasets: [{
                label: 'Average GPA',
                data: avgGrades,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4
                }
            }
        }
    });
}

function createFeatureChart() {
    const ctx = document.getElementById('feature-chart');
    if (!ctx) return;

    const features = [
        { name: 'Previous GPA', weight: settings.gpaWeight },
        { name: 'Attendance', weight: settings.attendanceWeight },
        { name: 'Assignments', weight: settings.assignmentWeight },
        { name: 'Study Hours', weight: settings.studyWeight },
        { name: 'Midterms', weight: settings.midtermWeight },
        { name: 'LMS Activity', weight: settings.lmsWeight }
    ];

    charts.featureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features.map(f => f.name),
            datasets: [{
                label: 'Importance Weight (%)',
                data: features.map(f => f.weight),
                backgroundColor: [
                    '#2563eb',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50
                }
            }
        }
    });
}

function createAttendanceChart() {
    const ctx = document.getElementById('attendance-chart');
    if (!ctx) return;

    const attendanceData = students.map(s => ({
        x: s.attendance,
        y: s.predictedGrade || s.previousGPA
    }));

    charts.attendanceChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Attendance vs Performance',
                data: attendanceData,
                backgroundColor: '#2563eb',
                borderColor: '#1d4ed8',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Attendance (%)'
                    },
                    min: 0,
                    max: 100
                },
                y: {
                    title: {
                        display: true,
                        text: 'GPA'
                    },
                    min: 0,
                    max: 4
                }
            }
        }
    });
}

function initializeAnalyticsCharts() {
    const ctx = document.getElementById('correlation-chart');
    if (!ctx) return;

    // Simple correlation visualization
    const correlationData = {
        labels: ['GPA', 'Attendance', 'Assignments', 'Study Hours', 'Midterms', 'LMS'],
        datasets: [{
            label: 'Correlation with Performance',
            data: [0.85, 0.72, 0.68, 0.65, 0.62, 0.45],
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
            borderColor: '#2563eb',
            borderWidth: 2
        }]
    };

    charts.correlationChart = new Chart(ctx, {
        type: 'bar',
        data: correlationData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

// Settings
function setupSettingsHandlers() {
    const sliders = ['gpa-weight', 'attendance-weight', 'assignment-weight', 'study-weight'];

    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueSpan = document.getElementById(sliderId + '-value');

        if (slider && valueSpan) {
            slider.addEventListener('input', function() {
                valueSpan.textContent = `${this.value}%`;
                updateSettingValue(sliderId, parseInt(this.value));
            });
        }
    });
}

function updateSettingValue(settingId, value) {
    switch (settingId) {
        case 'gpa-weight':
            settings.gpaWeight = value;
            break;
        case 'attendance-weight':
            settings.attendanceWeight = value;
            break;
        case 'assignment-weight':
            settings.assignmentWeight = value;
            break;
        case 'study-weight':
            settings.studyWeight = value;
            break;
    }

    // Update feature chart if visible
    if (currentSection === 'dashboard' && charts.featureChart) {
        charts.featureChart.data.datasets[0].data = [
            settings.gpaWeight,
            settings.attendanceWeight,
            settings.assignmentWeight,
            settings.studyWeight,
            settings.midtermWeight,
            settings.lmsWeight
        ];
        charts.featureChart.update();
    }
}

function saveSettings() {
    // In a real app, this would save to a backend
    localStorage.setItem('aiPredictorSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
}

function resetSettings() {
    settings = {
        gpaWeight: 25,
        attendanceWeight: 20,
        assignmentWeight: 15,
        studyWeight: 15,
        midtermWeight: 15,
        lmsWeight: 10,
        highRiskThreshold: 0.3,
        mediumRiskThreshold: 0.6,
        emailNotifications: true
    };

    // Update UI
    document.getElementById('gpa-weight').value = 25;
    document.getElementById('gpa-weight-value').textContent = '25%';
    document.getElementById('attendance-weight').value = 20;
    document.getElementById('attendance-weight-value').textContent = '20%';
    document.getElementById('assignment-weight').value = 15;
    document.getElementById('assignment-weight-value').textContent = '15%';
    document.getElementById('study-weight').value = 15;
    document.getElementById('study-weight-value').textContent = '15%';

    alert('Settings reset to defaults!');
}

// Load settings from localStorage on page load
function loadSettings() {
    const savedSettings = localStorage.getItem('aiPredictorSettings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
        studentForm.addEventListener('submit', async function (e) {
            e.preventDefault();  // Prevent page reload
            await handleStudentSubmission();
        });
    }
});
