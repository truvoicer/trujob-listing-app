import { SetStateAction, useContext, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import { CreateMenuItem, Menu, MenuItem, UpdateMenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";
import { Page } from "@/types/Page";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type EditMenuItemMenuProps = {
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    menuId?: number;
    index?: number;
    data?: MenuItem;
}
function EditMenuItemMenu({
    data,
    index,
    menuId,
    operation,
    inModal = false,
    modalId,
}: EditMenuItemMenuProps) {

    const [menuItem, setMenuItem] = useState<MenuItem>(data || {});
    const dataTableContext = useContext(DataTableContext);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (typeof onSubmit === 'function') {
            onSubmit(menuItem);
        }
    }

    function handleChange(key: string, value: string | number | boolean | Array<Role> | Array<Menu> | Page | null) {
        setMenuItem((prevState: MenuItem) => {
            let newState = { ...prevState };
            newState[key] = value;
            return newState;
        });
        if (typeof onChange === 'function') {
            onChange(key, value);
        }
    }
    

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                DebugHelpers.log(DebugHelpers.DEBUG, 'Selected Menu:', menuItem);
                handleSubmit(e);
            }}>
            
        </form>
    );
}
export default EditMenuItemMenu;