
import View from "./View.js";

// ===================================
// AEGIS ASSESSMENT VIEW
// ===================================

export default class AssessmentView extends View {

    // CREATE THE ASSESSMENT FORM
    generateMarkup() {

        return `
            <div class="assessment-container">

                <div class="section-heading">
                    <p class="top-label">HOUSEHOLD INFORMATION</p>
                    <h2>Emergency Assessment</h2>
                    <p>Provide basic information about your household.</p>
                </div>

                <form id="assessment-form" class="assessment-form">

                    <div class="form-group">
                        <label for="householdName">
                            Household Name
                        </label>

                        <input
                            type="text"
                            id="householdName"
                            name="householdName"
                            placeholder="Enter household name"
                            value="${this.data.householdName || ""}"
                        >
                    </div>

                    <div class="form-group">
                        <label for="members">
                            Number of Household Members
                        </label>

<input
    type="number"
    id="members"
    value="${this.data.members || 1}"
>
                    </div>

                    <div class="form-group">
                        <label for="evacuationMinutes">
                            Estimated Evacuation Time (Minutes)
                        </label>

                        <input
                            type="number"
                            id="evacuationMinutes"
                            name="evacuationMinutes"
                            min="1"
                            max="180"
                            placeholder="Example: 15"
                            value="${this.data.evacuationMinutes || ""}"
                        >
                    </div>

                    <p
                        id="assessment-error"
                        class="form-error"
                        aria-live="polite"
                    ></p>

                    <button type="submit" class="primary-button">
                        Save Assessment
                    </button>

                </form>

            </div>
        `;
    }


    // LISTEN FOR FORM SUBMISSION
    addHandlerSubmit(handler) {

        const form = this.parentElement.querySelector(
            "#assessment-form"
        );

        form.addEventListener("submit", function(event) {

            event.preventDefault();

            const formData = new FormData(form);

            const assessmentData = {
                householdName: formData.get("householdName").trim(),

                members: Number(formData.get("members")),

                evacuationMinutes: Number(
                    formData.get("evacuationMinutes")
                )
            };

            // Send the submitted information to the Controller
            handler(assessmentData);

        });
    }


    // DISPLAY VALIDATION ERROR
    renderError(message) {

        const errorElement = this.parentElement.querySelector(
            "#assessment-error"
        );

        errorElement.textContent = message;
    }


    // CLEAR VALIDATION ERROR
    clearError() {

        const errorElement = this.parentElement.querySelector(
            "#assessment-error"
        );

        errorElement.textContent = "";
    }

}
