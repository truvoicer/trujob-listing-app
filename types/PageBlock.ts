import { Role } from "./Role";

export type PageBlock = {
    [key: string]: string | number | boolean | null | Array<Role>;
    type: string;
    default: boolean;
    nav_title: string;
    title: string;
    subtitle: string | null;
    background_image: string | null;
    background_color: string | null;
    pagination_type: string | null;
    pagination: boolean;
    pagination_scroll_type: string;
    content: string | null;
    properties: string;
    order: number;
    has_sidebar: boolean;
    sidebars: Array<any>;
    roles: Array<Role>;
    has_permission: boolean;
}