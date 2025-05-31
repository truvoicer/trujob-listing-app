
import gridConfig from "./config/gridConfig";

export class ProductsViewService {

    static getInstance() {
        return new ProductsViewService();
    }

    renderGridItem(
        type: 'event' | 'vehicle' | 'service' | 'real-estate' | 'job' | 'pet' |
            'item' | 'property' | 'business' | 'ticket' | 'course' | 'food',
        props = {}
    ) {
        const config = gridConfig;
        const findConfig = config.find((item) => item?.type === type);
        if (!findConfig) {
            console.log('No config found for type: ' + type);
            return null;
        }
        if (!findConfig?.component) {
            console.log('No component found for type: ' + type);
            return null;
        }
        const Component = findConfig.component;
        return <Component data={ props } />;

    }

}