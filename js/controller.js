
import * as Model from "./model.js";

import AssessmentView from "./views/AssessmentView.js";
import InventoryView from "./views/InventoryView.js";
import DashboardView from "./views/DashboardView.js";


// ===================================
// AEGIS CONTROLLER
// ===================================


// CREATE THE VIEW OBJECTS

const assessmentView = new AssessmentView(
    document.querySelector("#assessment")
);

const inventoryView = new InventoryView(
    document.querySelector("#inventory")
);

const dashboardView = new DashboardView(
    document.querySelector("#dashboard")
);


// ===================================
// DISPLAY ALL VIEWS
// ===================================

function renderViews() {

    // Display household assessment
    assessmentView.render(Model.state.assessment);

    // Display emergency supplies
    inventoryView.render(Model.state.supplies);

    // Prepare dashboard information
    const dashboardData = {
        score: Model.calculateScore(),

        readiness: Model.getReadinessLevel(),

        assessment: Model.state.assessment,

        supplies: Model.state.supplies
    };

    // Display dashboard
    dashboardView.render(dashboardData);


    // Attach form submission handlers
    assessmentView.addHandlerSubmit(handleAssessmentSubmit);

    inventoryView.addHandlerAdd(handleAddSupply);

}


// ===================================
// HANDLE ASSESSMENT SUBMISSION
// ===================================

function handleAssessmentSubmit(data) {

    // Check household name
    if (data.householdName === "") {
        assessmentView.renderError(
            "Please enter your household name."
        );
        return;
    }

    // Check number of household members
    if (
        !Number.isInteger(data.members) ||
        data.members < 1 ||
        data.members > 30
    ) {
        assessmentView.renderError(
            "Household members must be between 1 and 30."
        );
        return;
    }

    // Check evacuation time
    if (
        !Number.isInteger(data.evacuationMinutes) ||
        data.evacuationMinutes < 1 ||
        data.evacuationMinutes > 180
    ) {
        assessmentView.renderError(
            "Evacuation time must be between 1 and 180 minutes."
        );
        return;
    }

    // Update the Model
    Model.updateAssessment(data);

    // Refresh the application
    renderViews();

}


// ===================================
// HANDLE ADDING A SUPPLY
// ===================================

function handleAddSupply(data) {

    // Validate supply name
    if (data.name === "") {
        alert("Please enter a supply name.");
        return;
    }

    // Validate available quantity
    if (
        !Number.isInteger(data.quantity) ||
        data.quantity < 0
    ) {
        alert("Available quantity must be a whole number of 0 or more.");
        return;
    }

    // Validate required quantity
    if (
        !Number.isInteger(data.requiredQuantity) ||
        data.requiredQuantity < 1
    ) {
        alert("Required quantity must be at least 1.");
        return;
    }

    // Add the supply to the Model
    Model.addSupply(
        data.name,
        data.quantity,
        data.requiredQuantity
    );

    // Refresh the application
    renderViews();

}


// ===================================
// HANDLE EDIT AND DELETE ACTIONS
// ===================================

function handleInventoryAction(action, id) {

    // FIND THE SELECTED SUPPLY
    const supply = Model.state.supplies.find(item => {
        return item.id === id;
    });

    if (!supply) return;


    // EDIT SUPPLY
    if (action === "edit") {

        const newName = prompt(
            "Enter the supply name:",
            supply.name
        );

        if (newName === null) return;

        const newQuantity = prompt(
            "Enter the available quantity:",
            supply.quantity
        );

        if (newQuantity === null) return;

        const newRequired = prompt(
            "Enter the required quantity:",
            supply.requiredQuantity
        );

        if (newRequired === null) return;


        const name = newName.trim();
        const quantity = Number(newQuantity);
        const requiredQuantity = Number(newRequired);


        // VALIDATE EDITED INFORMATION
        if (
            name === "" ||
            !Number.isInteger(quantity) ||
            quantity < 0 ||
            !Number.isInteger(requiredQuantity) ||
            requiredQuantity < 1
        ) {
            alert("Please enter valid supply information.");
            return;
        }


        // UPDATE THE MODEL
        Model.editSupply(
            id,
            name,
            quantity,
            requiredQuantity
        );

    }


    // DELETE SUPPLY
    else if (action === "delete") {

        const confirmed = confirm(
            "Are you sure you want to delete this supply?"
        );

        if (!confirmed) return;

        Model.deleteSupply(id);

    }


    // REFRESH THE APPLICATION
    renderViews();

}


// ===================================
// START THE APPLICATION
// ===================================

// Display saved information when the page opens
renderViews();

// Attach the inventory action listener once
inventoryView.addHandlerActions(handleInventoryAction);
