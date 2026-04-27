from flask import Flask, render_template, request, jsonify
import numpy as np
import joblib
from scipy.sparse import hstack

app = Flask(__name__)

# -----------------------------
# LOAD MODEL & COMPONENTS
# -----------------------------
model = joblib.load("model/model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")
le_gender = joblib.load("model/le_gender.pkl")
le_mood = joblib.load("model/le_mood.pkl")

# -----------------------------
# HOME ROUTE
# -----------------------------
@app.route("/")
def home():
    return render_template("index.html")


# -----------------------------
# PREDICTION ROUTE
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        # -----------------------------
        # GET INPUTS
        # -----------------------------
        text = data["text"]

        age = float(data["age"])
        gpa = float(data["gpa"])
        stress = float(data["stress"])
        anxiety = float(data["anxiety"])
        depression = float(data["depression"])
        sleep = float(data["sleep"])
        steps = float(data["steps"])
        sentiment = float(data["sentiment"])

        gender = data["gender"]
        mood = data["mood"]

        # -----------------------------
        # TEXT TRANSFORM
        # -----------------------------
        X_text = vectorizer.transform([text])

        # -----------------------------
        # NUMERICAL FEATURES
        # -----------------------------
        X_num = np.array([[age, gpa, stress, anxiety,
                           depression, sleep, steps, sentiment]])

        # -----------------------------
        # CATEGORICAL FEATURES
        # -----------------------------
        gender_encoded = le_gender.transform([gender])[0]
        mood_encoded = le_mood.transform([mood])[0]

        X_cat = np.array([[gender_encoded, mood_encoded]])

        # -----------------------------
        # COMBINE ALL
        # -----------------------------
        X = hstack([X_text, X_num, X_cat])

        # -----------------------------
        # PREDICT PROBABILITIES
        # -----------------------------
        probs = model.predict_proba(X)[0]

        # -----------------------------
        # CUSTOM THRESHOLD LOGIC
        # -----------------------------
        if probs[0] > 0.30:
            pred = 0
        elif probs[1] > 0.35:
            pred = 1
        else:
            pred = int(np.argmax(probs))

        confidence = float(np.max(probs))

        # -----------------------------
        # LABEL MAPPING
        # -----------------------------
        labels = {
            0: "High Risk",
            1: "Moderate Risk",
            2: "Low Risk"
        }

        return jsonify({
            "prediction": labels[pred],
            "confidence": round(confidence * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# -----------------------------
# RUN APP
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)