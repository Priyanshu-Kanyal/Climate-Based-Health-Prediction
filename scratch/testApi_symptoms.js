const http = require('http');

const scenarios = [
  {
    name: "Group 1: Dehydration, Watery Stools, Nausea, Rapid Fluid Loss, Vomiting",
    description: "Patient exhibits symptoms: Dehydration, Watery Stools, Nausea, Rapid Fluid Loss, Vomiting",
  },
  {
    name: "Group 2: High Fever, Headache, Muscle Aches",
    description: "Patient exhibits symptoms: High Fever, Headache, Muscle Aches",
  },
  {
    name: "Group 3: Cough, Shortness of Breath, Fatigue",
    description: "Patient exhibits symptoms: Cough, Shortness of Breath, Fatigue",
  },
  {
    name: "Group 4: Progressive Fever, Weakness, Bloating",
    description: "Patient exhibits symptoms: Progressive Fever, Weakness, Bloating",
  },
  {
    name: "Group 5: Blood in Stool, Abdominal Pain",
    description: "Patient exhibits symptoms: Blood in Stool, Abdominal Pain",
  }
];

async function runTests() {
  for (const scenario of scenarios) {
    console.log(`\n--- ${scenario.name} ---`);
    
    await new Promise((resolve) => {
      // Use defaults for weather
      const data = JSON.stringify({
          description: scenario.description,
          Lag1_Temp_Avg: 25.0,
          Lag1_Dew_Avg: 20.0,
          Lag1_Precip_Sum: 50.0
      });
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
