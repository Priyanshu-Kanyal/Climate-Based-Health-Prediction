import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getStates, getDistricts, getCitiesVillages, getPincode } from '../data/indiaLocationData';

// Helper function to find the closest matching state name
const findMatchingState = (stateName) => {
    if (!stateName) return '';
    const states = getStates();
    const normalizedInput = stateName.toLowerCase().trim();
    
    // Exact match
    const exactMatch = states.find(s => s.toLowerCase() === normalizedInput);
    if (exactMatch) return exactMatch;
    
    // Partial match
    const partialMatch = states.find(s => 
        s.toLowerCase().includes(normalizedInput) || 
        normalizedInput.includes(s.toLowerCase())
    );
    if (partialMatch) return partialMatch;
    
    // Return original if no match found
    return stateName;
};

const initialState = {
    name: '',
    age: '',
    village: '',
    symptoms: '',
    country: 'IN',
    stateName: '',
    district: '',
    cityVillage: '',
    pincode: '',
    contaminant: '',
    ph: '',
    turbidity: '',
    oxygen: '',
    nitrate: '',
    lead: '',
    bacteria: '',
    rainfall: '',
    temperature: '',
    waterSource: '',
    waterTreatment: '',
    symptomsSelect: '',
    description: '',
};



const ReportForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialState);
    const [result, setResult] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast24h, setForecast24h] = useState([]);
    const [forecastSummary, setForecastSummary] = useState('');
    
    // Location mode: 'auto' or 'manual'
    const [locationMode, setLocationMode] = useState('manual');
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableCitiesVillages, setAvailableCitiesVillages] = useState([]);
    const [currentCoordinates, setCurrentCoordinates] = useState(null); // Store coordinates from geolocation
    
    // Custom location state
    const [isDistrictOther, setIsDistrictOther] = useState(false);
    const [isCityOther, setIsCityOther] = useState(false);
    
    // Symptom toggles
    const [useSymptomToggle, setUseSymptomToggle] = useState(false);
    const [selectedSymptomsList, setSelectedSymptomsList] = useState([]);
    
    const commonSymptoms = [
        "Nausea", "Vomiting", "Rapid Fluid Loss", "Dehydration",
        "Watery Stools", "Abdominal Pain", "Bloating", "Blood in Stool",
        "High Fever", "Progressive Fever", "Headache", "Weakness",
        "Cough", "Shortness of Breath", "Fatigue", "Muscle Aches"
    ];

    const handleSymptomChange = (e) => {
        const { value, checked } = e.target;
        setSelectedSymptomsList(prev => 
            checked ? [...prev, value] : prev.filter(s => s !== value)
        );
    };
    
    // ML Prediction state
    const [mlPrediction, setMlPrediction] = useState(null);
    const [mlPredictionLoading, setMlPredictionLoading] = useState(false);
    const [mlPredictionError, setMlPredictionError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'stateName') {
            // Reset dependent fields when state changes
            setForm((prev) => ({ 
                ...prev, 
                [name]: value,
                district: '',
                cityVillage: '',
                pincode: ''
            }));
            setIsDistrictOther(false);
            setIsCityOther(false);
            // Update available districts
            if (value) {
                setAvailableDistricts(getDistricts(value));
                setAvailableCitiesVillages([]);
            } else {
                setAvailableDistricts([]);
                setAvailableCitiesVillages([]);
            }
        } else if (name === 'district') {
            // Reset dependent fields when district changes
            setForm((prev) => ({ 
                ...prev, 
                [name]: value,
                cityVillage: '',
                pincode: ''
            }));
            setIsCityOther(false);
            // Update available cities/villages
            if (value && form.stateName) {
                setAvailableCitiesVillages(getCitiesVillages(form.stateName, value));
            } else {
                setAvailableCitiesVillages([]);
            }
        } else if (name === 'cityVillage') {
            // Update pincode and village when city/village changes
            const pincode = value && form.stateName && form.district 
                ? getPincode(form.stateName, form.district, value) 
                : '';
            setForm((prev) => ({ 
                ...prev, 
                [name]: value,
                pincode: pincode,
                village: value || prev.village
            }));
        } else if (name === 'village') {
            // Allow manual override of village field
            setForm((prev) => ({ ...prev, [name]: value }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Get location from browser geolocation API
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setLocationLoading(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Store coordinates for direct weather API usage
                setCurrentCoordinates({ latitude, longitude });
                
                try {
                    // Use reverse geocoding API to get address details
                    const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
                    
                    const geoRes = await axios.get(reverseGeoUrl, {
                        headers: {
                            'User-Agent': 'SevaSuraksha Health App'
                        }
                    });
                    const address = geoRes?.data?.address || {};
                    
                    // Try to extract location details
                    let state = address.state || address.region || address.province || '';
                    const district = address.county || address.state_district || address.district || '';
                    const city = address.city || address.town || address.village || address.hamlet || address.locality || '';
                    const pincode = address.postcode || '';
                    const country = address.country_code?.toUpperCase() || 'IN';
                    
                    // Try to match state with our data structure
                    if (state) {
                        state = findMatchingState(state);
                    }
                    
                    // Update form with location data
                    setForm((prev) => ({
                        ...prev,
                        country: country,
                        stateName: state,
                        district: district,
                        cityVillage: city,
                        pincode: pincode,
                        village: city || prev.village
                    }));
                    
                    // Update available districts and cities if state is found and matches our data
                    if (state) {
                        const districts = getDistricts(state);
                        if (districts.length > 0) {
                            setAvailableDistricts(districts);
                            // Try to find matching district
                            let matchedDistrict = district;
                            if (district && !districts.includes(district)) {
                                // Try to find closest match
                                const normalizedDistrict = district.toLowerCase();
                                const match = districts.find(d => 
                                    d.toLowerCase().includes(normalizedDistrict) || 
                                    normalizedDistrict.includes(d.toLowerCase())
                                );
                                if (match) {
                                    matchedDistrict = match;
                                    setForm((prev) => ({ ...prev, district: match }));
                                }
                            }
                            
                            if (matchedDistrict && districts.includes(matchedDistrict)) {
                                const cities = getCitiesVillages(state, matchedDistrict);
                                setAvailableCitiesVillages(cities);
                                
                                // Try to find matching city/village and update pincode
                                if (city && cities.length > 0) {
                                    const normalizedCity = city.toLowerCase();
                                    const cityMatch = cities.find(c => 
                                        c.toLowerCase().includes(normalizedCity) || 
                                        normalizedCity.includes(c.toLowerCase())
                                    );
                                    if (cityMatch) {
                                        const matchedPincode = getPincode(state, matchedDistrict, cityMatch);
                                        setForm((prev) => ({ 
                                            ...prev, 
                                            cityVillage: cityMatch,
                                            pincode: matchedPincode || pincode,
                                            village: cityMatch
                                        }));
                                    }
                                }
                            }
                        }
                    }
                    
                    // If we couldn't match with our data structure, still show the retrieved data
                    if (!state || getDistricts(state).length === 0) {
                        setLocationError('Location retrieved but may not match our database. You can verify or enter manually.');
                    }
                } catch (err) {
                    setLocationError('Could not retrieve address details. Please enter location manually.');
                    console.error('Reverse geocoding error:', err);
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                setLocationLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Location access denied. Please enable location services or enter manually.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location information unavailable. Please enter manually.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Location request timed out. Please try again or enter manually.');
                        break;
                    default:
                        setLocationError('An error occurred while retrieving location. Please enter manually.');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const submitToModel = async (payload) => {
        await new Promise((res) => setTimeout(res, 900));
        let disease = '';
        let risk = 'High';
        let measures = [
            'Boil water for at least 10 minutes before drinking.',
            'Use ORS to prevent dehydration; consult nearest health center.',
            'Avoid raw foods; wash hands frequently with soap.',
            'Isolate drinking water from washing/animal areas.'
        ];

        if (payload.symptomsSelect === 'nausea, vomitting, rapid_fluid_loss, dehydration') {
            disease = 'Cholera';
        } else if (payload.symptomsSelect === 'watery_stools, abdominal_pain, bloating, blood_in_stool') {
            disease = 'Diarrhea';
        } else if (payload.symptomsSelect === 'high_fever, progressive_fever, headache, weakness') {
            disease = 'Typhoid';
        } else {
            disease = 'Unknown';
        }
        return { risk, measures, disease };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        try {
            const payload = {
                name: form.name,
                age: Number(form.age) || 0,
                village: form.village,
                symptoms: form.symptoms,
                contaminant: form.contaminant,
                ph: form.ph,
                turbidity: form.turbidity,
                oxygen: form.oxygen,
                nitrate: form.nitrate,
                lead: form.lead,
                bacteria: form.bacteria,
                rainfall: form.rainfall,
                temperature: form.temperature,
                waterSource: form.waterSource,
                waterTreatment: form.waterTreatment,
                symptomsSelect: form.symptomsSelect
            };
            const resp = await submitToModel(payload);
            setResult(resp);
        } catch (err) {
            setResult({ error: 'Failed to get prediction. Try again.' });
        }
    };

    const getWeather = async () => {
        try {
            setWeatherError('');
            setWeather(null);
            setWeatherLoading(true);

            let latitude, longitude, locationName;
            const stateName = (form.stateName || '').trim();
            const district = (form.district || '').trim();
            const pincode = (form.pincode || '').trim();
            const cityVillage = (form.cityVillage || '').trim();

            // If we have coordinates from geolocation, use them directly
            if (currentCoordinates && currentCoordinates.latitude && currentCoordinates.longitude) {
                latitude = currentCoordinates.latitude;
                longitude = currentCoordinates.longitude;
                locationName = [cityVillage, district, stateName].filter(Boolean).join(', ') || 'Current Location';
            } else {
                // Otherwise, try to geocode the location
                if (!stateName && !district && !pincode && !cityVillage) {
                    setWeatherError('Please provide location information (State, District, City/Village, or Pincode).');
                    setWeatherLoading(false);
                    return;
                }

                // Build search query - prefer more specific location info
                let searchQuery = '';
                if (pincode && pincode.length === 6) {
                    // Use pincode for Indian locations
                    searchQuery = `${pincode}, India`;
                } else if (cityVillage && district && stateName) {
                    searchQuery = `${cityVillage}, ${district}, ${stateName}, India`;
                } else if (district && stateName) {
                    searchQuery = `${district}, ${stateName}, India`;
                } else if (cityVillage && stateName) {
                    searchQuery = `${cityVillage}, ${stateName}, India`;
                } else if (stateName) {
                    searchQuery = `${stateName}, India`;
                } else {
                    searchQuery = 'India';
                }

                // Try Open-Meteo geocoding API first
                try {
                    const geoParams = new URLSearchParams({
                        name: searchQuery,
                        count: '1',
                        language: 'en',
                        format: 'json',
                    });

                    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?${geoParams.toString()}`;
                    const geoRes = await axios.get(geoUrl, { timeout: 10000 });
                    const place = geoRes?.data?.results?.[0];
                    
                    if (place && place.latitude && place.longitude) {
                        latitude = place.latitude;
                        longitude = place.longitude;
                        locationName = place.name || searchQuery;
                    } else {
                        throw new Error('No results from Open-Meteo geocoding');
                    }
                } catch (geoError) {
                    // Fallback to Nominatim geocoding for better Indian location support
                    console.log('Open-Meteo geocoding failed, trying Nominatim...', geoError);
                    
                    // Try increasingly broad searches if the specific one fails
                    const searchQueries = [
                        searchQuery,
                        `${district}, ${stateName}, India`,
                        `${stateName}, India`
                    ].filter(Boolean); // Remove empty strings

                    let placeFound = null;

                    for (const query of searchQueries) {
                        try {
                            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=in`;
                            const nominatimRes = await axios.get(nominatimUrl, {
                                headers: {
                                    'User-Agent': 'SevaSuraksha Health App'
                                },
                                timeout: 10000
                            });
                            
                            if (nominatimRes.data && nominatimRes.data.length > 0) {
                                placeFound = nominatimRes.data[0];
                                locationName = placeFound.display_name || query;
                                break; // Stop trying if we found a match
                            }
                        } catch (err) {
                            console.log(`Nominatim query failed for ${query}`);
                        }
                    }

                    if (placeFound) {
                        latitude = parseFloat(placeFound.lat);
                        longitude = parseFloat(placeFound.lon);
                    } else {
                        console.error('All geocoding APIs and fallbacks failed.');
                        setWeatherError(`Could not resolve location based on provided details. Please try "Use Current Location" or double text your District and State.`);
                        setWeatherLoading(false);
                        return;
                    }
                }
            }

            // Fetch weather data using coordinates
            const weatherParams = new URLSearchParams({
                latitude: String(latitude),
                longitude: String(longitude),
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation',
                hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m',
                timezone: 'auto',
            });
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`;
            const weatherRes = await axios.get(weatherUrl, { timeout: 10000 });

            const current = weatherRes?.data?.current;
            if (!current) {
                setWeatherError('Weather data not available for this location.');
                setWeatherLoading(false);
                return;
            }

            // Build display name from form data if available
            const displayLocationName = locationName || [cityVillage, district, stateName].filter(Boolean).join(', ') || 'Unknown Location';

            setWeather({
                locationName: displayLocationName,
                admin1: stateName || '',
                country: 'India',
                latitude,
                longitude,
                temperature: current.temperature_2m,
                apparentTemperature: current.apparent_temperature,
                humidity: current.relative_humidity_2m,
                windSpeed: current.wind_speed_10m,
                precipitation: current.precipitation,
            });

            // Build a simple 24h forecast view from hourly arrays
            const hourly = weatherRes?.data?.hourly || {};
            const times = hourly.time || [];
            const temps = hourly.temperature_2m || [];
            const hums = hourly.relative_humidity_2m || [];
            const probs = hourly.precipitation_probability || [];
            const winds = hourly.wind_speed_10m || [];

            const now = Date.now();
            const next24 = [];
            for (let i = 0; i < times.length; i++) {
                const t = times[i];
                const ts = Date.parse(t);
                if (isNaN(ts)) continue;
                if (ts >= now && next24.length < 24) {
                    next24.push({
                        time: t,
                        temperature: temps[i],
                        humidity: hums[i],
                        precipProb: probs[i],
                        wind: winds[i],
                    });
                }
                if (next24.length >= 24) break;
            }
            setForecast24h(next24);

            // Create a short plain-English summary
            if (next24.length) {
                const maxTemp = Math.max(...next24.map(h => Number(h.temperature) || -Infinity));
                const minTemp = Math.min(...next24.map(h => Number(h.temperature) || Infinity));
                const maxWind = Math.max(...next24.map(h => Number(h.wind) || 0));
                const wetHours = next24.filter(h => Number(h.precipProb) >= 60).length;
                const avgHum = Math.round(next24.reduce((s,h) => s + (Number(h.humidity)||0), 0) / next24.length);

                const lines = [];
                lines.push(`Temp range next 24h: ${Math.round(minTemp)}°C to ${Math.round(maxTemp)}°C.`);
                if (wetHours > 0) lines.push(`Rain likely for ~${wetHours} hour(s) (≥60% probability).`);
                lines.push(`Average humidity around ${avgHum}%.`);
                if (maxWind >= 12) {
                    lines.push(`Wind may be breezy/gusty (peaks near ${Math.round(maxWind)} m/s).`);
                }
                if (maxTemp >= 35 && avgHum >= 60) {
                    lines.push('Heat stress conditions possible during warmest hours; hydrate and rest in shade.');
                }
                if (wetHours >= 3 && avgHum >= 70) {
                    lines.push('Prolonged dampness may persist; manage standing water to reduce mosquito breeding.');
                }
                setForecastSummary(lines.join(' '));
            } else {
                setForecastSummary('No hourly forecast available.');
            }
        } catch (err) {
            console.error('Weather fetch error:', err);
            setWeatherError(err?.response?.data?.error || err?.message || 'Failed to fetch weather. Please check your location and try again.');
        } finally {
            setWeatherLoading(false);
        }
    };

    // Get ML Prediction for disease category
    const getMLPrediction = async () => {
        try {
            setMlPredictionError('');
            setMlPrediction(null);
            setMlPredictionLoading(true);

            let description = (form.description || '').trim();
            
            if (useSymptomToggle && selectedSymptomsList.length > 0) {
                const symptomsText = "Patient exhibits symptoms: " + selectedSymptomsList.join(", ");
                description = description ? `${symptomsText}. ${description}` : symptomsText;
            }

            if (!description) {
                setMlPredictionError('Please select symptoms or provide a description of symptoms and conditions.');
                setMlPredictionLoading(false);
                return;
            }

            // Prepare weather data if available
            const weatherData = weather ? {
                temperature: weather.temperature,
                apparentTemperature: weather.apparentTemperature,
                humidity: weather.humidity,
                windSpeed: weather.windSpeed,
                precipitation: weather.precipitation
            } : null;

            // Approximate Lag 1 features based on current weather or form defaults
            const lag1Temp = weatherData ? weatherData.temperature : (parseFloat(form.temperature) || 28.0);
            const lag1Precip = weatherData ? (weatherData.precipitation || 0) * 30 : (parseFloat(form.rainfall) || 120.0);
            // Rough dew point approximation (T - (100-RH)/5)
            const lag1Dew = weatherData ? weatherData.temperature - ((100 - (weatherData.humidity || 60)) / 5) : 24.0;

            // Call prediction API
            const response = await axios.post('http://localhost:5000/api/disease-prediction/predict', {
                description: description,
                weather: weatherData,
                Lag1_Temp_Avg: lag1Temp,
                Lag1_Dew_Avg: lag1Dew,
                Lag1_Precip_Sum: lag1Precip
            }, {
                timeout: 30000 // 30 second timeout for ML prediction
            });

            if (response.data && response.data.success) {
                // The backend prediction object now contains multiple diseases
                const predictionData = {
                    category: response.data.prediction?.category || 'Unknown',
                    cases: response.data.prediction?.cases || {},
                    features: response.data.prediction?.features || {}
                };
                setMlPrediction(predictionData);
                
                // Ensure we have forecast data - if not, create synthetic forecast from current weather
                let forecastData = forecast24h;
                if ((!forecastData || forecastData.length === 0) && weather) {
                    // Create synthetic 24-hour forecast from current weather data
                    // Generate 12 data points (2-hour intervals)
                    const now = new Date();
                    forecastData = [];
                    for (let i = 0; i < 12; i++) {
                        const time = new Date(now.getTime() + i * 2 * 60 * 60 * 1000);
                        // Add some variation to make it realistic
                        const tempVariation = (Math.sin(i * Math.PI / 6) * 3); // Daily temperature variation
                        const humidityVariation = (Math.sin(i * Math.PI / 6 + Math.PI) * 5); // Inverse to temp
                        
                        forecastData.push({
                            time: time.toISOString(),
                            temperature: (weather.temperature || 25) + tempVariation,
                            humidity: Math.max(30, Math.min(100, (weather.humidity || 60) + humidityVariation)),
                            precipProb: i < 3 || i > 9 ? 20 : 40, // Higher chance during certain hours
                            wind: (weather.windSpeed || 5) + (Math.random() * 2 - 1)
                        });
                    }
                    console.log('Created synthetic forecast data from current weather');
                }
                
                // Store data for dashboard and navigate
                const dashboardData = {
                    prediction: predictionData,
                    weather: weather,
                    forecast24h: forecastData || [],
                    location: {
                        state: form.stateName,
                        district: form.district,
                        cityVillage: form.cityVillage,
                        pincode: form.pincode,
                        locationName: weather?.locationName || form.cityVillage || `${form.district}, ${form.stateName}`
                    },
                    timestamp: new Date().toISOString()
                };
                
                // Store in localStorage for dashboard
                localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
                
                // Dispatch custom event to notify dashboard of data update
                window.dispatchEvent(new Event('dashboardDataUpdated'));
                
                // Show success - prediction result will be visible briefly before navigation
                console.log('Prediction successful! Navigating to dashboard...');
                
                // Navigate to dashboard after a short delay to show success message
                setTimeout(() => {
                    navigate('/dashboard', { state: { fromPrediction: true } });
                }, forecastData && forecastData.length > 0 ? 1500 : 2000);
            } else {
                setMlPredictionError(response.data?.error || 'Failed to get prediction.');
            }
        } catch (err) {
            console.error('ML Prediction error:', err);
            const errorMessage = err?.response?.data?.error || err?.message || 'Failed to get disease prediction.';
            const errorDetails = err?.response?.data?.details || '';
            setMlPredictionError(
                errorDetails 
                    ? `${errorMessage}\n\nDetails: ${errorDetails}` 
                    : errorMessage
            );
        } finally {
            setMlPredictionLoading(false);
        }
    };

    // Helper function to get category description and color
    const getCategoryInfo = (category) => {
        const categoryLower = (category || '').toLowerCase();
        if (categoryLower.includes('vector')) {
            return {
                name: 'Vector Borne Disease',
                description: 'Diseases transmitted by vectors like mosquitoes, ticks, or fleas',
                color: 'danger',
                icon: '🦟'
            };
        } else if (categoryLower.includes('water')) {
            return {
                name: 'Water Borne Disease',
                description: 'Diseases transmitted through contaminated water',
                color: 'primary',
                icon: '💧'
            };
        } else if (categoryLower.includes('air')) {
            return {
                name: 'Air Borne Disease',
                description: 'Diseases transmitted through air, respiratory droplets, or aerosols',
                color: 'info',
                icon: '💨'
            };
        } else if (categoryLower.includes('infectious') || categoryLower.includes('cautious')) {
            return {
                name: 'Caution: Infectious Disease',
                description: 'Potentially infectious disease requiring caution and preventive measures',
                color: 'warning',
                icon: '⚠️'
            };
        }
        return {
            name: category || 'Unknown',
            description: 'Disease category prediction',
            color: 'secondary',
            icon: '🔍'
        };
    };

    return (
        <>
            <Navbar />

            <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
                &nbsp;&nbsp;
                <div className="row justify-content-center">
                    &nbsp;&nbsp;
                    <div className="col-12 col-lg-16">
                        <div className="card border-light shadow-sm" style={{ backgroundColor: '#f7f7f7' }}>
                            <div className="card-body">
                                <h2 className="h2 mb-4 fw-bold">Community Health Report</h2>
                                &nbsp;&nbsp;
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-9 mb-3">
                                            <label className="form-label fw-bold">Name</label>
                                            <input name="name" className="form-control" required value={form.name} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label fw-bold">Age</label>
                                            <input name="age" type="number" min="0" className="form-control" required value={form.age} onChange={handleChange} />
                                        </div>
                                        
                                    </div>
                                    &nbsp;&nbsp;
                                    &nbsp;&nbsp;
                                    <div className="row mb-3">
                                        <div className="col-md-12">
                                            <label className="form-label fw-bold">Location</label>
                                            <div className="mb-3">
                                                <div className="form-check form-check-inline">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="radio" 
                                                        name="locationMode" 
                                                        id="locationManual" 
                                                        value="manual"
                                                        checked={locationMode === 'manual'}
                                                        onChange={(e) => {
                                                            setLocationMode(e.target.value);
                                                            setLocationError('');
                                                            setCurrentCoordinates(null); // Clear coordinates when switching to manual
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor="locationManual">
                                                        Enter Location Manually
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="radio" 
                                                        name="locationMode" 
                                                        id="locationAuto" 
                                                        value="auto"
                                                        checked={locationMode === 'auto'}
                                                        onChange={(e) => {
                                                            setLocationMode(e.target.value);
                                                            setLocationError('');
                                                            if (e.target.value === 'auto') {
                                                                getCurrentLocation();
                                                            }
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor="locationAuto">
                                                        Use Current Location
                                                    </label>
                                                </div>
                                                {locationMode === 'auto' && (
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-primary ms-2"
                                                        onClick={getCurrentLocation}
                                                        disabled={locationLoading}
                                                    >
                                                        {locationLoading ? 'Getting Location...' : 'Refresh Location'}
                                                    </button>
                                                )}
                                            </div>
                                            {locationError && (
                                                <div className="alert alert-warning alert-sm">{locationError}</div>
                                            )}
                                            {locationLoading && (
                                                <div className="text-muted small">Fetching your location...</div>
                                            )}
                                        </div>
                                    </div>

                                    {locationMode === 'manual' && (
                                        <>
                                            <div className="row">
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Country</label>
                                                    <input 
                                                        name="country" 
                                                        className="form-control" 
                                                        value="India" 
                                                        disabled 
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">State <span className="text-danger">*</span></label>
                                                    <select 
                                                        name="stateName" 
                                                        className="form-select" 
                                                        value={form.stateName} 
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select State</option>
                                                        {getStates().map((state) => (
                                                            <option key={state} value={state}>
                                                                {state}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">District <span className="text-danger">*</span></label>
                                                    <select 
                                                        className="form-select" 
                                                        value={isDistrictOther ? 'Other' : (availableDistricts.includes(form.district) ? form.district : (form.district ? 'Other' : ''))}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === 'Other') {
                                                                setIsDistrictOther(true);
                                                                setForm(prev => ({ ...prev, district: '', cityVillage: '', pincode: '' }));
                                                                setAvailableCitiesVillages([]);
                                                            } else {
                                                                setIsDistrictOther(false);
                                                                handleChange({ target: { name: 'district', value: val }});
                                                            }
                                                        }}
                                                        required={!isDistrictOther}
                                                        disabled={!form.stateName}
                                                    >
                                                        <option value="">Select District</option>
                                                        {availableDistricts.map((district) => (
                                                            <option key={district} value={district}>{district}</option>
                                                        ))}
                                                        <option value="Other">Other (Please Specify)</option>
                                                    </select>
                                                    {isDistrictOther && (
                                                        <input 
                                                            name="district" 
                                                            className="form-control mt-2" 
                                                            placeholder="Type your district"
                                                            value={form.district} 
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">City/Village <span className="text-danger">*</span></label>
                                                    <select 
                                                        className="form-select" 
                                                        value={isCityOther ? 'Other' : (availableCitiesVillages.includes(form.cityVillage) ? form.cityVillage : (form.cityVillage ? 'Other' : ''))}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === 'Other') {
                                                                setIsCityOther(true);
                                                                setForm(prev => ({ ...prev, cityVillage: '', pincode: '', village: '' }));
                                                            } else {
                                                                setIsCityOther(false);
                                                                handleChange({ target: { name: 'cityVillage', value: val }});
                                                            }
                                                        }}
                                                        required={!isCityOther}
                                                        disabled={!form.district}
                                                    >
                                                        <option value="">Select City/Village</option>
                                                        {availableCitiesVillages.map((city) => (
                                                            <option key={city} value={city}>{city}</option>
                                                        ))}
                                                        <option value="Other">Other (Please Specify)</option>
                                                    </select>
                                                    {isCityOther && (
                                                        <input 
                                                            name="cityVillage" 
                                                            className="form-control mt-2" 
                                                            placeholder="Type your city/village"
                                                            value={form.cityVillage} 
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Pincode</label>
                                                    <input 
                                                        name="pincode" 
                                                        className="form-control" 
                                                        value={form.pincode} 
                                                        readOnly
                                                        style={{ backgroundColor: '#e9ecef' }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {locationMode === 'auto' && (
                                        <div className="row">
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">Country</label>
                                                <input 
                                                    name="country" 
                                                    className="form-control" 
                                                    value={form.country || 'India'} 
                                                    disabled 
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">State</label>
                                                <input 
                                                    name="stateName" 
                                                    className="form-control" 
                                                    value={form.stateName} 
                                                    readOnly
                                                    style={{ backgroundColor: '#e9ecef' }}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">District</label>
                                                <input 
                                                    name="district" 
                                                    className="form-control" 
                                                    value={form.district} 
                                                    readOnly
                                                    style={{ backgroundColor: '#e9ecef' }}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">City/Village</label>
                                                <input 
                                                    name="cityVillage" 
                                                    className="form-control" 
                                                    value={form.cityVillage} 
                                                    readOnly
                                                    style={{ backgroundColor: '#e9ecef' }}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">Pincode</label>
                                                <input 
                                                    name="pincode" 
                                                    className="form-control" 
                                                    value={form.pincode} 
                                                    readOnly
                                                    style={{ backgroundColor: '#e9ecef' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <button type="button" className="btn btn-success" onClick={getWeather} disabled={weatherLoading}>
                                            {weatherLoading ? 'Fetching Weather…' : 'Get Weather'}
                                        </button>
                                    </div>
                                    &nbsp;&nbsp;
                                    &nbsp;&nbsp;

                                    <div className="row mb-3">
                                        <div className="col-md-12">
                                            <div className="form-check form-switch mb-3">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    id="symptomToggle" 
                                                    checked={useSymptomToggle}
                                                    onChange={(e) => setUseSymptomToggle(e.target.checked)}
                                                />
                                                <label className="form-check-label fw-bold" htmlFor="symptomToggle">
                                                    Select Symptoms Manually (Toggle to choose from a list)
                                                </label>
                                            </div>
                                            
                                            {useSymptomToggle && (
                                                <div className="card mb-4 border-light shadow-sm">
                                                    <div className="card-body">
                                                        <h6 className="mb-3">Select Symptoms</h6>
                                                        <div className="row">
                                                            {commonSymptoms.map(symptom => (
                                                                <div className="col-md-3 col-sm-6 mb-2" key={symptom}>
                                                                    <div className="form-check text-start">
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            value={symptom}
                                                                            id={`symptom-${symptom.replace(/\s+/g, '-')}`}
                                                                            checked={selectedSymptomsList.includes(symptom)}
                                                                            onChange={handleSymptomChange}
                                                                        />
                                                                        <label className="form-check-label" htmlFor={`symptom-${symptom.replace(/\s+/g, '-')}`}>
                                                                            {symptom}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 mb-3 text-center fw-bold">
                                            <label className="form-label fw-bold">Provide the Description <span className="text-muted">(Symptoms, conditions, etc.)</span></label>
                                            <textarea 
                                                name="description" 
                                                className="form-control" 
                                                required={!useSymptomToggle || selectedSymptomsList.length === 0} 
                                                value={form.description} 
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Describe the symptoms, health conditions, and any relevant environmental factors (e.g., 'Patient has high fever, body temperature 39°C, experiencing nausea and vomiting. Recent rainfall in the area with stagnant water.')"
                                            />
                                            <small className="text-muted">
                                                Tip: Include symptoms, body temperature, weather conditions, and environmental factors for better prediction accuracy.
                                            </small>
                                        </div>
                                    </div>
                                    &nbsp;&nbsp;
                                    <div className="mb-3">
                                        <button 
                                            type="button" 
                                            className="btn btn-success" 
                                            onClick={getMLPrediction} 
                                            disabled={mlPredictionLoading || (!(form.description || '').trim() && (!useSymptomToggle || selectedSymptomsList.length === 0))}
                                        >
                                            {mlPredictionLoading ? 'Analyzing Disease Category...' : 'Predict Disease Category & View Dashboard'}
                                        </button>
                                        {!weather && (
                                            <small className="text-muted d-block mt-2">
                                                💡 For better accuracy and detailed 24-hour forecasts, fetch weather data first using the "Get Weather" button above.
                                            </small>
                                        )}
                                        {weather && (!forecast24h || forecast24h.length === 0) && (
                                            <small className="text-warning d-block mt-2">
                                                ⚠️ Weather data fetched, but 24-hour forecast is not available. Chart will show limited data.
                                            </small>
                                        )}
                                    </div>

                                   
                                </form>
                            </div>
                        </div>

                        {(weatherError || weather) && (
                            <div className="card border-light shadow-sm mt-4">
                                <div className="card-body">
                                    <h3 className="h5 mb-3">Current Weather</h3>
                                    {weatherError && (
                                        <div className="alert alert-warning mb-0">{weatherError}</div>
                                    )}
                                    {weather && (
                                        <div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <strong>Location:</strong> {weather.locationName}{weather.admin1 ? `, ${weather.admin1}` : ''}{weather.country ? `, ${weather.country}` : ''}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div><strong>Temperature:</strong> {weather.temperature}°C</div>
                                                    <div><strong>Feels Like:</strong> {weather.apparentTemperature}°C</div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div><strong>Humidity:</strong> {weather.humidity}%</div>
                                                    <div><strong>Wind Speed:</strong> {weather.windSpeed} m/s</div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div><strong>Precipitation:</strong> {weather.precipitation} mm</div>
                                                    <div><strong>Coords:</strong> {weather.latitude.toFixed(3)}, {weather.longitude.toFixed(3)}</div>
                                                </div>
                                            </div>
                                            {forecast24h.length > 0 && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <h4 className="h6">Next 24 hours (key points)</h4>
                                                    <div className="table-responsive">
                                                        <table className="table table-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>Time</th>
                                                                    <th>Temp (°C)</th>
                                                                    <th>Hum (%)</th>
                                                                    <th>Rain (%)</th>
                                                                    <th>Wind (m/s)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {forecast24h.map((h) => (
                                                                    <tr key={h.time}>
                                                                        <td>{new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                                        <td>{Math.round(h.temperature)}</td>
                                                                        <td>{Math.round(h.humidity)}</td>
                                                                        <td>{Math.round(h.precipProb)}</td>
                                                                        <td>{Math.round(h.wind)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="alert alert-info" style={{ marginTop: '8px' }}>
                                                        {forecastSummary}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="card border-light shadow-sm mt-4">
                                <div className="card-body">
                                    {result.error ? (
                                        <div className="alert alert-danger mb-0">{result.error}</div>
                                    ) : (
                                        <>
                                            <h3 className="h5 mb-2">Predicted Disease: <span className="text-danger">{result.disease}</span></h3>
                                            <h3 className="h5 mb-2">Predicted Risk: <span className="text-danger">{result.risk}</span></h3>
                                            <h4 className="h6 mt-3">Precautionary & Prevention Measures</h4>
                                            <ul className="mb-0">
                                                {result.measures.map((m) => (
                                                    <li key={m}>{m}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ML Disease Category Prediction Results */}
                        {(mlPredictionError || mlPrediction) && (
                            <div className="card border-light shadow-sm mt-4">
                                <div className="card-body">
                                    <h3 className="h5 mb-3">Disease Category Prediction (ML Model)</h3>
                                    {mlPredictionError && (
                                        <div className="alert alert-danger mb-3">
                                            <strong>Error:</strong>
                                            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px', marginBottom: '0' }}>
                                                {mlPredictionError}
                                            </pre>
                                            <div className="mt-2">
                                                <small>
                                                    <strong>Tips:</strong>
                                                    <ul className="mb-0 mt-1">
                                                        <li>Ensure Python is installed and in your PATH</li>
                                                        <li>Install Python dependencies: <code>pip install -r requirements.txt</code> in ML MODEL folder</li>
                                                        <li>Verify the model file exists: <code>disease_category_model_local.joblib</code></li>
                                                        <li>Check the backend console for detailed error messages</li>
                                                    </ul>
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                    {mlPrediction && (
                                        <div>
                                            {(() => {
                                                const categoryInfo = getCategoryInfo(mlPrediction.category);
                                                return (
                                                    <div className={`alert alert-${categoryInfo.color} mb-3`}>
                                                        <h4 className="h5 mb-2">
                                                            <span>{categoryInfo.icon}</span> {categoryInfo.name}
                                                        </h4>
                                                        <p className="mb-0">{categoryInfo.description}</p>
                                                        <div className="mt-2">
                                                            <small className="text-muted">
                                                                ✅ Prediction successful! Redirecting to dashboard to view detailed 24-hour risk analysis...
                                                            </small>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            
                                            {mlPrediction.features && (
                                                <div className="mt-3">
                                                    <h5 className="h6 mb-2">Prediction Features:</h5>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <ul className="list-unstyled">
                                                                <li><strong>Local Temperature:</strong> {mlPrediction.features.local_temperature_c?.toFixed(1)}°C</li>
                                                                <li><strong>Body Temperature:</strong> {mlPrediction.features.body_temperature_c?.toFixed(1)}°C</li>
                                                                <li><strong>Rainfall:</strong> {mlPrediction.features.rainfall_mm?.toFixed(1)} mm</li>
                                                                <li><strong>Handwash Frequency:</strong> {mlPrediction.features.handwash_frequency} times/day</li>
                                                            </ul>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <ul className="list-unstyled">
                                                                <li><strong>Air Quality:</strong> {mlPrediction.features.air_quality}</li>
                                                                <li><strong>Environment:</strong> {mlPrediction.features.environment}</li>
                                                                <li><strong>Symptom Severity:</strong> {mlPrediction.features.symptom_severity}</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="mt-3">
                                                <h5 className="h6 mb-2">Recommendations:</h5>
                                                <ul>
                                                    {mlPrediction.category?.toLowerCase().includes('vector') && (
                                                        <>
                                                            <li>Use mosquito nets and repellents</li>
                                                            <li>Remove stagnant water sources</li>
                                                            <li>Wear protective clothing</li>
                                                            <li>Consider vector control measures</li>
                                                        </>
                                                    )}
                                                    {mlPrediction.category?.toLowerCase().includes('water') && (
                                                        <>
                                                            <li>Drink only boiled or filtered water</li>
                                                            <li>Avoid contaminated water sources</li>
                                                            <li>Maintain proper hygiene and sanitation</li>
                                                            <li>Practice safe water storage</li>
                                                        </>
                                                    )}
                                                    {mlPrediction.category?.toLowerCase().includes('air') && (
                                                        <>
                                                            <li>Use masks in crowded areas</li>
                                                            <li>Maintain good ventilation</li>
                                                            <li>Practice respiratory hygiene</li>
                                                            <li>Avoid close contact with infected individuals</li>
                                                        </>
                                                    )}
                                                    {(mlPrediction.category?.toLowerCase().includes('infectious') || mlPrediction.category?.toLowerCase().includes('cautious')) && (
                                                        <>
                                                            <li>Isolate if showing symptoms</li>
                                                            <li>Follow medical advice strictly</li>
                                                            <li>Maintain personal hygiene</li>
                                                            <li>Monitor symptoms closely</li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportForm;


