import Reorder from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import RoleForm from "../Role/RoleForm";
import MenuItemForm from "./ManageMenuItems";
import SelectMenu from "./SelectMenu";
import { CreateMenu, CreateMenuItem, Menu, MenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";

export type MenuFormProps = {
    data?: Array<Menu>;
    onChange?: (data: Array<Menu>) => void;
}
function MenuForm({ 
    data = [],
    onChange 
}: MenuFormProps) {

    const dataTableContext = useContext(DataTableContext);

    const menuSchema: Menu = {
        id: 0,
        active: false,
        name: '',
        ul_class: '',
        roles: [],
        menu_items: [],
        has_parent: false,
    };
    function updateFieldValue(
        index: number, 
        field: string, 
        value: string | number | boolean | Array<MenuItem> | Array<Role>
    ) {
        const newData = [...data];
        newData[index][field] = value;
        if (typeof onChange !== 'function') {
            return;
        }
        onChange(newData);
    }
    function handleChange(
        values: Array<Menu>
    ) {
        if (typeof onChange !== 'function') {
            return;
        }
        onChange(values);
    }
    console.log('MenuForm', data);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    enableEdit={false}
                    itemSchema={menuSchema}
                    itemHeader={(item, index) => `${item?.name}` || 'Item type error'}
                    data={data || []}
                    onChange={handleChange}
                    onAdd={({
                        reorderData,
                        onChange,
                        itemSchema
                    }) => {
                        dataTableContext.modal.show({
                            component: (
                                <div className="row">
                                    <div className="col-12 col-lg-12">
                                        <SelectMenu
                                            onSubmit={selectedMenu => {
                                                const newData = [...reorderData];
                                                newData.push({ ...menuSchema, ...selectedMenu });
                                                onChange(newData);
                                                dataTableContext.modal.close('menu-edit-form');
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'menu-edit-form');
                    }}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <>

                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="active"
                                    id={"active" + index}
                                    checked={item?.active || false}
                                    onChange={e => {
                                        updateFieldValue(index, 'active', e.target.checked);
                                    }}
                                />
                                <label className="custom-control-label" htmlFor={'active' + index}>
                                    Active?
                                </label>
                            </div>

                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    id={"name" + index}
                                    onChange={e => {
                                        updateFieldValue(index, 'name', e.target.value);
                                    }}
                                    value={item?.name || ""} />
                                <label className="form-label" htmlFor={'name' + index}>
                                    Name
                                </label>
                            </div>
                            
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="ul_class"
                                    id={"ul_class" + index}
                                    onChange={e => {
                                        updateFieldValue(index, 'ul_class', e.target.value);
                                    }}
                                    value={item?.ul_class || ""} />
                                <label className="form-label" htmlFor={'ul_class' + index}>UL Class</label>
                            </div>

                            <div className="floating-input form-group">
                                <button
                                    type="button"
                                    className="btn btn-primary mr-2"
                                    onClick={(e) => {
                                        dataTableContext.modal.show({
                                            component: (
                                                <RoleForm
                                                    data={item?.roles || []}
                                                    onChange={(roles) => {
                                                        console.log('roles', roles);
                                                        updateFieldValue(index, 'roles', roles);
                                                    }}
                                                />
                                            ),
                                            showFooter: false
                                        }, 'menu-edit-roles-form');
                                    }}
                                >
                                    Roles
                                </button>
                            </div>
                            <div className="floating-input form-group">
                                <button
                                    type="button"
                                    className="btn btn-primary mr-2"
                                    onClick={(e) => {
                                        dataTableContext.modal.show({
                                            component: (
                                                <MenuItemForm
                                                    data={item?.menu_items || []}
                                                    onChange={(menuItems) => {
                                                        console.log('menuItems', menuItems);
                                                        updateFieldValue(index, 'menuItems', menuItems);
                                                    }}
                                                />
                                            ),
                                            showFooter: false
                                        }, 'menu-edit-menuItem-form');
                                    }}
                                >
                                    Menus
                                </button>
                            </div>

                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default MenuForm;