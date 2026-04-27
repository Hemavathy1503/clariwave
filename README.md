# ClariWave: Mental Wellness Analyzer

ClariWave is a machine learning–powered web application designed to assess mental wellness using behavioral data, numerical indicators, and natural language processing. The system provides risk-level predictions along with confidence scores and visual analytics to support better understanding of mental health patterns.

## Overview

ClariWave integrates a trained machine learning model with a web interface to deliver real-time predictions. Users input personal reflections and relevant metrics such as stress, sleep, and activity levels. The system processes this data and returns a categorized mental health risk level.

## Key Features

* Machine learning–based prediction of mental wellness risk levels
* Natural language processing for analyzing user text input
* Integration of numerical and categorical features
* Interactive user interface with structured input validation
* Analytics dashboard including confusion matrix and feature importance
* Real-time prediction with confidence scoring

## Technology Stack

Frontend:

* HTML, CSS, JavaScript

Backend:

* Python (Flask)

Machine Learning:

* Scikit-learn
* TF-IDF Vectorization
* Random Forest Classifier

Data Processing:

* NumPy
* Pandas

Visualization:

* Matplotlib
* Seaborn
* Chart.js

## Project Structure

```
clariwave/
│
├── app.py
├── model/
│   └── train_model.py
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
│   └── index.html
├── requirements.txt
└── .gitignore
```

## Input Features

The model uses a combination of textual, numerical, and categorical inputs:

* Daily reflections (text input)
* Age
* GPA
* Stress level
* Anxiety score
* Depression score
* Sleep hours
* Daily steps
* Sentiment score
* Gender
* Mood

## Installation and Setup

1. Clone the repository:

```
git clone https://github.com/Hemavathy1503/clariwave.git
cd clariwave
```

2. Create and activate a virtual environment:

```
python -m venv myenv
myenv\Scripts\activate   (Windows)
```

3. Install dependencies:

```
pip install -r requirements.txt
```

4. Train the model (required before running the app):

```
python model/train_model.py
```

5. Run the application:

```
python app.py
```

6. Open in browser:

```
http://127.0.0.1:5000
```

## Model Details

The system uses a Random Forest classifier trained on a dataset containing behavioral and psychological indicators. Text input is processed using TF-IDF vectorization, and all features are combined into a single input matrix.

Custom threshold logic is applied to improve classification sensitivity for high-risk cases.

## Output

The application provides:

* Mental health risk level (High Risk, Moderate Risk, Low Risk)
* Confidence score for prediction
* Visual analytics of user input metrics

## Notes

* Model files are not included in the repository to keep it lightweight.
* The training script must be executed to generate required model artifacts before running the application.

## Author

Hemavathy S
