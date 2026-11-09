
import View from "./View.js";

export default class InventoryView extends View {

    calculateShortage(supply) {
    return Math.max(
        0,
        supply.requiredQuantity - supply.quantity
    );
}

    generateMarkup() {

        const supplies = this.data || [];

        let supplyMarkup = "";

        if (supplies.length === 0) {

    const emptyMessage = "No emergency supplies added yet.";

    supplyMarkup = `
        <p class="empty-message">
            ${emptyMessage}
        </p>
    `;

        } else {

            supplyMarkup = supplies.map(supply => {

               const shortage = this.calculateShortage(supply);

                return `
                    <div class="supply-item">

                        <div class="supply-info">
                            <h3>${this.escapeHTML(supply.name)}</h3>

                            <p>
                                Available: ${supply.quantity}
                                /
                                Required: ${supply.requiredQuantity}
                            </p>

                            ${
                                shortage > 0
                                    ? `<small class="shortage">
                                        Shortage: ${shortage}
                                       </small>`
                                    : `<small class="complete">
                                        Requirement met
                                       </small>`
                            }
                        </div>

                        <div class="supply-actions">

                            <button
                                type="button"
                                class="edit-button"
                                data-action="edit"
                                data-id="${supply.id}"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-button"
                                data-action="delete"
                                data-id="${supply.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;

            }).join("");

        }


        return `
            <div class="inventory-container">

                <div class="section-heading">
                    <p class="top-label">EMERGENCY RESOURCES</p>
                    <h2>Supply Inventory</h2>
                    <p>Manage your household emergency supplies.</p>
                </div>

                <form id="inventory-form" class="inventory-form">

                    <div class="form-group">
                        <label for="supplyName">Supply Name</label>

                        <input
                            type="text"
                            id="supplyName"
                            name="supplyName"
                            placeholder="Example: Drinking Water"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="quantity">Available Quantity</label>

                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="0"
                            placeholder="Example: 5"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="requiredQuantity">
                            Required Quantity
                        </label>

                        <input
                            type="number"
                            id="requiredQuantity"
                            name="requiredQuantity"
                            min="1"
                            placeholder="Example: 10"
                            required
                        >
                    </div>

                    <button type="submit" class="primary-button">
                        Add Supply
                    </button>

                </form>

                <div class="inventory-list">
                    <h3>Current Supplies</h3>

                    ${supplyMarkup}
                </div>

            </div>
        `;
    }


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


    addHandlerAdd(handler) {

        const form = this.parentElement.querySelector(
            "#inventory-form"
        );

        form.addEventListener("submit", function(event) {

            event.preventDefault();

            const formData = new FormData(form);

            const supplyData = {
                name: formData.get("supplyName").trim(),

                quantity: Number(formData.get("quantity")),

                requiredQuantity: Number(
                    formData.get("requiredQuantity")
                )
            };

            handler(supplyData);

            form.reset();

        });
    }


    addHandlerActions(handler) {

        this.parentElement.addEventListener(
            "click",
            function(event) {

                const button = event.target.closest("button[data-action]");

                if (!button) return;

                const action = button.dataset.action;

                const id = Number(button.dataset.id);

                handler(action, id);

            }
        );
    }

}
