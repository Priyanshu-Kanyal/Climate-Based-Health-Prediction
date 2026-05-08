#!/usr/bin/env python3
"""
API script for comprehensive disease outbreak prediction
Accepts JSON input via stdin (description, weather data)
and returns JSON output via stdout
"""
import sys
import json
import os
import joblib
import pandas as pd
import warnings
import re

# Suppress warnings for cleaner JSON output
warnings.filterwarnings('ignore')

# Identify model paths
script_dir = os.path.dirname(os.path.abspath(__file__))
disease_targets = ['Dengue_Cases', 'Malaria_Cases', 'Diarrhea_Cases', 'Typhoid_Cases', 'Respiratory_Cases']

# Load regression models
models = {}
for disease in disease_targets:
    model_path = os.path.join(script_dir, f"xgboost_{disease}.joblib")
    try:
        models[disease] = joblib.load(model_path)
    except Exception as e:
        pass

# Load classification model
category_model = None
cat_model_path = os.path.join(script_dir, "disease_category_model_local.joblib")
try:
    category_model = joblib.load(cat_model_path)
except Exception as e:
    pass

# Helper parsing functions for the classification model
def parse_handwash(text):
    if not text: return 5
    t = text.lower()
    m = re.search(r'(\d{1,2})\s*-\s*(\d{1,2})\s*times', t)
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        return int(round((a+b)/2))
    m = re.search(r'(\d{1,2})\s*(?:times|time|/day|per day)', t)
    if m: return int(m.group(1))
    if "twice" in t: return 2
    if "thrice" in t: return 3
    if "frequent" in t or "frequently" in t: return 9
    if "rarely" in t: return 2
    return 5

def parse_body_temp(text):
    if not text: return 37.0
    t = text.lower()
    m = re.search(r'(\d{2}(?:\.\d)?)\s*([cf])', t)
    if m:
        val = float(m.group(1)); unit = m.group(2)
        if unit == "f": val = (val - 32) * 5/9
        return val
    if "high fever" in t: return 39.0
    if "mild fever" in t: return 37.8
    if "normal" in t: return 36.9
    if "fever" in t: return 38.5
    return 37.0

def guess_air_quality(text):
    if not text: return "Good"
    t = text.lower()
    if "very poor" in t or "polluted" in t: return "Very Poor"
    if "poor" in t: return "Poor"
    if "moderate" in t or "average" in t: return "Moderate"
    return "Good"

def guess_environment(text):
    if not text: return "Rural"
    t = text.lower()
    if "industrial" in t: return "Industrial"
    if "urban" in t or "city" in t: return "Urban"
    if "coastal" in t or "beach" in t: return "Coastal"
    return "Rural"

def guess_severity(text):
    if not text: return "Moderate"
    t = text.lower()
    if "severe" in t: return "Severe"
    if "mild" in t: return "Mild"
    return "Moderate"

def guess_rainfall(text, precip_sum):
    if not text: return precip_sum or 40.0
    t = text.lower()
    if "stagnant water" in t or "waterlogging" in t: return 180.0
    if "monsoon" in t or "rain" in t or "rainy" in t: return 120.0
    if precip_sum > 5: return 120.0
    return 40.0

def predict_from_data(input_data):
    description = input_data.get('description', '')
    
    # Weather features for XGBoost regressors
    temp_avg = float(input_data.get('Lag1_Temp_Avg', 28.0))
    dew_avg = float(input_data.get('Lag1_Dew_Avg', 24.0))
    precip_sum = float(input_data.get('Lag1_Precip_Sum', 100.0))
    
    X_weather = pd.DataFrame([{
        'Lag1_Temp_Avg': temp_avg,
        'Lag1_Dew_Avg': dew_avg,
        'Lag1_Precip_Sum': precip_sum
    }])
    
    predictions = {}
    for disease in disease_targets:
        if disease in models:
            pred = models[disease].predict(X_weather)[0]
            predictions[disease] = max(0.0, float(pred))
        else:
            predictions[disease] = 0.0
            
    # Category Prediction
    top_disease = "Unknown"
    
    if category_model and description:
        try:
            weather_text = f" Temperature: {temp_avg}°C, Precipitation: {precip_sum}mm"
            combined_text = description + weather_text
            
            row = {
                "Symptom_Description": combined_text,
                "Local_Temperature_C": temp_avg,
                "Body_Temperature_C": parse_body_temp(combined_text),
                "Rainfall_mm": guess_rainfall(combined_text, precip_sum),
                "Handwash_Frequency_Per_Day": parse_handwash(combined_text),
                "Air_Quality": guess_air_quality(combined_text),
                "Environment_Surrounding": guess_environment(combined_text),
                "Symptom_Severity": guess_severity(combined_text),
            }
            
            X_cat = pd.DataFrame([row])
            top_disease = category_model.predict(X_cat)[0]
        except Exception as e:
            # Fallback to max cases if classification fails
            top_disease = max(predictions.items(), key=lambda k: k[1])[0] if predictions else "Unknown"
    else:
        # Fallback
        top_disease = max(predictions.items(), key=lambda k: k[1])[0] if predictions else "Unknown"

    return {
        "prediction": {
            "category": top_disease,
            "cases": predictions,
            "features": {
                "Lag1_Temp_Avg": temp_avg,
                "Lag1_Dew_Avg": dew_avg,
                "Lag1_Precip_Sum": precip_sum
            }
        }
    }

if __name__ == "__main__":
    try:
        input_data = json.load(sys.stdin)
        result = predict_from_data(input_data)
        print(json.dumps(result))
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Error: {str(e)}"}), file=sys.stderr)
        sys.exit(1)
