/**
 * Maps Indian states to their primary local languages
 */
export const stateLanguageMap = {
  "Andhra Pradesh": { code: "te", name: "Telugu", native: "తెలుగు" },
  "Arunachal Pradesh": { code: "en", name: "English", native: "English" },
  "Assam": { code: "as", name: "Assamese", native: "অসমীয়া" },
  "Bihar": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Chhattisgarh": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Goa": { code: "en", name: "English", native: "English" },
  "Gujarat": { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  "Haryana": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Himachal Pradesh": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Jammu and Kashmir": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Jharkhand": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Karnataka": { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  "Kerala": { code: "ml", name: "Malayalam", native: "മലയാളം" },
  "Madhya Pradesh": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Maharashtra": { code: "mr", name: "Marathi", native: "मराठी" },
  "Manipur": { code: "mni", name: "Manipuri", native: "ꯃꯩꯇꯩ" },
  "Meghalaya": { code: "en", name: "English", native: "English" },
  "Mizoram": { code: "en", name: "English", native: "English" },
  "Nagaland": { code: "en", name: "English", native: "English" },
  "Odisha": { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  "Punjab": { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  "Rajasthan": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Sikkim": { code: "en", name: "English", native: "English" },
  "Tamil Nadu": { code: "ta", name: "Tamil", native: "தமிழ்" },
  "Telangana": { code: "te", name: "Telugu", native: "తెలుగు" },
  "Tripura": { code: "bn", name: "Bengali", native: "বাংলা" },
  "Uttar Pradesh": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "Uttarakhand": { code: "hi", name: "Hindi", native: "हिन्दी" },
  "West Bengal": { code: "bn", name: "Bengali", native: "বাংলা" }
};

/**
 * Get language information for a state
 * @param {string} stateName - Name of the state
 * @returns {Object} Language information {code, name, native}
 */
export function getStateLanguage(stateName) {
  if (!stateName) {
    return { code: "en", name: "English", native: "English" };
  }
  
  const language = stateLanguageMap[stateName];
  return language || { code: "en", name: "English", native: "English" };
}

