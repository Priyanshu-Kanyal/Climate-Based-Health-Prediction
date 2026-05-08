# ML Model Integration Guide

## Overview
This document describes the integration of the ML disease category prediction model into the SevaSuraksha application.

## Architecture

### Components
1. **Frontend (React)**: `frontend/src/pages/ReportForm.jsx`
   - User interface for entering symptoms and description
   - Fetches weather data
   - Calls prediction API and displays results

2. **Backend API (Node.js/Express)**: `backend/routes/diseasePredictionRoute.js`
   - Receives description and weather data
   - Spawns Python process to run prediction
   - Returns prediction results

3. **Python Prediction Script**: `ML MODEL/predict_api.py`
   - Loads the trained ML model
   - Processes description and weather data
   - Returns disease category prediction

4. **ML Model**: `ML MODEL/disease_category_model_local.joblib`
   - Trained scikit-learn model
   - Predicts disease categories: Vector Borne, Water Borne, Air Borne, or Caution: Infectious

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd "ML MODEL"
pip install -r requirements.txt
```

Required packages:
- joblib >= 1.3.0
- pandas >= 1.5.0
- numpy >= 1.23.0
- scikit-learn >= 1.2.0

### 2. Verify Model File
Ensure `disease_category_model_local.joblib` exists in the `ML MODEL` directory.

### 3. Test Python Script
```bash
cd "ML MODEL"
python predict_api.py
```

Input test JSON:
```json
{
  "description": "Patient has high fever, body temperature 39°C, experiencing nausea and vomiting. Recent rainfall with stagnant water.",
  "weather": {
    "temperature": 32.5,
    "humidity": 75,
    "precipitation": 15.5,
    "windSpeed": 5.2
  }
}
```

### 4. Start Backend Server
```bash
cd backend
npm install  # if not already installed
npm start
```

Backend should run on `http://localhost:5000`

### 5. Start Frontend
```bash
cd frontend
npm install  # if not already installed
npm run dev
```

Frontend should run on `http://localhost:3000`

## Usage Flow

### Step 1: Enter Location
- User can either:
  - Use "Use Current Location" to get GPS coordinates
  - Manually select State → District → City/Village

### Step 2: Get Weather Data (Optional but Recommended)
- Click "Get Weather" button
- Weather data includes:
  - Temperature
  - Humidity
  - Precipitation
  - Wind Speed

### Step 3: Enter Description
- Enter symptoms and health conditions in the description textarea
- Include:
  - Symptoms (fever, nausea, etc.)
  - Body temperature
  - Environmental conditions
  - Weather-related information

### Step 4: Get Prediction
- Click "Predict Disease Category" button
- System will:
  1. Combine description with weather data
  2. Send to backend API
  3. Backend spawns Python process
  4. Python script processes data and returns prediction
  5. Results displayed on the page

## API Endpoints

### POST `/api/disease-prediction/predict`

**Request Body:**
```json
{
  "description": "Patient has high fever, body temperature 39°C...",
  "weather": {
    "temperature": 32.5,
    "humidity": 75,
    "precipitation": 15.5,
    "windSpeed": 5.2
  }
}
```

**Response:**
```json
{
  "success": true,
  "prediction": "Vector Borne",
  "features": {
    "local_temperature_c": 32.5,
    "body_temperature_c": 39.0,
    "rainfall_mm": 120.0,
    "handwash_frequency": 5,
    "air_quality": "Good",
    "environment": "Rural",
    "symptom_severity": "Severe"
  }
}
```

## Prediction Categories

1. **Vector Borne Disease** 🦟
   - Diseases transmitted by mosquitoes, ticks, fleas
   - Examples: Malaria, Dengue, Zika

2. **Water Borne Disease** 💧
   - Diseases transmitted through contaminated water
   - Examples: Cholera, Typhoid, Diarrhea

3. **Air Borne Disease** 💨
   - Diseases transmitted through air/respiratory droplets
   - Examples: Tuberculosis, Influenza, COVID-19

4. **Caution: Infectious Disease** ⚠️
   - Potentially infectious diseases requiring caution
   - Requires preventive measures and monitoring

## Features Extracted from Description

The model extracts the following features from the description:

1. **Body Temperature**: Parsed from text (e.g., "39°C", "high fever")
2. **Rainfall**: Detected from keywords (e.g., "monsoon", "stagnant water")
3. **Handwash Frequency**: Parsed from text (e.g., "3 times per day")
4. **Air Quality**: Inferred from keywords (e.g., "polluted", "poor")
5. **Environment**: Inferred from keywords (e.g., "urban", "rural", "industrial")
6. **Symptom Severity**: Inferred from keywords (e.g., "severe", "mild")

## Weather Data Integration

When weather data is available:
- **Local Temperature**: Used directly from weather API
- **Precipitation**: Used to estimate rainfall if not mentioned in description
- **Humidity & Wind Speed**: Added to description context

## Troubleshooting

### Python Command Not Found
**Windows:**
- Use `py` command (Python Launcher)
- Or install Python and add to PATH

**Linux/Mac:**
- Use `python3` command
- Install Python 3.8+ if not available

### Model File Not Found
- Ensure `disease_category_model_local.joblib` exists in `ML MODEL` directory
- Check file permissions

### Module Not Found (Python)
```bash
pip install -r requirements.txt
```

### Backend Can't Spawn Python Process
- Check Python is installed and in PATH
- Verify script path is correct
- Check file permissions on `predict_api.py`

### Prediction Returns Error
- Check backend logs for Python script errors
- Verify input JSON format is correct
- Ensure model file is not corrupted

## File Structure

```
SevaSuraksha/
├── ML MODEL/
│   ├── disease_category_model_local.joblib  # Trained model
│   ├── predict_api.py                       # Prediction script
│   ├── requirements.txt                     # Python dependencies
│   └── README_SETUP.md                      # Setup instructions
├── backend/
│   ├── routes/
│   │   └── diseasePredictionRoute.js        # API route
│   └── server.js                            # Server configuration
└── frontend/
    └── src/
        └── pages/
            └── ReportForm.jsx               # UI component
```

## Future Enhancements

1. **Caching**: Cache predictions for similar inputs
2. **Batch Processing**: Support multiple predictions at once
3. **Confidence Scores**: Add prediction confidence/probability
4. **Model Versioning**: Support multiple model versions
5. **API Authentication**: Add authentication for prediction endpoint
6. **Error Handling**: Improved error messages and logging
7. **Performance**: Optimize Python script startup time

## Notes

- The Python script is spawned as a subprocess for each prediction
- For production, consider using a Python microservice (Flask/FastAPI) for better performance
- Model file should be kept secure and not exposed publicly
- Weather data is optional but improves prediction accuracy



