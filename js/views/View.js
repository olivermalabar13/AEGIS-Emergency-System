export default class View {

    constructor(parentElement) {
        this.parentElement = parentElement;
    }


    render(data) {
        this.data = data;

        const markup = this.generateMarkup();

        this.parentElement.innerHTML = markup;
    }


    generateMarkup() {
        return "";
    }

}
