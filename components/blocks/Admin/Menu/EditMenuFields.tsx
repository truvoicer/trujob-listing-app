import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import MenuItemForm from "./ManageMenuItems";
import RoleForm from "../Role/RoleForm";
import { CreateMenu, CreateMenuItem, Menu, MenuItem, UpdateMenu, UpdateMenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";
import { FormikValues, useFormikContext } from "formik";

export type RolesModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export type MenuItemsModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export type EditMenuFields = {
};
function EditMenuFields() {
    const [rolesModal, setRolesModal] = useState<RolesModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [menuItemsModal, setMenuItemsModal] = useState<MenuItemsModal>({
        show: false,
        title: '',
        footer: true,
    });

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
    function showModal(setter: Dispatch<SetStateAction<RolesModal | MenuItemsModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }
    function setModalTitle(title: string, setter: Dispatch<SetStateAction<RolesModal | MenuItemsModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }
    function setModalFooter(hasFooter: boolean = false, setter: Dispatch<SetStateAction<RolesModal | MenuItemsModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }
    const {
        values,
        errors,
        setFieldValue,
        handleChange,
    } = useFormikContext<FormikValues>() || {};
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <>
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="active"
                                    name="active"
                                    checked={values?.active || false} />
                                <label className="custom-control-label" htmlFor="active">
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={handleChange}
                                    value={values?.name || ""} />
                                <label className="form-label" htmlFor="name">Name</label>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="ul_class"
                                    id="ul_class"
                                    onChange={handleChange}
                                    value={values?.ul_class || ""} />
                                <label className="form-label" htmlFor="ul_class">
                                    UL Class
                                </label>
                            </div>
                        </div>


                        <div className="col-12 my-3">
                            <h4>Manage</h4>
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    setModalTitle('Manage Roles', setRolesModal);
                                    setModalFooter(true, setRolesModal);
                                    showModal(setRolesModal);
                                }}
                            >
                                Manage Roles
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    setModalTitle('Manage Menu Items', setMenuItemsModal);
                                    setModalFooter(true, setMenuItemsModal);
                                    showModal(setMenuItemsModal);
                                }}
                            >
                                Manage Menu Items
                            </button>
                        </div>
                    </div>

                    <Modal show={rolesModal.show} onHide={() => hideModal(setRolesModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{rolesModal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <RoleForm
                                data={values?.roles || []}
                                onChange={(roles: Array<Role>) => {
                                    setFieldValue('roles', roles);
                                }}
                                makeRequest={async () => {
                                    if (['edit', 'update'].includes(operation)) {
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: truJobApiConfig.endpoints.menu + '/' + values.id + '/role',
                                                method: ApiMiddleware.METHOD.GET,
                                                protectedReq: true,
                                            })
                                        if (!response) {
                                            console.warn('No response from API when getting roles');
                                            return false;
                                        }
                                        if (!response?.data) {
                                            console.warn('No data found');
                                            return false;
                                        }
                                        if (!Array.isArray(response?.data)) {
                                            console.warn('Response is not an array');
                                            return false;
                                        }
                                        setFieldValue('roles', response.data);
                                        return true;
                                    } else if (['add', 'create'].includes(operation)) {
                                        return true;
                                    }
                                    return false;
                                }}
                                onAdd={async (role: Role) => {
                                    if (!values?.id) {
                                        console.warn('Menu ID is required');
                                        return false;
                                    }
                                    if (!role) {
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.menu}/${values.id}/role/${role.id}/create`,
                                            method: ApiMiddleware.METHOD.POST,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    return true;
                                }}
                                onDelete={async (role: Role) => {
                                    if (!values?.id) {
                                        console.warn('Menu ID is required');
                                        return false;
                                    }
                                    if (!role) {
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.menu}/${values.id}/role/${role.id}/delete`,
                                            method: ApiMiddleware.METHOD.DELETE,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    return true;
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
                    <Modal show={menuItemsModal.show} onHide={() => hideModal(setMenuItemsModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{menuItemsModal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <MenuItemForm
                                menuId={values?.id}
                                data={values?.menu_items || []}
                                onChange={(menuItems: Array<MenuItem>) => {
                                    setFieldValue('menu_items', menuItems);
                                }}
                            />
                        </Modal.Body>
                        {menuItemsModal.footer &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => hideModal(setMenuItemsModal)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => { hideModal(setMenuItemsModal) }}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        }
                    </Modal>
                </>

            </div>
        </div>
    );
}
export default EditMenuFields;