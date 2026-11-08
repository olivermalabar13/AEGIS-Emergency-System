
// ===================================
// AEGIS MODEL
// ===================================

// Load saved data from LocalStorage
const savedData = localStorage.getItem("aegisData");

// Create the main state object
export const state = savedData
    ? JSON.parse(savedData)
    : {
        assessment: {
            householdName: "",
            members: 1,
            evacuationMinutes: 0
        },

        supplies: []
    };


// SAVE DATA
export function saveData() {
    localStorage.setItem("aegisData", JSON.stringify(state));
}


// UPDATE HOUSEHOLD ASSESSMENT
export function updateAssessment(data) {

    state.assessment = data;

    saveData();
}


// ADD A SUPPLY
export function addSupply(name, quantity, requiredQuantity) {

    const newSupply = {
        id: Date.now(),
        name: name,
        quantity: quantity,
        requiredQuantity: requiredQuantity
    };

    state.supplies.push(newSupply);

    saveData();
}


// EDIT A SUPPLY
export function editSupply(id, name, quantity, requiredQuantity) {

    const supply = state.supplies.find(item => item.id === id);

    if (!supply) return;

    supply.name = name;
    supply.quantity = quantity;
    supply.requiredQuantity = requiredQuantity;

    saveData();
}


// DELETE A SUPPLY
export function deleteSupply(id) {

    state.supplies = state.supplies.filter(item => item.id !== id);

    saveData();
}


// CALCULATE PREPAREDNESS SCORE
export function calculateScore() {

    let supplyScore = 0;

    if (state.supplies.length > 0) {

        let totalQuantity = 0;
        let totalRequired = 0;

        state.supplies.forEach(item => {

            totalQuantity += Math.min(
                item.quantity,
                item.requiredQuantity
            );

            totalRequired += item.requiredQuantity;

        });

        if (totalRequired > 0) {
            supplyScore = (totalQuantity / totalRequired) * 100;
        }
    }

    
// Check evacuation readiness
let evacuationScore = 0;

if (
    state.assessment.evacuationMinutes > 0 &&
    state.assessment.evacuationMinutes <= 15
) {
    evacuationScore = 100;
}
else if (state.assessment.evacuationMinutes <= 30 &&
         state.assessment.evacuationMinutes > 15) {
    evacuationScore = 70;
}
else if (state.assessment.evacuationMinutes > 30) {
    evacuationScore = 40;
}


    // Supplies are worth 80%, evacuation is worth 20%
    const finalScore = (supplyScore * 0.8) +
                       (evacuationScore * 0.2);

    return Math.round(finalScore);
}


// CLASSIFY PREPAREDNESS LEVEL
export function getReadinessLevel() {

    const score = calculateScore();

    if (score >= 80) {
        return "High Readiness";
    }
    else if (score >= 60) {
        return "Moderate Readiness";
    }
    else {
        return "Low Readiness";
    }
}
