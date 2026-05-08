# ML Model Setup Instructions

## Prerequisites
1. Python 3.8 or higher
2. Required Python packages (install using pip)

## Installation

1. Install Python dependencies:
```bash
cd "ML MODEL"
pip install -r requirements.txt
```

Or install individually:
```bash
pip install joblib pandas numpy scikit-learn
```

## Testing the Model

Test the prediction script directly:
```bash
python predict_api.py
```

Then input JSON like:
```json
{
  "description": "Patient has high fever, body temperature 39°C, experiencing nausea and vomiting. Recent rainfall in the area with stagnant water.",
  "weather": {
    "temperature": 32.5,
    "humidity": 75,
    "precipitation": 15.5,
    "windSpeed": 5.2
  }
}
```

## Model File
Make sure `disease_category_model_local.joblib` exists in the `ML MODEL` directory.

## Backend Integration
The backend will call this script via the `/api/disease-prediction/predict` endpoint.

## Troubleshooting

1. **Python not found**: Make sure Python is installed and in your PATH
   - Windows: Install Python from python.org or use `py` command
   - Linux/Mac: Use `python3` command

2. **Module not found**: Install required packages using `pip install -r requirements.txt`

3. **Model file not found**: Ensure `disease_category_model_local.joblib` is in the `ML MODEL` directory

4. **Permission errors**: Make sure the script has execute permissions (Linux/Mac): `chmod +x predict_api.py`



