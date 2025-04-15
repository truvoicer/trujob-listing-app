import { Page } from "./Page";
import { Role } from "./Role";

export type Menu = {
    [key: string]: string | number | boolean | null | Array<Role> | Array<MenuItem>;
    id: number;
    name: string;
    has_parent: boolean;
    ul_class: string;
    active: boolean;
    roles: Array<Role>;
    menu_items: Array<MenuItem>;
}
export type MenuItem = {
    [key: string]: string | number | boolean | null | Array<Role> | Array<Menu> | Page;
    id: number;
    active: boolean;
    label: string;
    type: string;
    url: string|null;
    target: string|null;
    order: number;
    icon: string|null;
    li_class: string|null;
    a_class: string|null;
    page: Page|null;
    roles: Array<Role>;
    menus: Array<Menu>;
}