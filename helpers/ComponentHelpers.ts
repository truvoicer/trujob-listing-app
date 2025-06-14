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

    static buildClassName(classNames: string | string[] | Record<string, boolean> | undefined) {
        if (!classNames) {
            return "";
        }
        if (Array.isArray(classNames)) {
            return classNames.join(" ");
        }
        if (typeof classNames === "string") {
            return classNames;
        }
        if (typeof classNames === "object") {
            return Object.entries(classNames)
                .filter(([_, value]) => value)
                .map(([key, _]) => key)
                .join(" ");
        }
        return "";
    }
}
