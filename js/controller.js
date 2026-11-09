
import * as Model from "./model.js";

import AssessmentView from "./views/AssessmentView.js";
import InventoryView from "./views/InventoryView.js";
import DashboardView from "./views/DashboardView.js";





const assessmentView = new AssessmentView(
    document.querySelector("#assessment")
);

const inventoryView = new InventoryView(
    document.querySelector("#inventory")
);

const dashboardView = new DashboardView(
    document.querySelector("#dashboard")
);



function renderViews() {

    assessmentView.render(Model.state.assessment);

    inventoryView.render(Model.state.supplies);

    const dashboardData = {
        score: Model.calculateScore(),

        readiness: Model.getReadinessLevel(),

        assessment: Model.state.assessment,

        supplies: Model.state.supplies
    };

    dashboardView.render(dashboardData);


    assessmentView.addHandlerSubmit(handleAssessmentSubmit);

    inventoryView.addHandlerAdd(handleAddSupply);

}

function handleAssessmentSubmit(data) {
    assessmentView.clearError();

    if (data.householdName === "") {
        assessmentView.renderError(
            "Please enter your household name."
        );
        return;
    }

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

    Model.updateAssessment(data);

    renderViews();

}



function handleAddSupply(data) {

    if (data.name === "") {
        alert("Please enter a supply name.");
        return;
    }

    if (
        !Number.isInteger(data.quantity) ||
        data.quantity < 0
    ) {
        alert("Available quantity must be a whole number of 0 or more.");
        return;
    }

    if (
        !Number.isInteger(data.requiredQuantity) ||
        data.requiredQuantity < 1
    ) {
        alert("Required quantity must be at least 1.");
        return;
    }

    Model.addSupply(
        data.name,
        data.quantity,
        data.requiredQuantity
    );

    renderViews();

}



function handleInventoryAction(action, id) {

    // FIND THE SELECTED SUPPLY
    const supply = Model.state.supplies.find(item => {
        return item.id === id;
    });

    if (!supply) return;


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


        Model.editSupply(
            id,
            name,
            quantity,
            requiredQuantity
        );

    }


    else if (action === "delete") {

        const confirmed = confirm(
            "Are you sure you want to delete this supply?"
        );

        if (!confirmed) return;

        Model.deleteSupply(id);

    }


    renderViews();

}



renderViews();

inventoryView.addHandlerActions(handleInventoryAction);
