import { SetStateAction, useContext, useState } from "react";
import SelectPage from "../Page/SelectPage";
import RoleForm from "../Role/RoleForm";
import MenuForm from "./MenuForm";
import SelectMenuItemType from "./SelectMenuItemType";
import { DataTableContext } from "@/contexts/DataTableContext";
import { CreateMenuItem, Menu, MenuItem, UpdateMenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";
import { Page } from "@/types/Page";
import { MenuModal, RolesModal } from "./EditMenu";
import { Button, Modal } from "react-bootstrap";
import { Dispatch } from "redux";
import SelectLinkTarget from "./SelectLinkTarget";

export type RolesModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export type MenuModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export type MenuItemFormProps = {
    data?: MenuItem;
    index?: number;
    onChange?: (key: string, value: string | number | boolean | Array<Role> | Array<Menu> | Page | null) => void;
    onSubmit?: (data: MenuItem) => void;
}
function MenuItemForm({
    data,
    index,
    onChange,
    onSubmit,
}: MenuItemFormProps) {

    const [rolesModal, setRolesModal] = useState<RolesModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [menuModal, setMenuModal] = useState<MenuModal>({
        show: false,
        title: '',
        footer: true,
    });
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
    function hideModal(setter: Dispatch<SetStateAction<{
        show: boolean;
        title: string;
        footer: boolean;
    }>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }
    function showModal(setter: Dispatch<SetStateAction<RolesModal | MenuModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }
    function setModalTitle(title: string, setter: Dispatch<SetStateAction<RolesModal | MenuModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }
    function setModalFooter(hasFooter: boolean = false, setter: Dispatch<SetStateAction<RolesModal | MenuModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
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
                    onChange={e => {
                        handleChange('url', e.target.value);
                    }}
                    value={menuItem?.url || ""} />
                <label className="form-label" htmlFor={'url' + index}>URL</label>
            </div>
            
            <SelectLinkTarget
                id={'linktarget' + index}
                value={menuItem?.target}
                onChange={selectedLinkTarget => {
                    handleChange('target', selectedLinkTarget);
                }}
                showSubmitButton={false}
            />

            <div className="floating-input form-group">
                <input
                    className="form-control"
                    type="text"
                    name="order"
                    id={"order" + index}
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
                        setModalTitle('Manage Roles', setRolesModal);
                        setModalFooter(false, setRolesModal);
                        showModal(setRolesModal);
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
                        setModalTitle('Manage Menus', setMenuModal);
                        setModalFooter(false, setMenuModal);
                        showModal(setMenuModal);
                    }}
                >
                    Menus
                </button>
            </div>
            <div className="floating-input form-group">
                <button
                    type="submit"
                    className="btn btn-primary mr-2"
                >
                    Submit
                </button>
            </div>
            <Modal show={rolesModal.show} onHide={() => hideModal(setRolesModal)}>
                <Modal.Header closeButton>
                    <Modal.Title>{rolesModal?.title || ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RoleForm
                        data={menuItem?.roles || []}
                        onChange={(roles) => {
                            console.log('roles', roles);
                            handleChange('roles', roles);
                        }}
                    />
                </Modal.Body>
                {rolesModal.footer &&
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => hideModal(setRolesModal)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => hideModal(setRolesModal)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
            <Modal show={menuModal.show} onHide={() => hideModal(setMenuModal)}>
                <Modal.Header closeButton>
                    <Modal.Title>{menuModal?.title || ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MenuForm
                        data={menuItem?.menus || []}
                        onChange={(menus) => {
                            console.log('menus', menus);
                            handleChange('menus', menus);
                        }}
                    />
                </Modal.Body>
                {menuModal.footer &&
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => hideModal(setMenuModal)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => hideModal(setMenuModal)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        </form>
    );
}
export default MenuItemForm;