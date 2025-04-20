import { Role } from "./Role";
import { Widget } from "./Widget";

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