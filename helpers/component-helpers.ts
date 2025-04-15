import {isFunction} from "underscore";

export function buildComponent(component, props = {}) {
    if (!isComponentFunction(component)) {
        return null;
    }
    return component;
}

export function isComponentFunction(component) {
    return (component || isFunction(component) || isFunction(component?.type));
}
