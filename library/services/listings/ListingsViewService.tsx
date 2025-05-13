import { DebugHelpers } from "@/helpers/DebugHelpers";
import gridConfig from "./config/gridConfig";

export class ListingsViewService {

    static getInstance() {
        return new ListingsViewService();
    }

    renderGridItem(
        type: 'event' | 'vehicle' | 'service' | 'real-estate' | 'job' | 'pet' |
            'item' | 'property' | 'business' | 'ticket' | 'course' | 'food',
        props = {}
    ) {
        const config = gridConfig;
        const findConfig = config.find((item) => item?.type === type);
        if (!findConfig) {
            DebugHelpers.log(DebugHelpers.WARN, 'No config found for type: ' + type);
            return null;
        }
        if (!findConfig?.component) {
            DebugHelpers.log(DebugHelpers.WARN, 'No component found for type: ' + type);
            return null;
        }
        const Component = findConfig.component;
        return <Component data={ props } />;

    }

}