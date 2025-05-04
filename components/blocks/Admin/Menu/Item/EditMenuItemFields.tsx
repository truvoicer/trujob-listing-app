import { useContext, useState } from "react";
import { FormikProps, FormikValues, useFormikContext } from "formik";
import { Button, Modal } from "react-bootstrap";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import RoleForm from "../../Role/RoleForm";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Role } from "@/types/Role";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { Sidebar } from "@/types/Sidebar";
import SidebarForm, { SidebarFormMakeRequest, SidebarFormOnAdd, SidebarFormOnDelete, SidebarFormOnMove, SidebarFormOnOk, sidebarSchema } from "../../Sidebar/SidebarForm";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { ReorderOnAdd, ReorderOnDelete, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectSidebar from "../../Sidebar/SelectSidebar";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { Menu } from "@/types/Menu";
import MenuForm from "./Menu/MenuItemMenuForm";
import SelectMenuItemType from "./SelectMenuItemType";
import SelectPage from "../../Page/SelectPage";
import SelectLinkTarget from "../SelectLinkTarget";

type EditMenuItemFieldsProps = {
    menuId?: number;
    index?: number;
    pageId?: number;
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditMenuItemFields({
    menuId,
    index = 0,
    pageId,
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

    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [selectedMenus, setSelectedMenus] = useState<Array<Menu>>([]);

    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};


    function validatePageId(): boolean {
        if (!pageId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Page id not found
                    </p>
                ),
            }, 'page-block-form-validate-page-id-error');
            console.warn('Page id not found', pageId);
            return false;
        }
        return true;
    }
    function handleAddSidebar({
        reorderData,
        onChange,
        sidebars,
        setSidebars,
        sidebarsRequest,
    }: SidebarFormOnAdd) {
        dataTableContext.modal.show({
            component: (
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <SelectSidebar name={'sidebar'} />
                    </div>
                </div>
            ),
            showFooter: true,
            formProps: {
                operation: 'add',
                initialValues: { sidebar: null },
            },
            onOk: async ({ formHelpers }: {
                formHelpers: FormikProps<FormikValues>;
            }) => {
                const selectedSidebar = formHelpers?.values?.sidebar;
                if (!selectedSidebar) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Sidebar not found
                            </p>
                        ),
                    }, 'sidebar-form-select-sidebar-error');
                    console.warn('Sidebar not found', {
                        values: formHelpers?.values,
                    });
                    return false;
                }
                if (!selectedSidebar?.id) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Sidebar id not found
                            </p>
                        ),
                    }, 'sidebar-form-select-sidebar-id-error');
                    console.warn('Sidebar id not found', selectedSidebar);
                    return false;
                }

                if (['add', 'create'].includes(operation || '')) {
                    setSidebars(
                        [...sidebars, {
                            ...sidebarSchema,
                            ...formHelpers?.values?.sidebar
                        }]
                    );
                    return true;
                }

                if (!validatePageId() || !pageId) {
                    return false;
                }
                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${values.id}/sidebar/${selectedSidebar.id}/create`,
                    method: TruJobApiMiddleware.METHOD.POST,
                    protectedReq: true,
                });
                if (!response) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Page block add failed
                            </p>
                        ),
                    }, 'sidebar-sidebar-add-error');
                    console.warn('sidebar add failed', response);
                    return false;
                }
                notificationContext.show({
                    variant: 'success',
                    title: 'Success',
                    component: (
                        <p>
                            Sidebar added successfully
                        </p>
                    ),
                }, 'sidebar-sidebar-add-success');
                
                if (typeof sidebarsRequest === 'function') {
                    sidebarsRequest();
                }
                dataTableContext.modal.close('sidebar-form-select-sidebar');
                return false;
            }
        }, 'sidebar-form-select-sidebar');
    }

    async function handleMoveSidebar({
        direction,
        reorderData,
        onChange,
        itemSchema,
        newIndex,
        index,
        item,
        sidebars,
        setSidebars,
        sidebarsRequest
    }: SidebarFormOnMove) {
        if (!['up', 'down'].includes(direction)) {
            return false;
        }

        if (['add', 'create'].includes(operation || '')) {
            return true;
        }
        if (!validatePageId() || !pageId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${values.id}/sidebar/${item.id}/reorder`,
            method: TruJobApiMiddleware.METHOD.POST,
            protectedReq: true,
            data: {
                direction
            }
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Page block moved successfully
                    </p>
                ),
            }, 'sidebar-item-move-success');
            if (typeof sidebarsRequest === 'function') {
                sidebarsRequest();
            }
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Page block move failed
                </p>
            ),
        }, 'sidebar-item-move-error');
        return false;

    }

    async function handleDeleteSidebar({
        item,
        sidebars,
        setSidebars,
        sidebarsRequest,
    }: SidebarFormOnDelete) {

        if (['add', 'create'].includes(operation || '')) {
            setSidebars(
                sidebars.filter((sidebar: Sidebar) => {
                    return sidebar.id !== item.id;
                })
            );
            return true;
        }
        if (!validatePageId() || !pageId) {
            return;
        }

        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Page block id not found
                    </p>
                ),
            }, 'sidebar-item-delete-error');
            console.warn('Page block id not found', item);
            return false;
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${values.id}/sidebar/${item.id}/delete`,
            method: TruJobApiMiddleware.METHOD.DELETE,
            protectedReq: true,
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Page block deleted successfully
                    </p>
                ),
            }, 'sidebar-item-delete-success');
            if (typeof sidebarsRequest === 'function') {
                sidebarsRequest();
            }
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Page block delete failed
                </p>
            ),
        }, 'sidebar-item-delete-error');

        return false;
    }

    async function handleOk({
        formHelpers,
        sidebars,
        setSidebars,
        sidebarsRequest
    }: SidebarFormOnOk) {
        if (!formHelpers) {
            return;
        }
        
        const item = { ...formHelpers.values };
        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        sidebar id not found
                    </p>
                ),
            }, 'sidebar-sidebar-update-error');
            console.warn('sidebar id not found', item);
            return false;
        }
        if (['add', 'create'].includes(operation || '')) {
            if (item.hasOwnProperty('index')) {
                setSidebars(prevState => {
                    let newState = [...prevState];
                    if (newState?.[item.index]) {
                        newState[item.index] = item;
                    }
                    return newState;
                });
            } else {
                setSidebars([...sidebars, item]);
            }
            return true;
        }

        if (Array.isArray(item?.roles)) {
            item.roles = RequestHelpers.extractIdsFromArray(item.roles);
        }
        if (!validatePageId() || !pageId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${values.id}/sidebar/${item.id}/update`,
            method: TruJobApiMiddleware.METHOD.PATCH,
            protectedReq: true,
            data: item
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        sidebar updated successfully
                    </p>
                ),
            }, 'sidebar-sidebar-update-success');
            if (typeof sidebarsRequest === 'function') {
                sidebarsRequest();
            }
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    sidebar update failed
                </p>
            ),
        }, 'sidebar-sidebar-update-error');
        return false;
    }

    async function makeRequest({
        sidebars,
        setSidebars
    }: SidebarFormMakeRequest) {
        
        if (!validatePageId() || !pageId) {
            return [];
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${values.id}/sidebar`,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return [];
        }
        return response?.data || [];
    }

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
                        <SelectMenuItemType
                            name={'menuItemType' + index}
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

                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="label"
                                id={"label" + index}
                                onChange={handleChange}
                                value={values?.label || ""} />
                            <label className="form-label" htmlFor={'label' + index}>Nav Title</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="url"
                                id={"url" + index}
                                onChange={handleChange}
                                value={values?.url || ""} />
                            <label className="form-label" htmlFor={'url' + index}>URL</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <SelectLinkTarget
                            name={'linktarget' + index}
                            value={values?.target}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="icon"
                                id={"icon" + index}
                                onChange={handleChange}
                                value={values?.icon || ""} />
                            <label className="form-label" htmlFor={'icon' + index}>Icon</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="li_class"
                                id={"li_class" + index}
                                onChange={handleChange}
                                value={values?.li_class || ""} />
                            <label className="form-label" htmlFor={'li_class' + index}>Li Class</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="a_class"
                                id={"a_class" + index}
                                onChange={handleChange}
                                value={values?.a_class || ""} />
                            <label className="form-label" htmlFor={'a_class' + index}>A Class</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">

                        <div className="floating-input form-group">
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.setModalTitle('Manage Roles', setRolesModal);
                                    ModalService.setModalFooter(true, setRolesModal);
                                    ModalService.showModal(setRolesModal);
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
                                    ModalService.setModalTitle('Manage Menus', setMenuModal);
                                    ModalService.setModalFooter(true, setMenuModal);
                                    ModalService.showModal(setMenuModal);
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
                            data={values?.roles || []}
                            onChange={(roles) => {
                                setSelectedRoles(roles);
                            }}
                            makeRequest={async () => {
                                if (!menuId) {
                                    console.warn('No menu item id found');
                                    return false;
                                }
                                const response = await TruJobApiMiddleware.getInstance()
                                    .resourceRequest({
                                        endpoint: truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString()) + '/' + values.id + '/role',
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
                            }}
                            onAdd={async (role: Role) => {
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
                                    console.warn('No response from API when adding role');
                                    return false;
                                }
                                return true;
                            }}
                            onDelete={async (role: Role) => {
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
                            data={values?.menus || []}
                            onChange={(menus) => {
                                setSelectedMenus(menus);
                            }}
                        />
                    </Modal.Body>
                    {menuModal.footer &&
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => ModalService.hideModal(setMenuModal)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => {
                                    setFieldValue('roles', selectedMenus);
                                    ModalService.hideModal(setMenuModal)
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
export default EditMenuItemFields;