import joblib
import pandas as pd
import numpy as np
import re

# Load the balanced model pipeline
model = joblib.load("disease_category_model_local.joblib")

def parse_handwash(text):
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
    t = text.lower()
    if "very poor" in t or "polluted" in t: return "Very Poor"
    if "poor" in t: return "Poor"
    if "moderate" in t or "average" in t: return "Moderate"
    return "Good"

def guess_environment(text):
    t = text.lower()
    if "industrial" in t: return "Industrial"
    if "urban" in t or "city" in t: return "Urban"
    if "coastal" in t or "beach" in t: return "Coastal"
    return "Rural"

def guess_severity(text):
    t = text.lower()
    if "severe" in t: return "Severe"
    if "mild" in t: return "Mild"
    return "Moderate"

def guess_rainfall(text):
    t = text.lower()
    if "stagnant water" in t or "waterlogging" in t: return 180.0
    if "monsoon" in t or "rain" in t: return 120.0
    return 40.0

def predict_from_summary(summary, local_temperature_c=None):
    row = {
        "Symptom_Description": summary,
        "Local_Temperature_C": local_temperature_c or 30.0,
        "Body_Temperature_C": parse_body_temp(summary),
        "Rainfall_mm": guess_rainfall(summary),
        "Handwash_Frequency_Per_Day": parse_handwash(summary),
        "Air_Quality": guess_air_quality(summary),
        "Environment_Surrounding": guess_environment(summary),
        "Symptom_Severity": guess_severity(summary),
    }
    X = pd.DataFrame([row])
    pred = model.predict(X)[0]
    return pred

if __name__ == "__main__":
    text = input("Enter symptom description:\n> ")
    print("\nPredicted Disease Type:", predict_from_summary(text))
