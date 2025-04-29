import { Role } from "./Role";
import { CreateWidget, Widget } from "./Widget";

export type Sidebar = {
    [key: string]: string | number | null | Array<Role> | Array<Widget> | boolean;
    id: number;
    name: string;
    title: string;
    icon: string;
    properties: any;
    roles: Array<Role>;
    has_permission: boolean;
    widgets: Array<Widget>;
}

export type CreateSidebar = {
    [key: string]: string | number | null | Array<number> | boolean | undefined | Array<CreateWidget>;
    name: string;
    title: string;
    icon?: string;
    properties?: any;
    roles?: Array<number>;
    widgets?: Array<CreateWidget>;
}

export type UpdateSidebar = {
    [key: string]: string | number | null | Array<number> | boolean | undefined;
    id?: number;
    name?: string;
    title?: string;
    icon?: string;
    properties?: any;
    roles?: Array<number>;
    widgets?: Array<number>;
}

