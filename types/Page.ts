import { Block } from "./Block";
import { Role } from "./Role";
import { Sidebar } from "./Sidebar";

export type Page = {
    [key: string]: string | boolean | number | null | Array<Block> | Array<Role> | Array<Sidebar>;
    id: number;
    view: string;
    permalink: string;
    name: string;
    title: null | string;
    content: null | string;
    blocks: Array<Block>;
    has_sidebar: boolean;
    sidebars: Array<Sidebar>;
    is_active: boolean;
    is_home: boolean;
    is_featured: boolean;
    is_protected: boolean;
    deleted_at: null | string;
    created_at: string;
    updated_at: string;
    roles: Array<Role>;
}