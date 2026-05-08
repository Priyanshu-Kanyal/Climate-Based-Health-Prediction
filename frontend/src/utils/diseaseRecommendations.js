/**
 * Get recommendations, suggestions, and precautionary measures based on disease category
 */

export function getDiseaseRecommendations(category) {
    const categoryLower = (category || '').toLowerCase();
    const recommendations = {
        vectorBorne: {
            title: "Vector Borne Disease - Recommendations & Precautions",
            icon: "🦟",
            color: "danger",
            precautions: [
                "Use mosquito nets while sleeping, especially during dusk and dawn",
                "Apply mosquito repellents containing DEET, picaridin, or oil of lemon eucalyptus",
                "Wear long-sleeved shirts and long pants, especially in the evening",
                "Remove stagnant water sources around your home (flower pots, buckets, old tires)",
                "Use window and door screens to prevent mosquitoes from entering",
                "Consider using mosquito coils or electric vaporizers in living areas",
                "Keep your surroundings clean and dry",
                "Empty and clean water containers regularly",
                "Use larvicides in water bodies that cannot be emptied",
                "Seek medical attention immediately if you experience fever, chills, or body aches"
            ],
            suggestions: [
                "Install mosquito nets on all windows and doors",
                "Keep your compound free of water-logging areas",
                "Use mosquito-repellent plants like citronella, neem, or marigold",
                "Coordinate with local authorities for fogging and vector control measures",
                "Monitor for symptoms and seek early treatment",
                "Stay indoors during peak mosquito activity hours (dusk to dawn)"
            ],
            environmental: [
                "High humidity and standing water increase mosquito breeding",
                "Warm temperatures (25-35°C) are optimal for mosquito activity",
                "Rainfall creates breeding sites - be extra cautious after rain",
                "Rural and urban areas with poor drainage are high-risk zones"
            ]
        },
        waterBorne: {
            title: "Water Borne Disease - Recommendations & Precautions",
            icon: "💧",
            color: "primary",
            precautions: [
                "Drink only boiled or properly filtered water",
                "Use water purifiers or water treatment tablets when clean water is unavailable",
                "Avoid drinking water from unknown or contaminated sources",
                "Wash hands frequently with soap and clean water, especially before eating",
                "Maintain proper hygiene and sanitation practices",
                "Avoid raw or undercooked food, especially seafood",
                "Wash fruits and vegetables thoroughly before consumption",
                "Store water in clean, covered containers",
                "Avoid swimming in contaminated water bodies",
                "Seek immediate medical attention for diarrhea, vomiting, or dehydration symptoms"
            ],
            suggestions: [
                "Install water filtration systems in your home",
                "Regularly test water quality from your water source",
                "Use chlorine tablets or other water disinfectants when necessary",
                "Maintain clean water storage containers",
                "Ensure proper waste disposal and sewage management",
                "Educate family members about safe water practices"
            ],
            environmental: [
                "High precipitation increases risk of water contamination",
                "Flooded areas have higher risk of water-borne diseases",
                "Poor sanitation and drainage systems increase disease spread",
                "Temperature between 20-32°C favors bacterial growth in water"
            ]
        },
        airBorne: {
            title: "Air Borne Disease - Recommendations & Precautions",
            icon: "💨",
            color: "info",
            precautions: [
                "Wear masks in crowded places and poorly ventilated areas",
                "Maintain good ventilation in living and working spaces",
                "Practice respiratory hygiene: cover mouth and nose when coughing or sneezing",
                "Avoid close contact with individuals showing respiratory symptoms",
                "Wash hands frequently with soap and water or use hand sanitizer",
                "Maintain social distancing in public places",
                "Avoid touching your face, especially eyes, nose, and mouth",
                "Stay home if you experience respiratory symptoms",
                "Get vaccinated against preventable airborne diseases (if available)",
                "Seek medical attention for persistent cough, fever, or breathing difficulties"
            ],
            suggestions: [
                "Improve indoor air quality with air purifiers if needed",
                "Keep windows open for proper air circulation",
                "Avoid crowded and closed spaces",
                "Use face masks that provide adequate protection",
                "Maintain good overall health and immunity",
                "Follow local health advisories and guidelines"
            ],
            environmental: [
                "Poor air quality increases respiratory disease risk",
                "Low wind speed leads to stagnant air and higher transmission risk",
                "High humidity (60-80%) can increase droplet survival",
                "Urban and industrial areas often have poorer air quality",
                "Temperature between 15-25°C is optimal for many airborne pathogens"
            ]
        },
        contactInfectious: {
            title: "Contact/Infectious Disease - Recommendations & Precautions",
            icon: "⚠️",
            color: "warning",
            precautions: [
                "Practice strict personal hygiene - wash hands frequently with soap",
                "Avoid close contact with infected individuals",
                "Isolate yourself if you show symptoms to prevent spread",
                "Use separate utensils, towels, and personal items",
                "Disinfect frequently touched surfaces regularly",
                "Wear gloves when caring for infected individuals",
                "Avoid sharing personal items like towels, razors, or clothing",
                "Follow medical advice strictly and complete prescribed treatments",
                "Monitor symptoms closely and report any worsening condition",
                "Seek immediate medical attention for severe symptoms"
            ],
            suggestions: [
                "Maintain a clean and hygienic living environment",
                "Follow proper waste disposal practices",
                "Ensure proper ventilation in living spaces",
                "Stay informed about disease prevention measures",
                "Coordinate with healthcare providers for proper management",
                "Educate family members about prevention and early symptoms"
            ],
            environmental: [
                "Moderate temperatures (20-30°C) favor pathogen survival",
                "High humidity can increase pathogen transmission",
                "Poor sanitation increases disease spread risk",
                "Crowded living conditions increase contact transmission",
                "Water-logged areas after rainfall increase infection risk"
            ]
        }
    };

    if (categoryLower.includes('vector')) {
        return recommendations.vectorBorne;
    } else if (categoryLower.includes('water')) {
        return recommendations.waterBorne;
    } else if (categoryLower.includes('air')) {
        return recommendations.airBorne;
    } else if (categoryLower.includes('infectious') || categoryLower.includes('cautious') || categoryLower.includes('contact')) {
        return recommendations.contactInfectious;
    }

    // Default recommendations
    return {
        title: "General Health Recommendations",
        icon: "🏥",
        color: "secondary",
        precautions: [
            "Maintain good personal hygiene",
            "Stay hydrated and eat nutritious food",
            "Get adequate rest and sleep",
            "Seek medical attention for persistent symptoms",
            "Follow healthcare provider's advice"
        ],
        suggestions: [
            "Maintain a healthy lifestyle",
            "Stay informed about health advisories",
            "Practice preventive measures"
        ],
        environmental: [
            "Environmental conditions affect disease risk",
            "Monitor weather and environmental factors",
            "Take appropriate precautions based on conditions"
        ]
    };
}

