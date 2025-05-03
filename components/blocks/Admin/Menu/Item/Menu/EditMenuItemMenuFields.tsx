import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { Button, Modal } from "react-bootstrap";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import RoleForm from "../../../Role/RoleForm";
import MenuItemForm from "../ManageMenuItems";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Role } from "@/types/Role";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { MenuItem } from "@/types/Menu";

type EditMenuItemMenuFieldsProps = {
    menuId?: number;
    index?: number;
    pageId?: number;
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditMenuItemMenuFields({
    menuId,
    index = 0,
    pageId,
    operation,
}: EditMenuItemMenuFieldsProps) {

    const [roleModal, setRoleModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [menuItemModal, setMenuItemModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });

    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState<Array<MenuItem>>([]);

    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="active"
                                id={"active" + index}
                                checked={values?.active || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'active' + index}>
                                Active?
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">

                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                id={"name" + index}
                                onChange={handleChange}
                                value={values?.name || ""} />
                            <label className="form-label" htmlFor={'name' + index}>
                                Name
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">

                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="ul_class"
                                id={"ul_class" + index}
                                onChange={handleChange}
                                value={values?.ul_class || ""} />
                            <label className="form-label" htmlFor={'ul_class' + index}>UL Class</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">

                        <div className="floating-input form-group">
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.setModalTitle('Select Roles', setRoleModal);
                                    ModalService.setModalFooter(true, setRoleModal);
                                    ModalService.showModal(setRoleModal);
                                }}
                            >
                                Roles
                            </button>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.setModalTitle('Select Menu Items', setMenuItemModal);
                                    ModalService.setModalFooter(true, setMenuItemModal);
                                    ModalService.showModal(setMenuItemModal);
                                }}
                            >
                                Menus
                            </button>
                        </div>
                    </div>
                </div>


                <Modal show={roleModal.show} onHide={() => ModalService.hideModal(setRoleModal)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{roleModal?.title || ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RoleForm
                            data={values?.roles || []}
                            onChange={(roles: Array<Role>) => {
                                setSelectedRoles(roles);
                            }}
                            makeRequest={async () => {
                                if (!operation) {
                                    console.warn('No operation found');
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: truJobApiConfig.endpoints.widget + '/' + values.id + '/role',
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
                                    setFieldValue('roles', response?.data);
                                    return true;
                                } else if (['create', 'add'].includes(operation)) {
                                    return true;
                                }
                                return false;
                            }}
                            onAdd={async (role: Role) => {
                                if (!operation) {
                                    console.warn('No operation found');
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    if (!values?.id) {
                                        console.warn('Widget ID is required');
                                        return false;
                                    }
                                    if (!role) {
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.widget}/${values.id}/role/${role.id}/create`,
                                            method: ApiMiddleware.METHOD.POST,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    return true;
                                } else if (['add', 'create'].includes(operation)) {
                                    const buildRoles = [...values?.roles, role];
                                    setFieldValue('roles', buildRoles);
                                    return true;
                                }
                                console.warn('Invalid operation');
                                return false;
                            }}
                            onDelete={async (role: Role) => {
                                if (!operation) {
                                    console.warn('No operation found');
                                    return false;
                                }
                                if (!role) {
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    if (!values?.id) {
                                        console.warn('Widget ID is required');
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.widget}/${values.id}/role/${role.id}/delete`,
                                            method: ApiMiddleware.METHOD.DELETE,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    return true;
                                } else if (['add', 'create'].includes(operation)) {
                                    const buildRoles = values.roles.filter((r: Role) => {
                                        return r.id !== role.id;
                                    });
                                    setFieldValue('roles', buildRoles);
                                    return true;
                                }
                                console.warn('Invalid operation');
                                return false;
                            }}
                        />
                    </Modal.Body>
                    {roleModal.footer &&
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => ModalService.hideModal(setRoleModal)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => {
                                setFieldValue('roles', selectedRoles);
                                ModalService.hideModal(setRoleModal)
                            }}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>

                <Modal show={menuItemModal.show} onHide={() => ModalService.hideModal(setMenuItemModal)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{menuItemModal?.title || ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MenuItemForm
                            menuId={values?.id}
                            operation={operation}
                            data={values?.menu_items || []}
                            onChange={(menuItems: Array<MenuItem>) => {
                                console.log('menuItems', menuItems);
                                setSelectedMenuItems(menuItems);
                            }}
                        />
                    </Modal.Body>
                    {roleModal.footer &&
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => ModalService.hideModal(setMenuItemModal)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => {
                                setFieldValue('sidebars', selectedMenuItems);
                                ModalService.hideModal(setMenuItemModal)
                            }}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>
            </div>
        </div>
    );
}
export default EditMenuItemMenuFields;