import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

def create_sample_dataset():
    """Create a sample dataset for demonstration"""
    print("Creating sample dataset...")
    np.random.seed(42)
    n_samples = 1000

    # Generate synthetic data
    data = {
        'Previous_GPA': np.random.uniform(1.5, 10.0, n_samples),
        'Attendance': np.random.uniform(40, 100, n_samples),
        'Assignment_Scores': np.random.uniform(30, 100, n_samples),
        'Study_Hours': np.random.uniform(5, 50, n_samples),
        'Midterm_Scores': np.random.uniform(11, 40, n_samples),
        'LMS_Activity': np.random.uniform(10, 150, n_samples)
    }

    df = pd.DataFrame(data)

    # Create target variable based on weighted combination
    score = (
            0.3 * (df['Previous_GPA'] / 10.0) +
            0.25 * (df['Attendance'] / 100) +
            0.2 * (df['Assignment_Scores'] / 100) +
            0.1 * (df['Study_Hours'] / 40) +
            0.15 * (df['Midterm_Scores'] / 100)
    )

    # Add some noise and create binary target
    df['Pass'] = (score + np.random.normal(0, 0.1, n_samples) > 0.6).astype(int)

    return df

def train_model():
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)

    # Create or load dataset
    try:
        df = pd.read_csv('data/student_dataset.csv')
        print("Loaded existing dataset")
    except FileNotFoundError:
        df = create_sample_dataset()
        df.to_csv('data/student_dataset.csv', index=False)
        print("Sample dataset created and saved")

    # Prepare features and target
    feature_columns = ['Previous_GPA', 'Attendance', 'Assignment_Scores',
                       'Study_Hours', 'Midterm_Scores', 'LMS_Activity']
    X = df[feature_columns]
    y = df['Pass']

    print(f"Dataset shape: {X.shape}")
    print(f"Target distribution: {y.value_counts().to_dict()}")

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train Random Forest model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        random_state=42
    )

    print("Training model...")
    model.fit(X_train, y_train)

    # Evaluate model
    train_accuracy = accuracy_score(y_train, model.predict(X_train))
    test_accuracy = accuracy_score(y_test, model.predict(X_test))

    print(f"Training Accuracy: {train_accuracy:.3f}")
    print(f"Testing Accuracy: {test_accuracy:.3f}")

    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nFeature Importance:")
    print(feature_importance)

    # Save model
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)

    print("\n✅ Model saved as 'model.pkl'")

    # Test prediction
    test_sample = X_test.iloc[0:1]
    test_prediction = model.predict_proba(test_sample)[0][1]
    print(f"✅ Test prediction: {test_prediction:.3f}")

    return model

if __name__ == "__main__":
    train_model()
