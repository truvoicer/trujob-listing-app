import { Role } from "./Role";

export type Widget = {
    [key: string]: string | number | boolean | Array<Role>;
    id: number;
    name: string;
    title: string;
    icon: string;
    has_container: boolean;
    description: string;
    order: number;
    properties: any;
    roles: Array<Role>;
    has_permission: boolean;
}

export type CreateWidget = {
    [key: string]: string | number | boolean | Array<number> | undefined;
    name: string;
    title: string;
    description?: string;
    has_container?: boolean;
    icon?: string;
    order?: number;
    properties?: any;
    roles?: Array<number>;
}

export type UpdateWidget = {
    [key: string]: string | number | boolean | Array<number> | undefined;
    id?: number;
    name?: string;
    title?: string;
    description?: string;
    has_container?: boolean;
    icon?: string;
    order?: number;
    properties?: any;
    roles?: Array<number>;
}