import Form, { FormContextType } from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_MENU_MODAL_ID } from "./ManageMenu";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import MenuItemForm from "./ManageMenuItems";
import RoleForm from "../Role/RoleForm";
import { CreateMenu, CreateMenuItem, Menu, MenuItem, UpdateMenu, UpdateMenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";

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
export type EditMenuProps = {
    data?: Menu | null;
    operation: 'edit' | 'update' | 'add' | 'create';
};
function EditMenu({
    data,
    operation
}: EditMenuProps) {
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

    const initialValues = {
        'id': data?.id,
        'name': data?.name || '',
        'has_parent': data?.has_parent || false,
        'ul_class': data?.ul_class || '',
        'active': data?.active || false,
        'roles': data?.roles || [],
        'menu_items': data?.menu_items || [],
    };
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
    function buildMenuIdData(menus: Array<Menu>): Array<number> {
        const filterMenuData: Array<Menu> = menus
            .filter((menu: Menu) => {
                if (typeof menu === 'object') {
                    return menu.id;
                }
                return false;
            });
        return filterMenuData.map((menu: Menu) => {
            return menu.id;
        });
    }
    function buildRoleIdData(roles: Array<Role>): Array<number> {
        const filterRoleData: Array<Role> = roles
            .filter((role: Role | number) => {
                if (typeof role === 'object') {
                    return role.id;
                }
                return false;
            });
        return filterRoleData.map((role: Role) => {
            return role.id;
        });
    }
    function buildMenuItemRequestData(menuItems: Array<MenuItem>) {
        let newMenuItems: Array<CreateMenuItem | UpdateMenuItem> = [];
        menuItems.forEach((menuItem: MenuItem, index: number) => {
            newMenuItems[index] = {
                active: menuItem?.active,
                label: menuItem?.label,
                type: menuItem?.type,
                url: menuItem?.url,
                target: menuItem?.target,
                order: menuItem?.order,
                icon: menuItem?.icon,
                li_class: menuItem?.li_class,
                a_class: menuItem?.a_class
            };
            if (menuItem.hasOwnProperty('id') && menuItem.id) {
                newMenuItems[index].id = menuItem.id;
            }
            if (Array.isArray(menuItem?.roles)) {
                if (!Array.isArray(newMenuItems?.[index]?.roles)) {
                    newMenuItems[index].roles = [];
                }
                newMenuItems[index].roles = buildRoleIdData(menuItem.roles);
            }
            if (Array.isArray(menuItem?.menus)) {
                if (!Array.isArray(newMenuItems?.[index]?.menus)) {
                    newMenuItems[index].menus = [];
                }
                newMenuItems[index].menus = buildMenuIdData(menuItem.menus);
            }
        });
        return newMenuItems
    }

    function buildCreateData(values: Menu) {
        let requestData: CreateMenu = {
            name: values?.name,
        };
        if (values.hasOwnProperty('ul_class')) {
            requestData.ul_class = values.ul_class;
        }
        if (values.hasOwnProperty('active')) {
            requestData.active = values.active;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        if (Array.isArray(values?.menu_items)) {
            requestData.menu_items = buildMenuItemRequestData(values.menu_items);
        }
        return requestData;
    }

    function buildUpdateData(values: Menu) {
        let requestData: UpdateMenu = {
            id: values?.id,
        };
        if (values.hasOwnProperty('ul_class')) {
            requestData.ul_class = values.ul_class;
        }
        if (values.hasOwnProperty('active')) {
            requestData.active = values.active;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        if (Array.isArray(values?.menu_items)) {
            requestData.menu_items = buildMenuItemRequestData(values.menu_items);
        }
        return requestData;
    }
    function getRequiredFields() {
        let requiredFields: any = {};
        if (operation === 'edit' || operation === 'update') {
            requiredFields = {
                id: true,
                menu_items: {
                    id: true,
                },
                roles: {
                    id: true,
                },
            };
        }
        return requiredFields;
    }
    const dataTableContext = useContext(DataTableContext);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <Form
                    operation={operation}
                    requiredFields={getRequiredFields()}
                    initialValues={initialValues}
                    onSubmit={async (values: Menu) => {
                        console.log('edit menu values', values);
                        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
                            console.warn('No data to update');
                            return;
                        }
                        let response = null;
                        let requestData: CreateMenu | UpdateMenu;
                        switch (operation) {
                            case 'edit':
                            case 'update':
                                requestData = buildUpdateData(values);
                                console.log('edit requestData', requestData);
                                // return;
                                if (!requestData?.id) {
                                    throw new Error('Menu ID is required');
                                }
                                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: `${truJobApiConfig.endpoints.menu}/${requestData.id}/update`,
                                    method: ApiMiddleware.METHOD.PATCH,
                                    protectedReq: true,
                                    data: requestData,
                                })
                                break;
                            case 'add':
                            case 'create':
                                requestData = buildCreateData(values);
                                console.log('create requestData', requestData);
                                // return;
                                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: `${truJobApiConfig.endpoints.menu}/create`,
                                    method: ApiMiddleware.METHOD.POST,
                                    protectedReq: true,
                                    data: requestData,
                                })
                                break;
                            default:
                                console.warn('Invalid operation');
                                break;
                        }
                        if (!response) {
                            return;
                        }
                        dataTableContext.refresh();
                        dataTableContext.modal.close(EDIT_MENU_MODAL_ID);

                    }}
                >
                    {({
                        values,
                        errors,
                        setFieldValue,
                        onChange,
                    }: FormContextType) => {
                        return (
                            <>
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <div className="custom-control custom-checkbox mb-3 text-left">
                                            <input
                                                onChange={e => {
                                                    onChange(e);
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
                                                onChange={onChange}
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
                                                onChange={onChange}
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
                                                setModalFooter(false, setRolesModal);
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
                                                setModalFooter(false, setMenuItemsModal);
                                                showModal(setMenuItemsModal);
                                            }}
                                        >
                                            Manage Menu Items
                                        </button>
                                    </div>

                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary mr-2"
                                        >
                                            Save
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
                                            <Button variant="primary" onClick={() => hideModal(setMenuItemsModal)}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    }
                                </Modal>
                            </>
                        )
                    }}
                </Form>
            </div>
        </div>
    );
}
export default EditMenu;