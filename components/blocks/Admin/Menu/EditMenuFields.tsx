import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import MenuItemForm from "./Item/ManageMenuItems";
import RoleForm from "../Role/RoleForm";
import { Role } from "@/types/Role";
import { MenuItem } from "@/types/Menu";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";


export type EditMenuFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
};
function EditMenuFields({
    operation,
}: EditMenuFields) {
    const [rolesModal, setRolesModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [menuItemsModal, setMenuItemsModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });

    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState<Array<MenuItem>>([]);
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
                            <Checkbox
                                name={'active'}
                                placeholder="Active"
                                label="Active"
                                onChange={handleChange}
                                value={values?.active || false}
                            />
                        </div>

                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.name || ""}
                                onChange={handleChange}
                                placeholder="Enter name"
                                type="text"
                                name="name"
                                label="Name"
                            />
                        </div>

                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.ul_class || ""}
                                onChange={handleChange}
                                placeholder="Enter UL Class"
                                type="text"
                                name="ul_class"
                                label="UL Class"
                            />
                        </div>


                        <div className="col-12 my-3">
                            <h4>Manage</h4>
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.updateLocalItemState({
                                        show: true,
                                        title: 'Manage Roles',
                                        footer: true,
                                    }, setRolesModal);
                                }}
                            >
                                Manage Roles
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.updateLocalItemState({
                                        show: true,
                                        title: 'Manage Menu Items',
                                        footer: true,
                                    }, setMenuItemsModal);
                                }}
                            >
                                Manage Menu Items
                            </button>
                        </div>
                    </div>

                    <Modal show={rolesModal.show} onHide={() => ModalService.hideModal(setRolesModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{rolesModal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <RoleForm
                                operation={operation}
                                data={values?.roles || []}
                                onChange={(roles) => {
                                    if (['add', 'create'].includes(operation || '')) {
                                        setFieldValue('roles', roles);
                                    }
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
                                        return response.data;
                                    } else if (['add', 'create'].includes(operation)) {
                                        return values?.roles || [];
                                    }
                                    return [];
                                }}
                                onAdd={async (role: Role) => {

                                    let roles = values?.roles || [];
                                    if (['add', 'create'].includes(operation || '')) {
                                        setFieldValue('roles', [...roles, role]);
                                        return true;
                                    }
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
                                    if (['add', 'create'].includes(operation)) {
                                        return true;
                                    }
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
                                <Button variant="secondary" onClick={() => ModalService.hideModal(setRolesModal)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        }
                    </Modal>
                    <Modal show={menuItemsModal.show} onHide={() => ModalService.hideModal(setMenuItemsModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{menuItemsModal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <MenuItemForm
                                operation={operation}
                                menuId={values?.id}
                                data={values?.menu_items || []}
                                onChange={(menuItems: Array<MenuItem>) => {
                                    setSelectedMenuItems(menuItems);
                                }}
                            />
                        </Modal.Body>
                        {menuItemsModal.footer &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => ModalService.hideModal(setMenuItemsModal)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => {
                                    setFieldValue('menu_items', selectedMenuItems);
                                    ModalService.hideModal(setMenuItemsModal);
                                }}>
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