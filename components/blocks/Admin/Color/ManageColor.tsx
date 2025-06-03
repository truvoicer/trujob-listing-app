import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext } from "react";
import EditColor from "./EditColor";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataManageComponentProps, DataTableContextType, DatatableSearchParams, DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import { Color } from "@/types/Color";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";

import { ModalItem } from "@/library/services/modal/ModalService";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export interface ManageColorProps extends DataManageComponentProps {
    data?: Array<Color>;
}
export const EDIT_COLOR_MODAL_ID = 'edit-color-modal';
export const CREATE_COLOR_MODAL_ID = 'create-color-modal';
export const DELETE_COLOR_MODAL_ID = 'delete-color-modal';

function ManageColor({
    mode = 'selector',
    data,
    operation = 'create',
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageColorProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);


    function getAddNewModalInitialValues() {
        switch (mode) {
            case 'selector':
                return {
                    colors: [],
                };
            case 'edit':
                return {};
            default:
                return {};
        }
    }
    function getColorFormModalProps(index: number) {
        return {
            formProps: {
                operation: operation,
                initialValues: getAddNewModalInitialValues(),
            },
            show: true,
            showFooter: true,
            onOk: async ({ formHelpers }: {
                formHelpers?: FormikProps<FormikValues>
            }) => {
                if (!formHelpers) {
                    return;
                }
                if (!operation) {
                    console.warn('Operation is required');
                    return;
                }
                if (typeof formHelpers?.submitForm !== 'function') {
                    console.warn('submitForm is not a function');
                    return;
                }
                switch (mode) {
                    case 'selector':
                        DataManagerService.selectorModeHandler({
                            onChange,
                            data,
                            values: formHelpers?.values?.colors,
                            index
                        });
                        break;
                    case 'edit':
                        DataManagerService.editModeCreateHandler({
                            onChange,
                            data,
                            values: formHelpers?.values,
                        });
                        break;
                    default:
                        console.warn('Invalid mode');
                        return;
                }

                return await formHelpers.submitForm();
            },
            fullscreen: true
        };
    }

    function renderActionColumn(item: Color, index: number, dataTableContextState: DataTableContextType) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContextState.modal.show({
                            title: 'Edit Color',
                            component: (
                                <EditColor 
                        dataTable={dataTableContextState}                                     data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_COLOR_MODAL_ID}
                                />
                            ),
                            ...getColorFormModalProps(index),
                        }, EDIT_COLOR_MODAL_ID);
                    }}
                >
                    <i className="lar la-eye"></i>
                </Link>
                <Link className="badge bg-danger-light mr-2"
                    target="_blank"
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        dataTableContextState.modal.show({
                            title: 'Delete Color',
                            component: (
                                <p>Are you sure you want to delete this color ({item?.name} | {item?.label})?</p>
                            ),
                            onOk: async () => {
                                console.log('Delete color', { operation, item });
                                if (!operation) {
                                    console.warn('Operation is required');
                                    return;
                                }
                                if (Array.isArray(data) && data.length) {
                                    let cloneData = [...data];
                                    cloneData.splice(index, 1);
                                    if (typeof onChange === 'function') {
                                        onChange(cloneData);
                                    }
                                    dataTableContext.modal.close(DELETE_COLOR_MODAL_ID);
                                    return;
                                }
                                if (!item?.id) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Color ID is required</p>
                                        ),
                                    }, 'color-delete-error');
                                    return;
                                }
                                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: UrlHelpers.urlFromArray([
                                        truJobApiConfig.endpoints.color,
                                        item.id,
                                        'destroy'
                                    ]),
                                    method: ApiMiddleware.METHOD.DELETE,
                                    protectedReq: true
                                })
                                if (!response) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Failed to delete color</p>
                                        ),
                                    }, 'color-delete-error');
                                    return;
                                }
                                dataTableContextState.refresh();

                            },
                            show: true,
                            showFooter: true
                        }, DELETE_COLOR_MODAL_ID);
                    }}
                >
                    <i className="lar la-eye"></i>
                </Link>
                <BadgeDropDown
                    data={[
                        {
                            text: 'Edit',
                            linkProps: {
                                href: '#',
                                onClick: e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    dataTableContextState.modal.show({
                                        title: 'Edit Color',
                                        component: (
                                            <EditColor 
                        dataTable={dataTableContextState}                                                 data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_COLOR_MODAL_ID}
                                            />
                                        ),
                                        ...getColorFormModalProps(index),
                                    }, EDIT_COLOR_MODAL_ID);
                                }
                            }
                        },
                        {
                            text: 'Delete',
                            linkProps: {
                                href: '#',
                                onClick: e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    appModalContext.show({
                                        title: 'Delete Color',
                                        component: (
                                            <p>Are you sure you want to delete this color ({item?.title})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Color ID is required</p>
                                                    ),
                                                }, 'color-delete-error');
                                                return;
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.color}/${item.id}/delete`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true
                                            })
                                            if (!response) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Failed to delete color</p>
                                                    ),
                                                }, 'color-delete-error');
                                                return;
                                            }
                                            dataTableContextState.refresh();
                                        },
                                        show: true,
                                        showFooter: true
                                    }, EDIT_COLOR_MODAL_ID);
                                }
                            }
                        }
                    ]}
                />
            </div>
        )
    }
    async function prepareSearch(searchParams: DatatableSearchParams = {}) {

        let query: any = {};

        if (isNotEmpty(searchParams?.sort_by)) {
            query[SORT_BY] = searchParams?.sort_by;
        }

        if (isNotEmpty(searchParams?.sort_order)) {
            query[SORT_ORDER] = searchParams?.sort_order;
        }
        if (isNotEmpty(searchParams?.color)) {
            query['color'] = searchParams.color;
        }
        return query;
    }
    async function colorRequest({ dataTableContextState, setDataTableContextState, searchParams }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
        searchParams: any
    }) {
        if (!operation) {
            console.warn('Operation is required');
            return;
        }
        let query = dataTableContextState?.query || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.color,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: dataTableContextState?.post || {},
        });
    }
    function renderAddNew(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { dataTableContextState, setDataTableContextState }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
    }) {
        e.preventDefault();
        dataTableContextState.modal.show({
            title: 'Add New Color',
            component: ({
                modal,
                index,
                formHelpers
            }: {
                modal: ModalItem,
                index: number,
                formHelpers?: any
            }) => {
                return (
                    <EditColor 
                        dataTable={dataTableContextState}                         operation={'add'}
                        inModal={true}
                        modalId={CREATE_COLOR_MODAL_ID}
                    />
                )
            },
            ...getColorFormModalProps(),
        }, CREATE_COLOR_MODAL_ID);
    }

    function getRowSelectActions() {
        let actions = [];
        actions.push({
            label: 'Delete',
            name: 'delete',
            onClick: ({
                action,
                data,
                dataTableContextState,
            }: DMOnRowSelectActionClick) => {

                dataTableContextState.confirmation.show({
                    title: 'Edit Menu',
                    message: 'Are you sure you want to delete selected colors?',
                    onOk: async () => {
                        console.log('Yes')
                        if (!data?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>No colors selected</p>
                                ),
                            }, 'color-bulk-delete-error');
                            return;
                        }
                        const ids = RequestHelpers.extractIdsFromArray(data);
                        if (!ids?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Color IDs are required</p>
                                ),
                            }, 'color-bulk-delete-error');
                            return;
                        }
                        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                            endpoint: `${truJobApiConfig.endpoints.color}/bulk/delete`,
                            method: ApiMiddleware.METHOD.DELETE,
                            protectedReq: true,
                            data: {
                                ids: ids
                            }
                        })
                        if (!response) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Failed to delete colors</p>
                                ),
                            }, 'color-bulk-delete-error');
                            return;
                        }

                        notificationContext.show({
                            variant: 'success',
                            type: 'toast',
                            title: 'Success',
                            component: (
                                <p>Colors deleted successfully</p>
                            ),
                        }, 'color-bulk-delete-success');
                        dataTableContextState.refresh();
                    },
                    onCancel: () => {
                        console.log('Cancel delete');
                    },
                }, 'delete-bulk-color-confirmation');
            }
        });
        return actions;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataManager
                rowSelection={rowSelection}
                multiRowSelection={multiRowSelection}
                onChange={onChange}
                enableEdit={enableEdit}
                paginationMode={paginationMode}
                enablePagination={enablePagination}
                title={'Manage Colors'}
                rowSelectActions={getRowSelectActions()}
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={colorRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Label', key: 'label' },
                    { label: 'Name', key: 'name' }
                ]}
            />
        </Suspense>
    );
}
export default ManageColor;