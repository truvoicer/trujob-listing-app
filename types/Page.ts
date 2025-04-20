import { PageBlock } from "./PageBlock";
import { Role } from "./Role";
import { Sidebar } from "./Sidebar";

export type Page = {
    [key: string]: string | boolean | number | null | PageSettings | Array<PageBlock> | Array<Role> | Array<Sidebar>;
    id: number;
    view: string;
    permalink: string;
    name: string;
    title: null | string;
    content: null | string;
    blocks: Array<PageBlock>;
    has_sidebar: boolean;
    sidebars: Array<Sidebar>;
    is_active: boolean;
    is_home: boolean;
    is_featured: boolean;
    is_protected: boolean;
    settings: PageSettings;
    deleted_at: null | string;
    created_at: string;
    updated_at: string;
    roles: Array<Role>;
    has_permission: boolean;
}

export type PageSettings = {
    [key: string]: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    meta_robots: string;
    meta_canonical: string;
    meta_author: string;
    meta_publisher: string;
    meta_og_title: string;
    meta_og_description: string;
    meta_og_type: string;
    meta_og_url: string;
    meta_og_image: string;
    meta_og_site_name: string;
}