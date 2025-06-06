import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";
import EditShippingRate from "./EditShippingRate";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataManageComponentProps, DataTableContextType, DatatableSearchParams, DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import { ShippingRate } from "@/types/Shipping";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export const CREATE_SHIPPING_RATE_MODAL_ID = 'create-shipping-rate-modal';
export const EDIT_SHIPPING_RATE_MODAL_ID = 'edit-shipping-rate-modal';
export const DELETE_SHIPPING_RATE_MODAL_ID = 'delete-shipping-rate-modal';

export interface ManageShippingRateProps extends DataManageComponentProps {
    data?: Array<ShippingRate>;
    shippingMethodId?: number;
}

function ManageShippingRate({
    shippingMethodId,
    mode = 'selector',
    data,
    operation = 'create',
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageShippingRateProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    function getAddNewModalInitialValues() {
        switch (mode) {
            case 'selector':
                return {
                    shippingRates: [],
                };
            case 'edit':
                return {};
            default:
                return {};
        }
    }

    function getShippingRateFormModalProps(index?: number) {
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
                            values: formHelpers?.values?.shippingRates,
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
        }
    }

    function renderActionColumn(item: ShippingRate, index: number, dataTableContextState: DataTableContextType) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContextState.modal.show({
                            title: 'Edit shipping rate',
                            component: (
                                <EditShippingRate
                                    dataTable={dataTableContextState} data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_SHIPPING_RATE_MODAL_ID}
                                />
                            ),
                            ...getShippingRateFormModalProps(index),
                        }, EDIT_SHIPPING_RATE_MODAL_ID);
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
                            title: 'Delete shipping rate',
                            component: (
                                <p>Are you sure you want to delete this shipping rate ({item?.name} | {item?.label})?</p>
                            ),
                            onOk: async () => {
                                console.log('Delete shipping rate', { operation, item });
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
                                    dataTableContext.modal.close(DELETE_SHIPPING_RATE_MODAL_ID);
                                    return;
                                }
                                if (!shippingMethodId) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Shipping method ID is required</p>
                                        ),
                                    }, 'shipping-rate-delete-error');
                                    return;
                                }
                                if (!item?.id) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Shipping rate ID is required</p>
                                        ),
                                    }, 'shipping-rate-delete-error');
                                    return;
                                }
                                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: UrlHelpers.urlFromArray([
                                        truJobApiConfig.endpoints.shippingMethodRate.replace(':shippingMethodId', shippingMethodId.toString()),
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
                                            <p>Failed to delete shipping rate</p>
                                        ),
                                    }, 'shipping-rate-delete-error');
                                    return;
                                }
                                dataTableContextState.refresh();

                            },
                            show: true,
                            showFooter: true
                        }, DELETE_SHIPPING_RATE_MODAL_ID);
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
                                        title: 'Edit Shipping rate',
                                        component: (
                                            <EditShippingRate
                                                dataTable={dataTableContextState} data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_SHIPPING_RATE_MODAL_ID}
                                            />
                                        ),
                                        ...getShippingRateFormModalProps(index),
                                    }, EDIT_SHIPPING_RATE_MODAL_ID);
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
                                        title: 'Delete shipping rate',
                                        component: (
                                            <p>Are you sure you want to delete this shippingRate ({item?.title})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Shipping rate ID is required</p>
                                                    ),
                                                }, 'shipping-rate-delete-error');
                                                return;
                                            }
                                            if (!shippingMethodId) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Shipping method ID is required</p>
                                                    ),
                                                }, 'shipping-rate-delete-error');
                                                return;
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: UrlHelpers.urlFromArray([
                                                    truJobApiConfig.endpoints.shippingMethodRate.replace(':shippingMethodId', shippingMethodId.toString()),
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
                                                        <p>Failed to delete shippingRate</p>
                                                    ),
                                                }, 'shipping-rate-delete-error');
                                                return;
                                            }
                                            dataTableContextState.refresh();
                                        },
                                        show: true,
                                        showFooter: true
                                    }, EDIT_SHIPPING_RATE_MODAL_ID);
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

        if (isNotEmpty(searchParams?.shippingRate)) {
            query['shippingRate'] = searchParams.shippingRate;
        }
        return query;
    }
    async function shippingRateRequest({ dataTableContextState, setDataTableContextState, searchParams }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
        searchParams: any
    }) {
        if (!operation) {
            console.warn('Operation is required');
            return;
        }
        if (!shippingMethodId) {
            console.warn('Shipping method ID is required');
            return;
        }
        let query = dataTableContextState?.query || {};
        let post = dataTableContextState?.post || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.shippingMethodRate.replace(':shippingMethodId', shippingMethodId.toString())
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
        });
    }

    function renderAddNew(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        { dataTableContextState, setDataTableContextState }: {
            dataTableContextState: DataTableContextType,
            setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
        }) {
        e.preventDefault();
        let modalState;
        if (mode === 'selector') {
            modalState = dataTableContext.modal;
        } else if (mode === 'edit') {
            modalState = dataTableContext.modal;
        } else {
            console.warn('Invalid mode');
            return;
        }
        modalState.show({
            title: 'Create shipping rate',
            component: (
                <EditShippingRate
                    dataTable={dataTableContextState} operation={'create'}
                    inModal={true}
                    modalId={CREATE_SHIPPING_RATE_MODAL_ID}
                />
            ),
            ...getShippingRateFormModalProps(),
        }, CREATE_SHIPPING_RATE_MODAL_ID);
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
                    message: 'Are you sure you want to delete selected shippingRates?',
                    onOk: async () => {
                        if (!data?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>No shipping rates selected</p>
                                ),
                            }, 'shipping-rate-bulk-delete-error');
                            return;
                        }
                        const ids = RequestHelpers.extractIdsFromArray(data);
                        if (!ids?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Shipping rate IDs are required</p>
                                ),
                            }, 'shipping-rate-bulk-delete-error');
                            return;
                        }
                        if (!shippingMethodId) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Shipping method ID is required</p>
                                ),
                            }, 'shipping-rate-bulk-delete-error');
                            return;
                        }
                        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                            endpoint: UrlHelpers.urlFromArray([
                                truJobApiConfig.endpoints.shippingMethodRate.replace(':shippingMethodId', shippingMethodId.toString()),
                                'bulk/delete',
                            ]),
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
                                    <p>Failed to delete shippingRates</p>
                                ),
                            }, 'shipping-rate-bulk-delete-error');
                            return;
                        }

                        notificationContext.show({
                            variant: 'success',
                            type: 'toast',
                            title: 'Success',
                            component: (
                                <p>Shipping rates deleted successfully</p>
                            ),
                        }, 'shipping-rate-bulk-delete-success');
                        dataTableContextState.refresh();
                    },
                    onCancel: () => {
                        console.log('Cancel delete');
                    },
                }, 'delete-bulk-shipping-rate-confirmation');
            }
        });
        return actions;
    }


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataManager
                data={data}
                rowSelection={rowSelection}
                multiRowSelection={multiRowSelection}
                onChange={onChange}
                enableEdit={enableEdit}
                paginationMode={paginationMode}
                enablePagination={enablePagination}
                title={'Manage Shipping rates'}
                rowSelectActions={getRowSelectActions()}
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={shippingRateRequest}
                columns={[
                    {
                        label: 'ID',
                        key: 'id',
                    },
                    {
                        label: 'Shipping Method',
                        key: 'shipping_method.name',
                    },
                    {
                        label: 'Shipping Zone',
                        key: 'shipping_zone.name',
                    },
                    {
                        label: 'Type',
                        key: 'type',
                    },
                    {
                        label: 'Min Amount',
                        key: 'min_amount',
                    },
                    {
                        label: 'Max Amount',
                        key: 'max_amount',
                    },
                    {
                        label: 'Amount',
                        key: 'amount',
                    },
                    {
                        label: 'Currency',
                        key: 'currency.name',
                    },
                    {
                        label: 'Free Shipping Possible',
                        key: 'is_free_shipping_possible',
                    },
                    {
                        label: 'Created At',
                        key: 'created_at',
                    },
                    {
                        label: 'Updated At',
                        key: 'updated_at',
                    },
                ]}
            />
        </Suspense>
    );
}
export default ManageShippingRate;