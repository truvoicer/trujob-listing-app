import { Role } from "./Role";
import { Widget } from "./Widget";

export type Sidebar = {
    [key: string]: string | number | null | Array<Role> | Array<Widget>;
    id: number;
    name: string;
    title: string;
    icon: string;
    properties: any;
    roles: Array<Role>;
    widgets: Array<Widget>;
}