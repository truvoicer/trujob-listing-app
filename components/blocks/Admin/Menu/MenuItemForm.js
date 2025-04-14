import { useContext, useState } from "react";
import SelectPage from "../Page/SelectPage";
import RoleForm from "../Role/RoleForm";
import MenuForm from "./MenuForm";
import SelectMenuItemType from "./SelectMenuItemType";
import { DataTableContext } from "@/contexts/DataTableContext";

function MenuItemForm({ 
    data,
    index,
    onChange,
    onSubmit,
 }) {
    const [menuItem, setMenuItem] = useState(data);
    const dataTableContext = useContext(DataTableContext);
    function handleSubmit(e) {
        e.preventDefault();
        if (typeof onSubmit === 'function') {
            onSubmit(menuItem);
        }
    }
    function handleChange(key, value) {
        setMenuItem(prevState => {
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
            console.log('Selected Menu:', menuItem);
            handleSubmit(e);
        }}>
            <div className="custom-control custom-checkbox mb-3 text-left">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    name="active"
                    id={"active" + index}
                    checked={menuItem?.active || false}
                    onChange={e => {
                        handleChange('active', e.target.checked);
                    }}
                />
                <label className="custom-control-label" htmlFor={'active' + index}>
                    Active?
                </label>
            </div>

            <SelectMenuItemType
                id={'menuItemType' + index}
                value={menuItem?.type}
                onChange={selectedMenuItemType => {
                    handleChange('type', selectedMenuItemType);
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
                        handleChange('label', e.target.value);
                    }}
                    value={menuItem?.label || ""} />
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
                        handleChange('url', e.target.value);
                    }}
                    value={menuItem?.url || ""} />
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
                        handleChange('target', e.target.value);
                    }}
                    value={menuItem?.target || ""} />
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
                        handleChange('order', e.target.value);
                    }}
                    value={menuItem?.order || ""} />
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
                        handleChange('icon', e.target.value);
                    }}
                    value={menuItem?.icon || ""} />
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
                        handleChange('li_class', e.target.value);
                    }}
                    value={menuItem?.li_class || ""} />
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
                        handleChange('a_class', e.target.value);
                    }}
                    value={menuItem?.a_class || ""} />
                <label className="form-label" htmlFor={'a_class' + index}>A Class</label>
            </div>

            <SelectPage
                id={'page' + index}
                value={menuItem?.page?.id || null}
                onChange={selectedPage => {
                    handleChange('page', selectedPage);
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
                                    data={menuItem?.roles || []}
                                    onChange={(roles) => {
                                        console.log('roles', roles);
                                        handleChange('roles', roles);
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
                                    data={menuItem?.menus || []}
                                    onChange={(menus) => {
                                        console.log('menus', menus);
                                        handleChange('menus', menus);
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
            <div className="floating-input form-group">
                <button
                    type="submit"
                    className="btn btn-primary mr-2"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
export default MenuItemForm;