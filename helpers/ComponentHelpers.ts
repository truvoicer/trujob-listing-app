import { isFunction } from "underscore";
export class ComponentHelpers {
    static buildComponent(component: any, props: any = {}) {
        if (!ComponentHelpers.isComponentFunction(component)) {
            return null;
        }
        const componentDefaultProps = component.defaultProps || {};
        component.defaultProps = {
            ...componentDefaultProps,
            ...props,
        };
        return component;
    }

    static isComponentFunction(component: any) {
        return (component || isFunction(component) || isFunction(component?.type));
    }
}
