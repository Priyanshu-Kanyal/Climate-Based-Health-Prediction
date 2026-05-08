/**
 * Utility functions to calculate disease risk based on weather conditions
 */

/**
 * Calculate disease risk scores for each category based on weather conditions
 * @param {Object} weatherData - Weather data at a specific time
 * @param {Object} mlFeatures - ML model features (environment, air quality, etc.)
 * @returns {Object} Risk scores for each disease category (0-100)
 */
export function calculateDiseaseRisks(weatherData, mlFeatures = {}) {
    const {
        temperature = 25,
        humidity = 50,
        precipitation = 0,
        precipProb = 0,
        wind = 0
    } = weatherData;

    const {
        environment = 'Rural',
        air_quality = 'Good',
        symptom_severity = 'Moderate'
    } = mlFeatures;

    // Initialize risk scores
    const risks = {
        vectorBorne: 0,
        waterBorne: 0,
        airBorne: 0,
        contactInfectious: 0
    };

    // Vector Borne Disease Risk Factors
    // High risk: High humidity (>70%), precipitation/stagnant water, warm temperatures (25-35°C)
    if (humidity > 70) risks.vectorBorne += 30;
    if (humidity > 80) risks.vectorBorne += 20;
    if (precipitation > 5 || precipProb > 60) risks.vectorBorne += 25;
    if (temperature >= 25 && temperature <= 35) risks.vectorBorne += 20;
    if (temperature > 35) risks.vectorBorne += 10;
    if (environment === 'Rural') risks.vectorBorne += 15;
    if (environment === 'Urban' && humidity > 75) risks.vectorBorne += 10;

    // Water Borne Disease Risk Factors
    // High risk: High precipitation, stagnant water conditions, high humidity
    if (precipitation > 10 || precipProb > 70) risks.waterBorne += 35;
    if (precipitation > 5) risks.waterBorne += 20;
    if (humidity > 75) risks.waterBorne += 15;
    if (temperature >= 20 && temperature <= 32) risks.waterBorne += 20;
    if (environment === 'Rural') risks.waterBorne += 10;
    if (environment === 'Urban' && precipitation > 5) risks.waterBorne += 15;

    // Air Borne Disease Risk Factors
    // High risk: Poor air quality, high humidity, low wind (stagnant air), crowded conditions
    if (air_quality === 'Very Poor') risks.airBorne += 40;
    if (air_quality === 'Poor') risks.airBorne += 25;
    if (air_quality === 'Moderate') risks.airBorne += 10;
    if (humidity > 60 && humidity < 80) risks.airBorne += 15;
    if (wind < 3) risks.airBorne += 20; // Stagnant air
    if (wind < 1) risks.airBorne += 15;
    if (temperature >= 15 && temperature <= 25) risks.airBorne += 15;
    if (environment === 'Urban') risks.airBorne += 15;
    if (environment === 'Industrial') risks.airBorne += 20;

    // Contact/Infectious Disease Risk Factors
    // High risk: High humidity, moderate temperatures, poor hygiene conditions
    if (humidity > 70) risks.contactInfectious += 20;
    if (temperature >= 20 && temperature <= 30) risks.contactInfectious += 25;
    if (temperature > 30) risks.contactInfectious += 10;
    if (symptom_severity === 'Severe') risks.contactInfectious += 30;
    if (symptom_severity === 'Moderate') risks.contactInfectious += 15;
    if (environment === 'Urban') risks.contactInfectious += 15;
    if (precipitation > 5) risks.contactInfectious += 10; // Water-related hygiene issues

    // Cap all risks at 100
    Object.keys(risks).forEach(key => {
        risks[key] = Math.min(100, Math.max(0, risks[key]));
    });

    return risks;
}

/**
 * Determine dominant disease category based on risk scores
 * @param {Object} risks - Risk scores for each category
 * @returns {string} Dominant disease category name
 */
export function getDominantDisease(risks) {
    const categories = {
        vectorBorne: 'Vector Borne',
        waterBorne: 'Water Borne',
        airBorne: 'Air Borne',
        contactInfectious: 'Contact/Infectious'
    };

    let maxRisk = 0;
    let dominant = 'Vector Borne';

    Object.entries(risks).forEach(([key, value]) => {
        if (value > maxRisk) {
            maxRisk = value;
            dominant = categories[key];
        }
    });

    return dominant;
}

