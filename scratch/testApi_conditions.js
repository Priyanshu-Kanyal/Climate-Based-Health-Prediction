const http = require('http');

const scenarios = [
  {
    name: "Scenario A: High Rainfall + Vector keywords",
    payload: {
      description: "mosquito bites, high fever",
      Lag1_Temp_Avg: 30.0,
      Lag1_Dew_Avg: 26.0,
      Lag1_Precip_Sum: 150.0
    }
  },
  {
    name: "Scenario B: Dry + Air-Borne keywords",
    payload: {
      description: "persistent dry cough, breathing difficulties",
      Lag1_Temp_Avg: 15.0,
      Lag1_Dew_Avg: 10.0,
      Lag1_Precip_Sum: 0.0
    }
  },
  {
    name: "Scenario C: Moderate + Contact keywords",
    payload: {
      description: "skin rashes, close contact",
      Lag1_Temp_Avg: 25.0,
      Lag1_Dew_Avg: 20.0,
      Lag1_Precip_Sum: 2.0
    }
  },
  {
    name: "Scenario D: High Rainfall + Water-Borne keywords",
    payload: {
      description: "loose motion, stomach cramps, dehydration",
      Lag1_Temp_Avg: 28.0,
      Lag1_Dew_Avg: 25.0,
      Lag1_Precip_Sum: 200.0
    }
  }
];

async function runTests() {
  for (const scenario of scenarios) {
    console.log(`\n--- ${scenario.name} ---`);
    console.log(`Input: Temp=${scenario.payload.Lag1_Temp_Avg}°C, Precip=${scenario.payload.Lag1_Precip_Sum}mm`);
    console.log(`Symptoms: "${scenario.payload.description}"`);
    
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
            console.log(`--> Predicted Category: ${parsed.prediction.category}`);
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
