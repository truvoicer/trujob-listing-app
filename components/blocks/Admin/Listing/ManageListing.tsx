import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";
import EditListing from "./EditListing";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataManageComponentProps, DataTableContextType, DatatableSearchParams, DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import { Listing } from "@/types/Listing";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


export interface ManageListingProps extends DataManageComponentProps {
    data?: Array<Listing>;
}
export const EDIT_LISTING_MODAL_ID = 'edit-listing-modal';
export const CREATE_LISTING_MODAL_ID = 'create-listing-modal';
export const DELETE_LISTING_MODAL_ID = 'delete-listing-modal';

function ManageListing({
    mode = 'selector',
    operation,
    data,
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageListingProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    function getAddNewModalInitialValues() {
        switch (mode) {
            case 'selector':
                return {
                    listings: [],
                };
            case 'edit':
                return {};
            default:
                return {};
        }
    }

    function getListingFormModalProps() {
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
                        DataManagerService.selectorModeCreateHandler({
                            onChange,
                            data,
                            values: formHelpers?.values?.features,
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

    function renderActionColumn(item: Listing, index: number, dataTableContextState: DataTableContextType) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContextState.modal.show({
                            title: 'Edit Listing',
                            component: (
                                <EditListing
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_LISTING_MODAL_ID}
                                />
                            ),
                            ...getListingFormModalProps(),
                        }, EDIT_LISTING_MODAL_ID);
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
                            title: 'Delete Listing',
                            component: (
                                <p>Are you sure you want to delete this listing ({item?.name} | {item?.title})?</p>
                            ),
                            onOk: async () => {
                                console.log('Delete listing', { operation, item });
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
                                    dataTableContext.modal.close(DELETE_LISTING_MODAL_ID);
                                    return;
                                }
                                if (!item?.id) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Listing ID is required</p>
                                        ),
                                    }, 'listing-delete-error');
                                    return;
                                }
                                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: UrlHelpers.urlFromArray([
                                        truJobApiConfig.endpoints.listing,
                                        item.id,
                                        'delete'
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
                                            <p>Failed to delete listing</p>
                                        ),
                                    }, 'listing-delete-error');
                                    return;
                                }
                                dataTableContextState.refresh();

                            },
                            show: true,
                            showFooter: true
                        }, DELETE_LISTING_MODAL_ID);
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
                                        title: 'Edit Listing',
                                        component: (
                                            <EditListing
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_LISTING_MODAL_ID}
                                            />
                                        ),
                                        ...getListingFormModalProps(),
                                    }, EDIT_LISTING_MODAL_ID);
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
                                        title: 'Delete Listing',
                                        component: (
                                            <p>Are you sure you want to delete this listing ({item?.title})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Listing ID is required</p>
                                                    ),
                                                }, 'listing-delete-error');
                                                return;
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.listing}/${item.id}/delete`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true
                                            })
                                            if (!response) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Failed to delete listing</p>
                                                    ),
                                                }, 'listing-delete-error');
                                                return;
                                            }
                                            dataTableContextState.refresh();
                                        },
                                        show: true,
                                        showFooter: true
                                    }, EDIT_LISTING_MODAL_ID);
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

        // if (isNotEmpty(searchParams?.listing_size)) {
        //     query[fetcherApiConfig.listingSizeKey] = parseInt(searchParams.listing_size);
        // }
        if (isNotEmpty(searchParams?.listing)) {
            query['listing'] = searchParams.listing;
        }
        return query;
    }
    async function listingRequest({ dataTableContextState, setDataTableContextState, searchParams }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
        searchParams: any
    }) {
        let query = dataTableContextState?.query || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.listing}`,
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
        // e.stopPropagation();
        // console.warn('Add New Listing', dataTableContextState.modal);
        dataTableContextState.modal.show({
            title: 'Add New Listing',
            component: (
                <EditListing
                    operation={'add'}
                    inModal={true}
                    modalId={CREATE_LISTING_MODAL_ID}
                />
            ),
            ...getListingFormModalProps(),
        }, CREATE_LISTING_MODAL_ID);
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
                    message: 'Are you sure you want to delete selected listings?',
                    onOk: async () => {
                        console.warn('Yes')
                        if (!data?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>No listings selected</p>
                                ),
                            }, 'listing-bulk-delete-error');
                            return;
                        }
                        const ids = RequestHelpers.extractIdsFromArray(data);
                        if (!ids?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Listing IDs are required</p>
                                ),
                            }, 'listing-bulk-delete-error');
                            return;
                        }
                        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                            endpoint: `${truJobApiConfig.endpoints.listing}/bulk/delete`,
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
                                    <p>Failed to delete listings</p>
                                ),
                            }, 'listing-bulk-delete-error');
                            return;
                        }

                        notificationContext.show({
                            variant: 'success',
                            type: 'toast',
                            title: 'Success',
                            component: (
                                <p>Listings deleted successfully</p>
                            ),
                        }, 'listing-bulk-delete-success');
                        dataTableContextState.refresh();
                    },
                    onCancel: () => {
                        console.log('Cancel delete');
                    },
                }, 'delete-bulk-listing-confirmation');
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
                title={'Manage Listings'}
                rowSelectActions={getRowSelectActions()}
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={listingRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Title', key: 'title' },
                    { label: 'Permalink', key: 'permalink' }
                ]}
            />
        </Suspense>
    );
}
export default ManageListing;