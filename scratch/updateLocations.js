const fs = require('fs');
const https = require('https');

async function updateData() {
    const { indiaLocationData } = await import('file:///' + process.cwd().replace(/\\/g, '/') + '/frontend/src/data/indiaLocationData.js');
    
    https.get('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const fullData = JSON.parse(data);
            
            // Deep clone
            let existingData = JSON.parse(JSON.stringify(indiaLocationData));
            
            // Merge
            fullData.states.forEach(stateObj => {
                const stateName = stateObj.state;
                if (!existingData[stateName]) {
                    existingData[stateName] = {};
                }
                stateObj.districts.forEach(district => {
                    if (!existingData[stateName][district]) {
                        existingData[stateName][district] = {};
                    }
                });
            });
            
            // Write back
            const newContent = `// Indian Location Data - States, Districts, Cities/Villages, and Pincodes
export const indiaLocationData = ${JSON.stringify(existingData, null, 2)};

export const getStates = () => {
  return Object.keys(indiaLocationData).sort();
};

export const getDistricts = (state) => {
  if (!state || !indiaLocationData[state]) return [];
  return Object.keys(indiaLocationData[state]).sort();
};

export const getCitiesVillages = (state, district) => {
  if (!state || !district || !indiaLocationData[state] || !indiaLocationData[state][district]) return [];
  return Object.keys(indiaLocationData[state][district]).sort();
};

export const getPincode = (state, district, cityVillage) => {
  if (!state || !district || !cityVillage) return '';
  try {
    return indiaLocationData[state][district][cityVillage] || '';
  } catch (error) {
    return '';
  }
};
`;
            fs.writeFileSync('./frontend/src/data/indiaLocationData.js', newContent);
            console.log("Updated indiaLocationData.js successfully!");
        });
    }).on('error', err => {
        console.error("Error: ", err.message);
    });
}

updateData();
