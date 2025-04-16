export class StyleBuilder {
    style: any = {};
    addBackgroundImage(backgroundImage: string) {
        if (!backgroundImage) {
            return {};
        }
        return {...this.style, backgroundImage: `url(${backgroundImage})`};
    }
    addBackGround(props: any) {
        if (!props) {
            return {
                backgroundColor: '#cccccc',
            };
        }
        const {background_image, background_color} = props;
        if (background_image) {
            this.style.backgroundImage = `url(${background_image})`;
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