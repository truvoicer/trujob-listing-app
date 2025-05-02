import { useContext, useState } from "react";
import SelectPaginationTypes from "../SelectPaginationType";
import SelectPaginationScrollTypes from "../SelectPaginationScrollType";
import { FormikProps, FormikValues, useFormikContext } from "formik";
import { Button, Modal } from "react-bootstrap";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import RoleForm from "../../Role/RoleForm";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Role } from "@/types/Role";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { Sidebar } from "@/types/Sidebar";
import SidebarForm, { SidebarFormMakeRequest, SidebarFormOnAdd, SidebarFormOnDelete, SidebarFormOnMove, SidebarFormOnOk } from "../../Sidebar/SidebarForm";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { ReorderOnAdd, ReorderOnDelete, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectSidebar from "../../Sidebar/SelectSidebar";
import { RequestHelpers } from "@/helpers/RequestHelpers";

type EditPageBlockFieldsProps = {
    index?: number;
    pageId?: number;
    operation?: 'edit' | 'update' | 'add' | 'create';
}
function EditPageBlockFields({
    index = 0,
    pageId,
    operation,
}: EditPageBlockFieldsProps) {

    const [roleModal, setRoleModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [sidebarModal, setSidebarModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });

    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [selectedSidebars, setSelectedSidebars] = useState<Array<Sidebar>>([]);

    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);


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
                    console.warn('Sidebar not found', selectedSidebar);
                    return;
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
                    return;
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
                    return;
                }
                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.sidebar.replace('%s', pageId.toString())}/${selectedSidebar.id}/create`,
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
                    return;
                }
                notificationContext.show({
                    variant: 'success',
                    title: 'Success',
                    component: (
                        <p>
                            sidebar added successfully
                        </p>
                    ),
                }, 'sidebar-sidebar-add-success');
                sidebarsRequest();
                dataTableContext.modal.close('sidebar-form-select-sidebar');
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
            endpoint: `${truJobApiConfig.endpoints.sidebarRel.replace('%s', pageId.toString())}/${item.id}/reorder`,
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
            endpoint: `${truJobApiConfig.endpoints.sidebarRel.replace('%s', pageId.toString())}/${item.id}/delete`,
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
    }: SidebarFormOnOk) {
        if (!formHelpers) {
            return;
        }
        console.log('formHelpers', formHelpers.values);
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
            endpoint: `${truJobApiConfig.endpoints.sidebarRel.replace('%s', pageId.toString())}/${item.id}/update`,
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
            sidebarsRequest();
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

    async function sidebarsRequest({
        sidebars,
        setSidebars
    }: SidebarFormMakeRequest) {
        if (!validatePageId() || !pageId) {
            return [];
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebar.replace('%s', pageId.toString())}`,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return [];
        }
        return response?.data || [];
    }

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};
    console.log("EditPageBlockFields", values);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="default"
                                id={"default" + index}
                                checked={values?.default || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'default' + index}>
                                Default?
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="nav_title"
                                id={"nav_title" + index}
                                onChange={handleChange}
                                value={values?.nav_title || ""} />
                            <label className="form-label" htmlFor={'nav_title' + index}>Nav Title</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="title"
                                id={"title" + index}
                                onChange={handleChange}
                                value={values?.title || ""} />
                            <label className="form-label" htmlFor={'title' + index}>Title</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="subtitle"
                                id={"subtitle" + index}
                                onChange={handleChange}
                                value={values?.subtitle || ""} />
                            <label className="form-label" htmlFor={'subtitle' + index}>Subtitle</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="background_image"
                                id={"background_image" + index}
                                onChange={handleChange}
                                value={values?.background_image || ""} />
                            <label className="form-label" htmlFor={'background_image' + index}>Background Image</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="background_color"
                                id={"background_color" + index}
                                onChange={handleChange}
                                value={values?.background_color || ""} />
                            <label className="form-label" htmlFor={'background_color' + index}>Background Color</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="pagination"
                                id={"pagination" + index}
                                checked={values?.pagination || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'pagination' + index}>
                                Pagination
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <SelectPaginationTypes
                            name="pagination_type"
                            value={values?.pagination_type}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <SelectPaginationScrollTypes
                            name="pagination_scroll_type"
                            value={values?.pagination_scroll_type}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <textarea
                                className="form-control"
                                name="content"
                                id={"content" + index}
                                onChange={handleChange}
                                value={values?.content || ""}></textarea>
                            <label className="form-label" htmlFor={'content' + index}>Content</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="has_sidebar"
                                id={"has_sidebar" + index}
                                checked={values?.has_sidebar || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'has_sidebar' + index}>
                                Has Sidebar
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <h4>Manage</h4>
                        <button
                            type="button"
                            className="btn btn-primary mr-2"
                            onClick={(e) => {
                                ModalService.setModalTitle('Manage Roles', setRoleModal);
                                ModalService.setModalFooter(true, setRoleModal);
                                ModalService.showModal(setRoleModal);
                            }}
                        >
                            Manage Roles
                        </button>
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
                                // setFieldValue('roles', selectedRoles);
                                ModalService.hideModal(setRoleModal)
                            }}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>

                <Modal show={sidebarModal.show} onHide={() => ModalService.hideModal(setSidebarModal)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{sidebarModal?.title || ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SidebarForm
                            data={values?.sidebars || []}
                            onChange={(sidebars: Array<Sidebar>) => {
                                setSelectedSidebars(sidebars);
                            }}
                            onAdd={handleAddSidebar}
                            onMove={handleMoveSidebar}
                            onDelete={handleDeleteSidebar}
                            makeRequest={sidebarsRequest}
                        />
                        {/* <RoleForm
                            data={values?.sidebars || []}
                            onChange={(sidebars: Array<Role>) => {
                                setSelectedRoles(sidebars);
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
                                    setFieldValue('sidebars', response?.data);
                                    return true;
                                } else if (['create', 'add'].includes(operation)) {
                                    return true;
                                }
                                return false;
                            }}
                            onAdd={async (sidebar: Sidebar) => {
                                if (!operation) {
                                    console.warn('No operation found');
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    if (!values?.id) {
                                        console.warn('Widget ID is required');
                                        return false;
                                    }
                                    if (!sidebar) {
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.widget}/${values.id}/role/${sidebar.id}/create`,
                                            method: ApiMiddleware.METHOD.POST,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding sidebar');
                                        return false;
                                    }
                                    return true;
                                } else if (['add', 'create'].includes(operation)) {
                                    const buildSidebars = [...values?.sidebars, sidebar];
                                    setFieldValue('sidebars', buildSidebars);
                                    return true;
                                }
                                console.warn('Invalid operation');
                                return false;
                            }}
                            onDelete={async (sidebar: Sidebar) => {
                                if (!operation) {
                                    console.warn('No operation found');
                                    return false;
                                }
                                if (!sidebar) {
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    if (!values?.id) {
                                        console.warn('Sidebar ID is required');
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.widget}/${values.id}/role/${sidebar.id}/delete`,
                                            method: ApiMiddleware.METHOD.DELETE,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    return true;
                                } else if (['add', 'create'].includes(operation)) {
                                    const buildSidebars = values.roles.filter((r: Sidebar) => {
                                        return r.id !== sidebar.id;
                                    });
                                    setFieldValue('sidebars', buildSidebars);
                                    return true;
                                }
                                console.warn('Invalid operation');
                                return false;
                            }}
                        /> */}
                    </Modal.Body>
                    {roleModal.footer &&
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => ModalService.hideModal(setSidebarModal)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => {
                                setFieldValue('sidebars', selectedSidebars);
                                ModalService.hideModal(setSidebarModal)
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
export default EditPageBlockFields;