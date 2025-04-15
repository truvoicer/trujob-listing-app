import { Role } from "./Role";

export type Widget = {
    [key: string]: string | number | boolean | Array<Role>;
    id: number;
    name: string;
    title: string;
    icon: string;
    has_container: boolean;
    order: number;
    properties: any;
    roles: Array<Role>;
}