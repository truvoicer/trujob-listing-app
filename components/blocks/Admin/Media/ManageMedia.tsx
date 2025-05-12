import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";
import EditMedia from "./EditMedia";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataTableContextType, DatatableSearchParams, DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { PAGINATION_PAGE_NUMBER, SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import { Listing } from "@/types/Listing";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { OnRowSelectActionClick } from "@/components/Table/DataTable";
import { DataTableContext } from "@/contexts/DataTableContext";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { Media } from "@/types/Media";

export type ManageMediaProps = {
    operation?: 'edit' | 'update' | 'add' | 'create';
    data?: Array<Media>;
    enableEdit?: boolean;
    paginationMode?: 'router' | 'state';
    enablePagination?: boolean;
    onChange: (tableData: Array<any>) => void;
    rowSelection?: boolean;
    multiRowSelection?: boolean;
}
export const EDIT_PAGE_MODAL_ID = 'edit-listing-modal';

function ManageMedia({
    operation = 'edit',
    data,
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageMediaProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    function getListingFormModalProps() {
        return {
            formProps: {},
            show: true,
            showFooter: true,
            onOk: async ({ formHelpers }: {
                formHelpers?: FormikProps<FormikValues>
            }) => {
                if (!formHelpers) {
                    return;
                }
                if (typeof formHelpers?.submitForm !== 'function') {
                    return;
                }
                const response = await formHelpers.submitForm();
                if (!response) {
                    return false;
                }
                return true;
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
                                <EditMedia
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_PAGE_MODAL_ID}
                                />
                            ),
                            ...getListingFormModalProps(),
                        }, EDIT_PAGE_MODAL_ID);
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
                                            <EditMedia
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_PAGE_MODAL_ID}
                                            />
                                        ),
                                        ...getListingFormModalProps(),
                                    }, EDIT_PAGE_MODAL_ID);
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
                                    }, EDIT_PAGE_MODAL_ID);
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

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.listing}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            post: dataTableContextState?.post || {},
        })
        if (!response) {
            setDataTableContextState(prevState => {
                let newState = {
                    ...prevState,
                    requestStatus: 'idle'
                };
                return newState;
            });
            return;
        }
        setDataTableContextState(prevState => {
            let newState = { ...prevState };
            newState.data = response.data;
            newState.links = response.links;
            newState.meta = response.meta;
            newState.requestStatus = 'idle';
            return newState;
        });
    }
    function renderAddNew(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { dataTableContextState, setDataTableContextState }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
    }) {
        e.preventDefault();
        // e.stopPropagation();
        console.log('Add New Listing', dataTableContextState.modal);
        dataTableContextState.modal.show({
            title: 'Add New Listing',
            component: (
                <EditMedia
                    operation={'add'}
                    inModal={true}
                    modalId={EDIT_PAGE_MODAL_ID}
                />
            ),
            ...getListingFormModalProps(),
        }, EDIT_PAGE_MODAL_ID);
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
                        console.log('Yes')
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
export default ManageMedia;