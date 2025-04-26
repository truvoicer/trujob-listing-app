import { Role } from "./Role";

export type Widget = {
    [key: string]: string | number | boolean | Array<Role>;
    id: number;
    name: string;
    title: string;
    icon: string;
    description: string;
    properties: any;
    roles: Array<Role>;
    has_permission: boolean;
}

export interface SidebarWidget extends Widget{
    [key: string]: string | number | boolean | Array<Role>;
    has_container: boolean;
    order: number;
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