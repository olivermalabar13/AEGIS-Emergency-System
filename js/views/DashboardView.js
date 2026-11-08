import View from "./View.js";

export default class DashboardView extends View {

    formatNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}
    // GENERATE THE DASHBOARD DISPLAY
    generateMarkup() {

        const score = this.formatNumber(this.data.score);
        const readiness = this.data.readiness;
        const assessment = this.data.assessment;
        const supplies = this.data.supplies;

    // Count supplies that are below their required quantity
        const shortageCount = supplies.filter(supply => {
        const quantity = this.formatNumber(supply.quantity);
        const required = this.formatNumber(supply.requiredQuantity);

        return quantity < required;
    }).length;

        // Determine the readiness color
        let statusClass = "low";

        if (score >= 80) {
            statusClass = "high";
        }
        else if (score >= 60) {
            statusClass = "moderate";
        }

        return `
            <div class="dashboard-container">

                <div class="section-heading">
                    <p class="top-label">OVERVIEW</p>
                    <h2>Preparedness Dashboard</h2>
                    <p>Monitor your household emergency readiness.</p>
                </div>


                <div class="dashboard-grid">

                    <!-- PREPAREDNESS SCORE -->
                    <div class="dashboard-card score-card">

                        <p class="card-label">
                            OVERALL PREPAREDNESS
                        </p>

                        <h2 class="score-number">
                            ${score}%
                        </h2>

                        <div class="progress-bar">
                            <div
                                class="progress-fill ${statusClass}"
                                style="width: ${score}%"
                            ></div>
                        </div>

                        <p class="readiness-status ${statusClass}">
                            ${readiness}
                        </p>

                    </div>


                    <!-- HOUSEHOLD INFORMATION -->
                    <div class="dashboard-card">

                        <p class="card-label">
                            HOUSEHOLD
                        </p>

                        <h2>
                            ${this.escapeHTML(assessment.householdName || "Not set")}
                        </h2>

                        <p class="card-description">
                            ${this.formatNumber(assessment.members)} household member(s)
                        </p>

                    </div>


                    <!-- TOTAL SUPPLIES -->
                    <div class="dashboard-card">

                        <p class="card-label">
                            TOTAL SUPPLIES
                        </p>

                        <h2 class="stat-number">
                            ${supplies.length}
                        </h2>

                        <p class="card-description">
                            Registered emergency supplies
                        </p>

                    </div>


                    <!-- SUPPLY SHORTAGES -->
                    <div class="dashboard-card">

                        <p class="card-label">
                            SUPPLY SHORTAGES
                        </p>

                        <h2 class="stat-number">
                            ${shortageCount}
                        </h2>

                        <p class="card-description">
                            Supplies below required quantity
                        </p>

                    </div>

                </div>


                <!-- EVACUATION INFORMATION -->
                <div class="dashboard-card evacuation-card">

                    <p class="card-label">
                        EVACUATION ESTIMATE
                    </p>

                    <h2>
                        ${assessment.evacuationMinutes || 0} Minutes
                    </h2>

                    <p class="card-description">
                        Estimated household evacuation time
                    </p>

                </div>


                <p class="dashboard-note">
                    Preparedness score is an educational estimate,
                    not an official emergency safety assessment.
                </p>

            </div>
        `;
    }


    // PREVENT USER DATA FROM BEING TREATED AS HTML
    escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, character => {

            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return characters[character];

        });

    }

}
