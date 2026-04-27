import os
import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, balanced_accuracy_score
from scipy.sparse import hstack

from imblearn.over_sampling import SMOTE

# -----------------------------
# CREATE IMAGE FOLDER
# -----------------------------
os.makedirs("static/images", exist_ok=True)

# -----------------------------
# LOAD DATA
# -----------------------------
df = pd.read_csv("data/mental_health_dataset.csv")

# -----------------------------
# TEXT FEATURE
# -----------------------------
text = df['Daily_Reflections'].fillna("")
vectorizer = TfidfVectorizer(max_features=2000, ngram_range=(1,2))
X_text = vectorizer.fit_transform(text)

# -----------------------------
# NUMERICAL FEATURES
# -----------------------------
num_cols = ['Age', 'GPA', 'Stress_Level', 'Anxiety_Score',
            'Depression_Score', 'Sleep_Hours', 'Steps_Per_Day', 'Sentiment_Score']

X_num = df[num_cols]

# -----------------------------
# CATEGORICAL FEATURES
# -----------------------------
le_gender = LabelEncoder()
le_mood = LabelEncoder()

df['Gender'] = le_gender.fit_transform(df['Gender'])
df['Mood_Description'] = le_mood.fit_transform(df['Mood_Description'])

X_cat = df[['Gender', 'Mood_Description']]

# -----------------------------
# COMBINE FEATURES
# -----------------------------
X = hstack([X_text, X_num, X_cat])
y = df['Mental_Health_Status']

# -----------------------------
# TRAIN-TEST SPLIT
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -----------------------------
# SMOTE (TRAIN ONLY)
# -----------------------------
smote = SMOTE(k_neighbors=2, random_state=42)
X_train, y_train = smote.fit_resample(X_train, y_train)

# -----------------------------
# MODEL
# -----------------------------
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    class_weight={0: 6, 1: 1, 2: 1},  # 🔥 strong focus on class 0
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# PROBABILITY PREDICTION
# -----------------------------
probs = model.predict_proba(X_test)

y_pred = []
for p in probs:
    if p[0] > 0.30:
        y_pred.append(0)
    elif p[1] > 0.35:
        y_pred.append(1)
    else:
        y_pred.append(np.argmax(p))

y_pred = np.array(y_pred)

# -----------------------------
# METRICS
# -----------------------------
print("\n📊 MODEL PERFORMANCE\n")

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Balanced Accuracy:", balanced_accuracy_score(y_test, y_pred))

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred, zero_division=1))

# -----------------------------
# CONFUSION MATRIX
# -----------------------------
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(6,5))
sns.heatmap(cm, annot=True, fmt='d')

plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")

plt.tight_layout()
plt.savefig("static/images/confusion_matrix.png")
plt.close()

# -----------------------------
# FEATURE IMPORTANCE
# -----------------------------
importances = model.feature_importances_

feature_names = num_cols + ['Gender', 'Mood_Description']
importance_values = importances[-len(feature_names):]

sorted_idx = importance_values.argsort()
sorted_features = [feature_names[i] for i in sorted_idx]
sorted_values = importance_values[sorted_idx]

plt.figure(figsize=(8,6))
plt.barh(sorted_features, sorted_values)

plt.title("Feature Importance")
plt.xlabel("Importance")
plt.ylabel("Features")

plt.tight_layout()
plt.savefig("static/images/feature_importance.png")
plt.close()

# -----------------------------
# SAVE MODEL
# -----------------------------
joblib.dump(model, "model/model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")
joblib.dump(le_gender, "model/le_gender.pkl")
joblib.dump(le_mood, "model/le_mood.pkl")

print("\n✅ Model trained, evaluated, and saved successfully!")