import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Menu } from "@/types/Menu";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectMenuProps = {
    name?: string;
    pageId?: string | null;
    menuId?: number | null;
    menuName?: string | null;
    onChange?: (menu: any) => void;
    onSubmit?: (menu: any) => void;
}
function SelectMenu({
    name = 'menu',
    menuId,
    menuName,
    onChange,
}: SelectMenuProps) {
    const [menus, setMenus] = useState<Array<Menu>>([]);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchMenus() {
        // Fetch menus from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menu}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching menus');
            return;
        }
        setMenus(response?.data || []);
    }

    useEffect(() => {
        fetchMenus();
    }, []);


    useEffect(() => {
        if (!menuId) {
            return;
        }
        if (!Array.isArray(menus) || menus.length === 0) {
            return;
        }
        const findSelectedMenu = menus.find(menu => menu?.id === menuId);
        if (findSelectedMenu) {
            setSelectedMenu(findSelectedMenu);
            return;
        }
        const findMenu = menus.find(menu => menu?.name === menuName);
        if (findMenu) {
            setSelectedMenu(findMenu);
            return;
        }
        console.warn('No menu found with the given ID or name');
    }, [menuId, menus]);

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(selectedMenu);
        }
    }, [selectedMenu]);

    useEffect(() => {
        if (!selectedMenu) {
            return;
        }
        if (!formContext) {
            console.warn('Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            console.warn('setFieldValue function not found in form context');
            return;
        }
        formContext.setFieldValue(name, selectedMenu);

    }, [selectedMenu]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    const findSelectedMenu = menus.find(menu => menu?.id === parseInt(e.target.value));
                    if (!findSelectedMenu) {
                        console.warn('No menu found with the given ID');
                        return;
                    }
                    setSelectedMenu(findSelectedMenu);
                }}
                value={selectedMenu?.id || ''}
            >
                <option value="">Select Menu</option>
                {menus.map((menu, index) => (
                    <option
                        key={index}
                        value={menu.id}>
                        {menu.name}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>
                Menu
            </label>
        </div>
    );
}
export default SelectMenu;