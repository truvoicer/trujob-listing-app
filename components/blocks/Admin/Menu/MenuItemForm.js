import { FormContext } from "@/components/form/contexts/FormContext";
import Reorder from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectPage from "../Page/SelectPage";
import RoleForm from "../Role/RoleForm";
import SelectMenuItemType from "./SelectMenuItemType";
import MenuForm from "./MenuForm";

function MenuItemForm({ data = null, onChange = null }) {
    const menuItems = data || [];

    const dataTableContext = useContext(DataTableContext);

    const menuItemSchema = {
        active: data?.active || false,
        label: data?.label || '',
        type: data?.type || '',
        url: data?.url || '',
        target: data?.target || '',
        order: data?.order || '',
        icon: data?.icon || '',
        li_class: data?.li_class || '',
        a_class: data?.a_class || '',
        page: data?.page || null,
        roles: data?.roles || [],
        menus: data?.menus || [],
    };
    function updateFieldValue(index, field, value) {
        const newData = [...menuItems];
        newData[index][field] = value;
        onChange(newData);
    }
    function handleChange(values) {
        onChange(values);
    }
    console.log('MenuItemForm', menuItems);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={menuItemSchema}
                    itemHeader={(item, index) => `${item?.label} | url: ${item?.url} | type: ${item?.type}` || 'Item type error'}
                    data={menuItems || []}
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

                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'page-edit-menuItem-select');
                    }}
                >
                    {({
                        block,
                        index,
                    }) => (
                        <>

                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="active"
                                    id={"active" + index}
                                    checked={block?.active || false}
                                    onChange={e => {
                                        updateFieldValue(index, 'active', e.target.checked);
                                    }}
                                />
                                <label className="custom-control-label" htmlFor={'active' + index}>
                                    Active?
                                </label>
                            </div>

                            <SelectMenuItemType
                                id={'menuItemType' + index}
                                value={block?.type}
                                onChange={selectedMenuItemType => {
                                    updateFieldValue(index, 'type', selectedMenuItemType);
                                }}
                                showSubmitButton={false}
                            />

                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="label"
                                    id={"label" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'label', e.target.value);
                                    }}
                                    value={block?.label || ""} />
                                <label className="form-label" htmlFor={'label' + index}>Nav Title</label>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="url"
                                    id={"url" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'url', e.target.value);
                                    }}
                                    value={block?.url || ""} />
                                <label className="form-label" htmlFor={'url' + index}>URL</label>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="target"
                                    id={"target" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'target', e.target.value);
                                    }}
                                    value={block?.target || ""} />
                                <label className="form-label" htmlFor={'target' + index}>Target</label>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="order"
                                    id={"order" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'order', e.target.value);
                                    }}
                                    value={block?.order || ""} />
                                <label className="form-label" htmlFor={'order' + index}>Order</label>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="icon"
                                    id={"icon" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'icon', e.target.value);
                                    }}
                                    value={block?.icon || ""} />
                                <label className="form-label" htmlFor={'icon' + index}>Icon</label>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="li_class"
                                    id={"li_class" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'li_class', e.target.value);
                                    }}
                                    value={block?.li_class || ""} />
                                <label className="form-label" htmlFor={'li_class' + index}>Li Class</label>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="a_class"
                                    id={"a_class" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'a_class', e.target.value);
                                    }}
                                    value={block?.a_class || ""} />
                                <label className="form-label" htmlFor={'a_class' + index}>A Class</label>
                            </div>

                            <SelectPage
                                id={'page' + index}
                                value={block?.page?.id || null}
                                onChange={selectedPage => {
                                    updateFieldValue(index, 'page', selectedPage);
                                }}
                                showSubmitButton={false}
                            />
                            <div className="floating-input form-group">
                                <button
                                    type="button"
                                    className="btn btn-primary mr-2"
                                    onClick={(e) => {
                                        dataTableContext.modal.show({
                                            component: (
                                                <RoleForm
                                                    data={block?.roles || []}
                                                    onChange={(roles) => {
                                                        console.log('roles', roles);
                                                        updateFieldValue(index, 'roles', roles);
                                                    }}
                                                />
                                            ),
                                            showFooter: false
                                        }, 'menu-edit-menuItem-form');
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
                                                <MenuForm
                                                    data={block?.menus || []}
                                                    onChange={(menus) => {
                                                        console.log('menus', menus);
                                                        updateFieldValue(index, 'menus', menus);
                                                    }}
                                                />
                                            ),
                                            showFooter: false
                                        }, 'menu-edit-menu-form');
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
export default MenuItemForm;