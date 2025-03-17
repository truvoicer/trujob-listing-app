export class StyleBuilder {
    style = {};
    addBackgroundImage(backgroundImage) {
        if (!backgroundImage) {
            return {};
        }
        return {...this.style, backgroundImage: `url(${backgroundImage})`};
    }
    static getInstance() {
        return new this();
    }
}