const http = require('http');

const scenarios = [
  {
    name: "Scenario 1: High Temperature, High Rainfall",
    payload: {
      description: "Patient exhibits symptoms: High Fever, Headache, Muscle Aches. High mosquito presence due to stagnant water.",
      Lag1_Temp_Avg: 30.0,
      Lag1_Dew_Avg: 26.0,
      Lag1_Precip_Sum: 200.0
    }
  },
  {
    name: "Scenario 2: Low Temperature, Dry",
    payload: {
      description: "Patient exhibits symptoms: Cough, Shortness of Breath, Fatigue.",
      Lag1_Temp_Avg: 18.0,
      Lag1_Dew_Avg: 10.0,
      Lag1_Precip_Sum: 5.0
    }
  },
  {
    name: "Scenario 3: Moderate Temp, Moderate Rainfall (Water-borne symptoms)",
    payload: {
      description: "Patient exhibits symptoms: Nausea, Vomiting, Watery Stools, Abdominal Pain.",
      Lag1_Temp_Avg: 25.0,
      Lag1_Dew_Avg: 20.0,
      Lag1_Precip_Sum: 50.0
    }
  }
];

async function runTests() {
  for (const scenario of scenarios) {
    console.log(`\n--- ${scenario.name} ---`);
    console.log(`Input features: Temp=${scenario.payload.Lag1_Temp_Avg}, Precip=${scenario.payload.Lag1_Precip_Sum}, Symptoms=${scenario.payload.description}`);
    
    await new Promise((resolve) => {
      const data = JSON.stringify(scenario.payload);
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/disease-prediction/predict',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            console.log(`Prediction Category: ${parsed.prediction.category}`);
            console.log(`Cases Map: ${JSON.stringify(parsed.prediction.cases, null, 2)}`);
          } catch(e) {
            console.log("Error parsing response: " + body);
          }
          resolve();
        });
      });
      req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        resolve();
      });
      req.write(data);
      req.end();
    });
  }
}

runTests();
