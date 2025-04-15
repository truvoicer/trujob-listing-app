export class StyleBuilder {
    style = {};
    addBackgroundImage(backgroundImage) {
        if (!backgroundImage) {
            return {};
        }
        return {...this.style, backgroundImage: `url(${backgroundImage})`};
    }
    addBackGround(props) {
        if (!props) {
            return {
                backgroundColor: '#cccccc',
            };
        }
        const {background_image, background_color} = props;
        if (background_image) {
            this.style.backgroundImage = `url(${backgroundImage})`;
        }
        if (background_color) {
            this.style.backgroundColor = background_color;
        }
        return this.style;
    }
    static getInstance() {
        return new this();
    }
}