/**
 * Convert air quality string to numeric value for chart
 * @param {string} airQuality - Air quality string
 * @returns {number} Numeric value (0-100)
 */
export function airQualityToNumber(airQuality) {
    const mapping = {
        'Very Poor': 20,
        'Poor': 40,
        'Moderate': 60,
        'Good': 80
    };
    return mapping[airQuality] || 60;
}

/**
 * Convert environment to numeric value for chart
 * @param {string} environment - Environment string
 * @returns {number} Numeric value
 */
export function environmentToNumber(environment) {
    const mapping = {
        'Rural': 1,
        'Urban': 2,
        'Industrial': 3,
        'Coastal': 4
    };
    return mapping[environment] || 1;
}

/**
 * Process 24-hour forecast data into 2-hour intervals with disease risks
 * @param {Array} forecast24h - 24-hour hourly forecast data
 * @param {Object} mlFeatures - ML model features
 * @param {string} predictedCategory - Predicted disease category from ML model
 * @returns {Array} Processed data for chart (12 data points, 2-hour intervals)
 */
export function processForecastData(forecast24h, mlFeatures = {}, predictedCategory = '') {
    if (!forecast24h || forecast24h.length === 0) {
        return [];
    }

    const processedData = [];
    const interval = 2; // 2-hour intervals

    // Group data into 2-hour intervals
    for (let i = 0; i < forecast24h.length; i += interval) {
        const intervalData = forecast24h.slice(i, i + interval);
        
        if (intervalData.length === 0) break;

        // Calculate averages for the 2-hour interval
        const avgTemp = intervalData.reduce((sum, d) => sum + (d.temperature || 0), 0) / intervalData.length;
        const avgHumidity = intervalData.reduce((sum, d) => sum + (d.humidity || 0), 0) / intervalData.length;
        const avgPrecipProb = intervalData.reduce((sum, d) => sum + (d.precipProb || 0), 0) / intervalData.length;
        const avgWind = intervalData.reduce((sum, d) => sum + (d.wind || 0), 0) / intervalData.length;
        
        // Estimate precipitation (assuming probability translates to mm)
        const estimatedPrecip = (avgPrecipProb / 100) * 5; // Rough estimate: 5mm max per hour

        // Calculate disease risks
        const weatherDataPoint = {
            temperature: avgTemp,
            humidity: avgHumidity,
            precipitation: estimatedPrecip,
            precipProb: avgPrecipProb,
            wind: avgWind
        };

        const risks = calculateDiseaseRisks(weatherDataPoint, mlFeatures);
        const dominant = getDominantDisease(risks);

        // Use ML prediction as base, but adjust based on weather
        let adjustedRisks = { ...risks };
        if (predictedCategory) {
            const categoryLower = predictedCategory.toLowerCase();
            if (categoryLower.includes('vector')) {
                adjustedRisks.vectorBorne = Math.min(100, risks.vectorBorne + 20);
            } else if (categoryLower.includes('water')) {
                adjustedRisks.waterBorne = Math.min(100, risks.waterBorne + 20);
            } else if (categoryLower.includes('air')) {
                adjustedRisks.airBorne = Math.min(100, risks.airBorne + 20);
            } else if (categoryLower.includes('infectious') || categoryLower.includes('cautious')) {
                adjustedRisks.contactInfectious = Math.min(100, risks.contactInfectious + 20);
            }
        }

        const time = new Date(intervalData[0].time);
        const timeLabel = `${time.getHours().toString().padStart(2, '0')}:00`;

        processedData.push({
            time: timeLabel,
            timestamp: intervalData[0].time,
            temperature: Math.round(avgTemp * 10) / 10,
            humidity: Math.round(avgHumidity),
            precipitation: Math.round(estimatedPrecip * 10) / 10,
            airQuality: airQualityToNumber(mlFeatures.air_quality || 'Good'),
            environment: environmentToNumber(mlFeatures.environment || 'Rural'),
            vectorBorne: Math.round(adjustedRisks.vectorBorne),
            waterBorne: Math.round(adjustedRisks.waterBorne),
            airBorne: Math.round(adjustedRisks.airBorne),
            contactInfectious: Math.round(adjustedRisks.contactInfectious),
            dominantDisease: dominant
        });
    }

    return processedData;
}

