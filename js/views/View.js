
// ===================================
// AEGIS BASE VIEW
// ===================================

export default class View {

    // Identify the HTML section where the View will display content
    constructor(parentElement) {
        this.parentElement = parentElement;
    }


    // Display the View using the data provided by the Controller
    render(data) {
        this.data = data;

        const markup = this.generateMarkup();

        this.parentElement.innerHTML = markup;
    }


    // This method will be replaced by each child View
    generateMarkup() {
        return "";
    }

}
