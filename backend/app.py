from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import numpy as np
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)
# ========================
# Database Configuration
# ========================
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Student table definition
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    semester = db.Column(db.Integer)
    previousGPA = db.Column(db.Float)
    attendance = db.Column(db.Float)
    assignmentScores = db.Column(db.Float)
    midtermScores = db.Column(db.Float)
    studyHours = db.Column(db.Float)
    lmsActivity = db.Column(db.Float)
    riskLevel = db.Column(db.String(20))
    predictedGrade = db.Column(db.Float)
    passFailProb = db.Column(db.Float)

with app.app_context():
    db.create_all()  # ✅ Creates DB if not exists

# Load model
model = None
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully")
except FileNotFoundError:
    print("❌ Model file not found. Run train_model.py first")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        data = request.json
        print(f"📥 Received data: {data}")

        # Extract features in correct order
        feature_values = [
            float(data.get('previousGPA', 0)),
            float(data.get('attendance', 0)),
            float(data.get('assignmentScores', 0)),
            float(data.get('studyHours', 0)),
            float(data.get('midtermScores', 0)),
            float(data.get('lmsActivity', 0))
        ]

        print(f"🔢 Feature values: {feature_values}")

        # Create DataFrame with proper column names (fixes the warning)
        feature_names = ['Previous_GPA', 'Attendance', 'Assignment_Scores',
                         'Study_Hours', 'Midterm_Scores', 'LMS_Activity']
        features_df = pd.DataFrame([feature_values], columns=feature_names)

        # Make prediction
        prediction_prob = model.predict_proba(features_df)[0][1]
        prediction_class = model.predict(features_df)[0]

        # Determine risk level
        if prediction_prob >= 0.6:
            risk = 'Low'
        elif prediction_prob >= 0.3:
            risk = 'Medium'
        else:
            risk = 'High'

        predicted_grade = prediction_prob * 4
        # Save student record in DB
        student = Student(
            name=data.get('name', 'Unknown'),
            age=int(data.get('age', 0)),
            gender=data.get('gender', ''),
            semester=int(data.get('semester', 0)),
            previousGPA=feature_values[0],
            attendance=feature_values[1],
            assignmentScores=feature_values[2],
            studyHours=feature_values[3],
            midtermScores=feature_values[4],
            lmsActivity=feature_values[5],
            riskLevel=risk,
            predictedGrade=predicted_grade,
            passFailProb=prediction_prob
        )
        db.session.add(student)
        db.session.commit()

        result = {
            'passFailProb': round(float(prediction_prob), 2),
            'riskLevel': risk,
            'predictedGrade': round(predicted_grade, 2),
            'confidence': round(float(prediction_prob), 2)
        }


        result = {
            'passFailProb': round(float(prediction_prob), 2),
            'riskLevel': risk,
            'predictedGrade': round(predicted_grade, 2),
            'confidence': round(float(prediction_prob), 2)
        }

        print(f"📤 Sending result: {result}")
        return jsonify(result)

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 400


# ========================
# Fetch All Students
# ========================
@app.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    result = [
        {
            'id': s.id,
            'name': s.name,
            'age': s.age,
            'gender': s.gender,
            'semester': s.semester,
            'previousGPA': s.previousGPA,
            'attendance': s.attendance,
            'assignmentScores': s.assignmentScores,
            'midtermScores': s.midtermScores,
            'studyHours': s.studyHours,
            'lmsActivity': s.lmsActivity,
            'riskLevel': s.riskLevel,
            'predictedGrade': round(s.predictedGrade, 2),
            'passFailProb': round(s.passFailProb, 2)
        }
        for s in students
    ]
    return jsonify(result)

import os

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
