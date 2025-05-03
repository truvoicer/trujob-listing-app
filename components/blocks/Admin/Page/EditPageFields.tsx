import { Dispatch, useContext, useState } from "react";
import PageBlockForm from "./PageBlockForm";
import { Button, Modal } from "react-bootstrap";
import SidebarForm, { SidebarFormMakeRequest, SidebarFormOnAdd, SidebarFormOnDelete, SidebarFormOnMove, SidebarFormOnOk, sidebarSchema } from "../Sidebar/SidebarForm";
import SelectPageViews from "./SelectPageViews";
import { Sidebar } from "@/types/Sidebar";
import { PageBlock } from "@/types/PageBlock";
import { FormikProps, FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectSidebar from "../Sidebar/SelectSidebar";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import RoleForm from "../Role/RoleForm";
import { Role } from "@/types/Role";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";

type EditPageFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditPageFields({
    operation
}: EditPageFields) {
    const [selectedSidebars, setSelectedSidebars] = useState<Array<Sidebar>>([]);
    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [blocksModal, setBlocksModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [sidebarsModal, setSidebarsModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });

    const [roleModal, setRoleModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

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

                if (!values?.id) {
                    return false;
                }
                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/sidebar/${selectedSidebar.id}/create`,
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
                console.log('sidebarsRequest', sidebarsRequest);
                if (typeof sidebarsRequest === 'function') {
                    console.log('sidebarsRequest', sidebarsRequest);
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
        if (!values?.id) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/sidebar/${item.id}/reorder`,
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
        if (!values?.id) {
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
            endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/sidebar/${item.id}/delete`,
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
        if (!values?.id) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/sidebar/${item.id}/update`,
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
        console.log('sidebarsRequest', sidebars);
        if (!values?.id) {
            return [];
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/sidebar`,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return [];
        }
        return response?.data || [];
    }

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <>
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <SelectPageViews
                                value={values?.view || ''}
                                onChange={(pageViews: string) => {
                                    setFieldValue('view', pageViews);
                                }}
                                showSubmitButton={false}
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    onChange={handleChange}
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="is_active"
                                    name="is_active"
                                    value={values?.is_active || false} />
                                <label className="custom-control-label" htmlFor="is_active">
                                    Is active
                                </label>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="is_featured"
                                    name="is_featured"
                                    onChange={handleChange}
                                    value={values?.is_featured || false} />
                                <label className="custom-control-label" htmlFor="is_featured">
                                    Is Featured
                                </label>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="is_home"
                                    name="is_home"
                                    onChange={handleChange}
                                    value={values?.is_home || false} />
                                <label className="custom-control-label" htmlFor="is_home">
                                    Is Home
                                </label>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    id="title"
                                    onChange={handleChange}
                                    value={values?.title || ""} />
                                <label className="form-label" htmlFor="title">Title</label>
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
                                    name="permalink"
                                    id="permalink"
                                    onChange={handleChange}
                                    value={values?.permalink || ""} />
                                <label className="form-label" htmlFor="permalink">Permalink</label>
                            </div>
                        </div>


                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <textarea
                                    className="form-control"
                                    name="content"
                                    id="content"
                                    onChange={handleChange}
                                    value={values?.content || ""}></textarea>
                                <label className="form-label" htmlFor="content">Content</label>
                            </div>
                        </div>


                        <div className="col-12 my-3">
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
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.setModalTitle('Manage Blocks', setBlocksModal);
                                    ModalService.setModalFooter(true, setBlocksModal);
                                    ModalService.showModal(setBlocksModal);
                                }}
                            >
                                Manage Blocks
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.setModalTitle('Manage Sidebars', setSidebarsModal);
                                    ModalService.setModalFooter(true, setSidebarsModal);
                                    ModalService.showModal(setSidebarsModal);
                                }}
                            >
                                Manage Sidebars
                            </button>
                        </div>
                    </div>

                    <Modal show={blocksModal.show} onHide={() => ModalService.hideModal(setBlocksModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{blocksModal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PageBlockForm
                                pageId={values?.id}
                                data={values?.blocks || []}
                                onChange={(blocks: Array<PageBlock>) => {
                                    console.log('blocks', blocks);
                                    setFieldValue('blocks', blocks);
                                }}
                                operation={operation}
                            />
                        </Modal.Body>
                        {blocksModal.footer &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => ModalService.hideModal(setBlocksModal)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => ModalService.hideModal(setBlocksModal)}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        }
                    </Modal>
                    <Modal show={sidebarsModal.show} onHide={() => ModalService.hideModal(setSidebarsModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{sidebarsModal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <SidebarForm
                                operation={operation}
                                data={values?.sidebars || []}
                                onChange={(sidebars: Array<Sidebar>) => {
                                    setSelectedSidebars(sidebars);
                                }}
                                onOk={handleOk}
                                onAdd={handleAddSidebar}
                                onMove={handleMoveSidebar}
                                onDelete={handleDeleteSidebar}
                                makeRequest={makeRequest}
                            />
                        </Modal.Body>
                        {sidebarsModal.footer &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => ModalService.hideModal(setSidebarsModal)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => {
                                    setFieldValue('sidebars', selectedSidebars);
                                    ModalService.hideModal(setSidebarsModal)
                                }}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        }
                    </Modal>


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
                                                endpoint: truJobApiConfig.endpoints.page + '/' + values.id + '/role',
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
                                                endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/role/${role.id}/create`,
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
                                                endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/role/${role.id}/delete`,
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
                </>
            </div>
        </div>
    );
}
export default EditPageFields;