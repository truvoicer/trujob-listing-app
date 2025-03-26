import gridConfig from "./config/gridConfig";

export class ListingsViewService {

    static getInstance() {
        return new ListingsViewService();
    }

    renderGridItem(type, props = {}) {
        const config = gridConfig;
        const findConfig = config.find((item) => item?.type?.slug === type);
        if (!findConfig) {
            console.warn('No config found for type: ' + type);
            return null;
        }
        if (!findConfig?.component) {
            console.warn('No component found for type: ' + type);
            return null;
        }
        const Component = findConfig.component;
        return <Component data={props} />;
        
    }

}