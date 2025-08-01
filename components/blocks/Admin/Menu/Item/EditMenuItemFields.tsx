import { useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { Button, Modal } from "react-bootstrap";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import RoleForm from "../../Role/RoleForm";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Role } from "@/types/Role";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { ReorderOnMove } from "@/components/Reorder/Reorder";
import { Menu, MenuItemMenu } from "@/types/Menu";
import MenuForm from "./Menu/MenuItemMenuForm";
import SelectMenuItemType from "./SelectMenuItemType";
import SelectPage from "../../Page/SelectPage";
import SelectLinkTarget from "../SelectLinkTarget";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";


type EditMenuItemFieldsProps = {
    menuId?: number;
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditMenuItemFields({
    menuId,
    operation,
}: EditMenuItemFieldsProps) {

    const [rolesModal, setRolesModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [menuModal, setMenuModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });

    const formikContext = useFormikContext<FormikValues>() || {};
    const { values, setFieldValue, handleChange } = formikContext;

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'active'}
                            placeholder="Active?"
                            label="Active?"
                            onChange={handleChange}
                            value={values?.active || false}
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectMenuItemType
                            name={'type'}
                            value={values?.type}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        {values?.type === 'page' && (
                            <SelectPage
                                name={'page'}
                                value={values?.page?.id || null}
                            />
                        )}
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.label || ""}
                            onChange={handleChange}
                            placeholder="Enter label"
                            name="label"
                            type="text"
                            label="Label"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.url || ""}
                            onChange={handleChange}
                            placeholder="Enter URL"
                            name="url"
                            type="text"
                            label="URL"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <SelectLinkTarget
                            name={'target'}
                            value={values?.target}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.icon || ""}
                            onChange={handleChange}
                            placeholder="Enter icon"
                            name="icon"
                            type="text"
                            label="Icon"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.li_class || ""}
                            onChange={handleChange}
                            placeholder="Enter Li Class"
                            name="li_class"
                            type="text"
                            label="Li Class"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.a_class || ""}
                            onChange={handleChange}
                            placeholder="Enter A Class"
                            name="a_class"
                            type="text"
                            label="A Class"
                        />
                    </div>
                    <div className="col-12 col-lg-6">

                        <div className="floating-input form-group">
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
                                    ModalService.updateLocalItemState({
                                        show: true,
                                        title: 'Manage Menus',
                                        footer: true,
                                    }, setMenuModal);
                                }}
                            >
                                Menus
                            </button>
                        </div>
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
                                if (['add', 'create'].includes(operation || '')) {
                                    return values?.roles || [];
                                }
                                if (!menuId) {
                                    console.log('No menu item id found');
                                    return false;
                                }
                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString()) + '/' + values.id + '/role',
                                        method: ApiMiddleware.METHOD.GET,
                                        protectedReq: true,
                                    })
                                if (!response) {
                                    console.log('No response from API when getting roles');
                                    return false;
                                }
                                if (!response?.data) {
                                    console.log('No data found');
                                    return false;
                                }
                                if (!Array.isArray(response?.data)) {
                                    console.log('Response is not an array');
                                    return false;
                                }
                                return response.data;
                            }}
                            onAdd={async (role: Role) => {
                                let roles = values?.roles || [];
                                if (['add', 'create'].includes(operation || '')) {
                                    setFieldValue('roles', [...roles, role]);
                                    return true;
                                }
                                if (!menuId) {
                                    return false;
                                }
                                if (!role) {
                                    return false;
                                }
                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${values.id}/role/${role.id}/create`,
                                        method: ApiMiddleware.METHOD.POST,
                                        protectedReq: true,
                                    })
                                if (!response) {
                                    console.log('No response from API when adding role');
                                    return false;
                                }
                                return true;
                            }}
                            onDelete={async (role: Role) => {
                                if (['add', 'create'].includes(operation || '')) {
                                    return true;
                                }
                                if (!menuId) {
                                    return false;
                                }
                                if (!role) {
                                    return false;
                                }
                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${values.id}/role/${role.id}/delete`,
                                        method: ApiMiddleware.METHOD.DELETE,
                                        protectedReq: true,
                                    })
                                if (!response) {
                                    console.log('No response from API when adding role');
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
                            <Button variant="primary" onClick={() => {
                                // console.log('selected roles', selectedRoles);
                                // setFieldValue('roles', selectedRoles);
                                ModalService.hideModal(setRolesModal)
                            }}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>
                <Modal show={menuModal.show} onHide={() => ModalService.hideModal(setMenuModal)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{menuModal?.title || ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MenuForm
                            operation={operation}
                            data={values?.menus || []}
                            onChange={(menus: Array<Menu | MenuItemMenu>) => {
                                if (['add', 'create'].includes(operation || '')) {
                                    setFieldValue('menus', menus);
                                }
                            }}
                            makeRequest={async () => {
                                if (['add', 'create'].includes(operation || '')) {
                                    return values?.menus || [];
                                }
                                if (!menuId) {
                                    console.log('No menu item id found');
                                    return null;
                                }
                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: UrlHelpers.urlFromArray([
                                            truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString()),
                                            values.id,
                                            'menu'
                                        ]),
                                        method: ApiMiddleware.METHOD.GET,
                                        protectedReq: true,
                                    })
                                if (!response) {
                                    console.log('No response from API when getting roles');
                                    return null;
                                }
                                if (!response?.data) {
                                    console.log('No data found');
                                    return null;
                                }
                                if (!Array.isArray(response?.data)) {
                                    console.log('Response is not an array');
                                    return null;
                                }
                                return response.data;
                            }}
                            onMove={async ({
                                direction,
                                item,
                            }: ReorderOnMove) => {
                                if (['add', 'create'].includes(operation || '')) {
                                    return true;
                                }
                                if (!menuId) {
                                    return false;
                                }
                                if (!item) {
                                    return false;
                                }
                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: UrlHelpers.urlFromArray([
                                            truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString()),
                                            values.id,
                                            'menu',
                                            'rel',
                                            item.id,
                                            'reorder'
                                        ]),
                                        method: ApiMiddleware.METHOD.POST,
                                        protectedReq: true,
                                        data: {
                                            direction
                                        }
                                    })
                                if (!response) {
                                    console.log('No response from API when adding role');
                                    return false;
                                }
                                return true;
                            }}
                            onAdd={async (menu: Menu) => {
                                if (['add', 'create'].includes(operation || '')) {
                                    let menus = values?.menus || [];
                                    setFieldValue('menus', [...menus, menu]);
                                    return true;
                                }
                                if (!menuId) {
                                    return false;
                                }
                                if (!menu) {
                                    return false;
                                }
                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: UrlHelpers.urlFromArray([
                                            truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString()),
                                            values.id,
                                            'menu',
                                            menu.id,
                                            'store'
                                        ]),
                                        method: ApiMiddleware.METHOD.POST,
                                        protectedReq: true,
                                    })
                                if (!response) {
                                    console.log('No response from API when adding role');
                                    return false;
                                }
                                return true;
                            }}
                            onDelete={async (menuItemMenu: MenuItemMenu) => {
                                if (['add', 'create'].includes(operation || '')) {
                                    return true;
                                }
                                if (!menuId) {
                                    return false;
                                }
                                if (!menuItemMenu) {
                                    return false;
                                }

                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: UrlHelpers.urlFromArray([
                                            truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString()),
                                            values.id,
                                            'menu',
                                            'rel',
                                            menuItemMenu.id,
                                            'delete'
                                        ]),
                                        method: ApiMiddleware.METHOD.DELETE,
                                        protectedReq: true,
                                    })
                                if (!response) {
                                    console.log('No response from API when adding role');
                                    return false;
                                }
                                return true;
                            }}
                        />
                    </Modal.Body>
                    {menuModal.footer &&
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => ModalService.hideModal(setMenuModal)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>
            </div>
        </div>
    );
}
export default EditMenuItemFields;