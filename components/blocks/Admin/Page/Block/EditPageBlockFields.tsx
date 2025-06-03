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
import SidebarForm, { SidebarFormMakeRequest, SidebarFormOnAdd, SidebarFormOnDelete, SidebarFormOnMove, SidebarFormOnOk, sidebarSchema } from "../../Sidebar/SidebarForm";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectSidebar from "../../Sidebar/SelectSidebar";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";


type EditPageBlockFieldsProps = {
    index?: number;
    pageId?: number;
    operation: 'edit' | 'update' | 'add' | 'create';
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
            console.log('Page id not found', pageId);
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

                if (!validatePageId() || !pageId) {
                    return false;
                }
                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString()),
                        values.id,
                        'sidebar',
                        selectedSidebar.id,
                        'store'
                    ]),
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
        if (!validatePageId() || !pageId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString()),
                values.id,
                'sidebar',
                'rel',
                item.id,
                'reorder'
            ]),
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
            console.log('Page block id not found', item);
            return false;
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString()),
                values.id,
                'sidebar',
                'rel',
                item.id,
                'delete'
            ]),
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
        console.log('sidebarsRequest', sidebars);
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
                        <Checkbox
                            name={'default'}
                            placeholder="Default?"
                            label="Default?"
                            onChange={handleChange}
                            value={values?.default || false}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.nav_title || ""}
                            onChange={handleChange}
                            placeholder="Enter nav title"
                            name="nav_title"
                            type="text"
                            label="Nav Title"
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
                            value={values?.subtitle || ""}
                            onChange={handleChange}
                            placeholder="Enter subtitle"
                            name="subtitle"
                            type="text"
                            label="Subtitle"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.background_image || ""}
                            onChange={handleChange}
                            placeholder="Enter background image URL"
                            name="background_image"
                            type="text"
                            label="Background Image"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.background_color || ""}
                            onChange={handleChange}
                            placeholder="Enter background color"
                            name="background_color"
                            type="text"
                            label="Background Color"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'pagination'}
                            placeholder="Pagination?"
                            label="Pagination?"
                            onChange={handleChange}
                            value={values?.pagination || false}
                        />
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
                        <TextInput
                            value={values?.content || ""}
                            onChange={handleChange}
                            placeholder="Enter content"
                            name="content"
                            label="Content"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'has_sidebar'}
                            placeholder="Has Sidebar?"
                            label="Has Sidebar?"
                            onChange={handleChange}
                            value={values?.has_sidebar || false}
                        />
                    </div>

                    <div className="col-12 col-lg-6">
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
                                    title: 'Manage Sidebars',
                                }, setSidebarModal);
                            }}
                        >
                            Manage Sidebars
                        </button>
                    </div>
                </div>

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
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: UrlHelpers.urlFromArray([
                                                truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId?.toString() || ''),
                                                values.id,
                                                'role'
                                            ]),
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
                                return false;
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
                                            endpoint: UrlHelpers.urlFromArray([
                                                truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId?.toString() || ''),
                                                values.id,
                                                'role',
                                                role.id,
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
                                            endpoint: UrlHelpers.urlFromArray([
                                                truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId?.toString() || ''),
                                                values.id,
                                                'role',
                                                role.id,
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
                    {sidebarModal.footer &&
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