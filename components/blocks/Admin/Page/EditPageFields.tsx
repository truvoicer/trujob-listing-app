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
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import Textarea from "@/components/Elements/Textarea";


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
                    console.log('Sidebar not found', {
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
                    console.log('Sidebar id not found', selectedSidebar);
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
                    console.log('sidebar add failed', response);
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
            console.log('Page block id not found', item);
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
            console.log('sidebar id not found', item);
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
                            <Checkbox
                                name={'is_active'}
                                placeholder="Is active?"
                                label="Is active?"
                                onChange={handleChange}
                                value={values?.is_active || false}
                            />
                        </div>

                        <div className="col-12 col-lg-6">
                            <Checkbox
                                name={'is_featured'}
                                placeholder="Is featured?"
                                label="Is featured?"
                                onChange={handleChange}
                                value={values?.is_featured || false}
                            />
                        </div>

                        <div className="col-12 col-lg-6">
                            <Checkbox
                                name={'is_home'}
                                placeholder="Is Home?"
                                label="Is Home?"
                                onChange={handleChange}
                                value={values?.is_home || false}
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.title || ""}
                                onChange={handleChange}
                                placeholder="Enter title"
                                name="title"
                                type="text"
                                label="Title"
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.name || ""}
                                onChange={handleChange}
                                placeholder="Enter name"
                                name="name"
                                type="text"
                                label="Name"
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.permalink || ""}
                                onChange={handleChange}
                                placeholder="Enter permalink"
                                name="permalink"
                                type="text"
                                label="Permalink"
                            />
                        </div>


                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.content || ""}
                                onChange={handleChange}
                                placeholder="Enter content"
                                name="content"
                                label="Content"
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
                                        footer: true,
                                        title: 'Manage Roles',
                                    }, setRoleModal);
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
                                        footer: true,
                                        title: 'Manage Blocks',
                                    }, setBlocksModal);
                                }}
                            >
                                Manage Blocks
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    ModalService.updateLocalItemState({
                                        show: true,
                                        footer: true,
                                        title: 'Manage Sidebars',
                                    }, setSidebarsModal);
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
                                operation={operation}
                                data={values?.roles || []}
                                onChange={(roles) => {
                                    if (['add', 'create'].includes(operation || '')) {
                                        setFieldValue('roles', roles);
                                    }
                                }}
                                makeRequest={async () => {
                                    if (!operation) {
                                        console.log('No operation found');
                                        return [];
                                    }
                                    if (['edit', 'update'].includes(operation)) {
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: truJobApiConfig.endpoints.page + '/' + values.id + '/role',
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
                                    } else if (['create', 'add'].includes(operation)) {
                                        return values?.roles || [];
                                    }
                                    return [];
                                }}
                                onAdd={async (role: Role) => {
                                    if (!operation) {
                                        console.log('No operation found');
                                        return false;
                                    }
                                    if (['edit', 'update'].includes(operation)) {
                                        if (!values?.id) {
                                            console.log('Widget ID is required');
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
                                            console.log('No response from API when adding role');
                                            return false;
                                        }
                                        return true;
                                    } else if (['add', 'create'].includes(operation || '')) {
                                        let roles = values?.roles || [];
                                        setFieldValue('roles', [...roles, role]);
                                        return true;
                                    }
                                    console.log('Invalid operation');
                                    return false;
                                }}
                                onDelete={async (role: Role) => {
                                    if (!operation) {
                                        console.log('No operation found');
                                        return false;
                                    }
                                    if (!role) {
                                        return false;
                                    }
                                    if (['edit', 'update'].includes(operation)) {
                                        if (!values?.id) {
                                            console.log('Widget ID is required');
                                            return false;
                                        }
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.page}/${values.id}/role/${role.id}/delete`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true,
                                            })
                                        if (!response) {
                                            console.log('No response from API when adding role');
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
                                    console.log('Invalid operation');
                                    return false;
                                }}
                            />
                        </Modal.Body>
                        {roleModal.footer &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => ModalService.hideModal(setRoleModal)}>
                                    Close
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