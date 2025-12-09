text
# AI-Powered Student Performance Predictor

A full-stack application with machine learning backend for predicting student academic performance.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Modern web browser
- Git

### Setup Instructions

1. **Clone Repository**
   git clone <repo-url>
   cd ai-student-performance-predictor

text

2. **Setup Backend**
   cd backend
   pip install -r requirements.txt
   python train_model.py # Train the ML model
   python app.py # Start Flask server

text

3. **Setup Frontend**
   cd frontend

Open index.html with Live Server or Python server
python -m http.server 8080

text

4. **Access Application**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## 🏗️ Architecture

- **Frontend**: HTML/CSS/JavaScript with Chart.js
- **Backend**: Flask API with scikit-learn
- **ML Model**: Random Forest Classifier
- **Data**: CSV-based training dataset

## 📊 API Endpoints

### POST /predict
Predict student performance based on input features.

**Request:**
{
"previousGPA": 3.2,
"attendance": 85,
"assignmentScores": 78,
"studyHours": 25,
"midtermScores": 82,
"lmsActivity": 95
}

text

**Response:**
{
"passFailProb": 0.87,
"riskLevel": "Low",
"predictedGrade": 3.48,
"confidence": 0.87
}

text

## 🤖 Machine Learning Model

- **Algorithm**: Random Forest Classifier
- **Features**: 6 input variables (GPA, attendance, etc.)
- **Target**: Binary classification (Pass/Fail)
- **Accuracy**: ~85-90% on test data

## 🔧 Development

### Adding New Features
1. Update model training in `train_model.py`
2. Modify API endpoints in `app.py`
3. Update frontend calls in `app.js`

### Model Retraining
cd backend
python train_model.py

text
undefined
🚀 How to Run the Complete System
Step 1: Setup Backend (Terminal 1)
bash
cd backend
pip install -r requirements.txt
python train_model.py    # Creates model.pkl
python app.py           # Starts Flask server on port 5000
Step 2: Setup Frontend (Terminal 2)
bash
cd frontend
python -m http.server 8080   # Or use Live Server in VS Code
Step 3: Access Application
Frontend: http://localhost:8080

Backend API: http://localhost:5000

Health Check: http://localhost:5000/health