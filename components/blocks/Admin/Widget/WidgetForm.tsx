import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnEdit, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import SelectWidget from "@/components/blocks/Admin/Widget/SelectWidget";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { Widget } from "@/types/Widget";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { DataTableContext } from "@/contexts/DataTableContext";
import EditWidget from "./EditWidget";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { FormikProps, FormikValues } from "formik";

export type WidgetFormProps = {
    sidebarId?: number;
    data?: Array<Widget> | null;
    onChange?: (data: Array<Widget>) => void;
}
function WidgetForm({
    sidebarId,
    data,
    onChange
}: WidgetFormProps) {
    const [widgets, setWidgets] = useState([]);

    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);
    const pageWidgetSchema = {
        'title': '',
        'name': '',
        'icon': '',
    };
    function validateSidebarId() {
        if (!sidebarId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Sidebar id not found
                    </p>
                ),
            }, 'widget-form-validate-sidebar-id-error');
            console.warn('Sidebar id not found', sidebarId);
            return false;
        }
        return true;
    }
    function handleChange(values: Array<Widget>) {
        setWidgets(values);
    }

    function handleAddWidget({
        reorderData,
        onChange,
    }: ReorderOnAdd) {
        dataTableContext.modal.show({
            component: (
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <SelectWidget
                            name="widget"
                        />
                    </div>
                </div>
            ),
            showFooter: true,
            formProps: {
                operation: 'add',
                initialValues: { widget: null },
            },
            onOk: async (formHelpers: FormikProps<FormikValues>) => {
                if (!validateSidebarId()) {
                    return;
                }
                const selectedWidget = formHelpers?.values?.widget;
                if (!selectedWidget) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Widget not found
                            </p>
                        ),
                    }, 'widget-form-select-widget-error');
                    console.warn('Widget not found', selectedWidget);
                    return;
                }
                if (!selectedWidget?.id) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Widget id not found
                            </p>
                        ),
                    }, 'widget-form-select-widget-id-error');
                    console.warn('Widget id not found', selectedWidget);
                    return;
                }
                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.sidebarWidget.replace('%s', sidebarId.toString())}/${selectedWidget.id}/create`,
                    method: TruJobApiMiddleware.METHOD.POST,
                    protectedReq: true,
                });
                if (!response) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Sidebar widget add failed
                            </p>
                        ),
                    }, 'sidebar-widget-add-error');
                    console.warn('Sidebar widget add failed', response);
                    return;
                }
                notificationContext.show({
                    variant: 'success',
                    title: 'Success',
                    component: (
                        <p>
                            Sidebar widget added successfully
                        </p>
                    ),
                }, 'sidebar-widget-add-success');
                sidebarWidgetsRequest();
                dataTableContext.modal.close('widget-form-select-widget');
            }
        }, 'widget-form-select-widget');
    }

    async function handleMoveWidget({
        direction,
        reorderData,
        onChange,
        itemSchema,
        newIndex,
        index,
        item
    }: ReorderOnMove) {
        if (!['up', 'down'].includes(direction)) {
            return false;
        }

        if (!validateSidebarId()) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${item.id}/reorder`,
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
                        Sidebar moved successfully
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
                    Sidebar move failed
                </p>
            ),
        }, 'sidebar-item-move-error');
        return false;

    }

    function handleEditWidget({
        reorderData,
        onChange,
        itemSchema,
        index,
        item
    }: ReorderOnEdit) {

    }

    async function handleDeleteWidget({
        item
    }: ReorderOnDelete) {

        if (!validateSidebarId()) {
            return;
        }

        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Sidebar id not found
                    </p>
                ),
            }, 'sidebar-item-delete-error');
            console.warn('Sidebar id not found', item);
            return false;
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${item.id}/delete`,
            method: TruJobApiMiddleware.METHOD.DELETE,
            protectedReq: true,
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Sidebar deleted successfully
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
                    Sidebar delete failed
                </p>
            ),
        }, 'sidebar-item-delete-error');

        return false;
    }

    async function sidebarWidgetsRequest() {
        if (!validateSidebarId()) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebarWidget.replace('%s', sidebarId.toString())}`,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return;
        }
        const data = response?.data || [];
        setWidgets(data);
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(widgets);
        }
    }, [widgets]);

    useEffect(() => {
        if (!sidebarId) {
            return;
        }
        sidebarWidgetsRequest();
    }, [sidebarId]);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    modalState={dataTableContext.modal}
                    itemSchema={pageWidgetSchema}
                    itemHeader={(item, index) => `${item?.title} (${item?.name})` || 'Item type error'}
                    data={widgets || []}
                    onChange={handleChange}
                    onAdd={handleAddWidget}
                    onEdit={handleEditWidget}
                    onDelete={handleDeleteWidget}
                    onMove={handleMoveWidget}
                    onOk={async ({
                        formHelpers
                     }: ReorderOnOk) => {
                        if (!formHelpers) {
                            return;
                        }
                        if (!validateSidebarId()) {
                            return;
                        }
                        const item = {...formHelpers.values};
                        if (!item?.id) {
                            notificationContext.show({
                                variant: 'danger',
                                title: 'Error',
                                component: (
                                    <p>
                                        Sidebar widget id not found
                                    </p>
                                ),
                            }, 'sidebar-widget-update-error');
                            console.warn('Sidebar widget id not found', item);
                            return false;
                        }
                        if (Array.isArray(item?.roles)) {
                            item.roles = RequestHelpers.extractIdsFromArray(item.roles);
                        }
                        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                            endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${item.id}/update`,
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
                                        Sidebar widget updated successfully
                                    </p>
                                ),
                            }, 'sidebar-widget-update-success');
                            sidebarWidgetsRequest();
                            return true;
                        }
                        notificationContext.show({
                            variant: 'danger',
                            title: 'Error',
                            component: (
                                <p>
                                    Sidebar widget update failed
                                </p>
                            ),
                        }, 'sidebar-widget-update-error');
                        return false;
                    }}
                >
                    {({
                        item,
                        index,
                        modalService,
                    }: {
                        item: Widget;
                        index: number;
                        modalService: ModalService;
                    }) => {
                        return (
                        <>
                            <EditWidget
                                data={item}
                                operation={'edit'}
                                inModal={true}
                                modalId={'reorder-modal'}
                            />
                        </>
                    )}}
                </Reorder>
            </div>
        </div>
    );
}
export default WidgetForm;