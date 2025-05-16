import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";
import EditListingColor from "./EditListingColor";
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
import { UrlHelpers } from "@/helpers/UrlHelpers";
import ManageColor from "../../Color/ManageColor";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import { ModalItem } from "@/library/services/modal/ModalService";
import { Color } from "react-bootstrap/esm/types";


export type ManageListingColorProps = {
    data?: Array<Color>;
    operation?: 'edit' | 'update' | 'add' | 'create';
    listingId?: number;
    enableEdit?: boolean;
    paginationMode?: 'router' | 'state';
    enablePagination?: boolean;
    onChange: (tableData: Array<any>) => void;
    rowSelection?: boolean;
    multiRowSelection?: boolean;
}
export const EDIT_COLOR_MODAL_ID = 'edit-listing-color-modal';
export const CREATE_LISTING_COLOR_MODAL_ID = 'create-listing-color-modal';
export const DELETE_LISTING_COLOR_MODAL_ID = 'delete-listing-color-modal';

function ManageListingColor({
    data,
    operation,
    listingId,
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageListingColorProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    function getListingFormModalProps() {
        return {
            formProps: {
                operation: operation,
                initialValues: {
                    colors: [],
                },
                onSubmit: async (values: FormikValues) => {
                    console.log('Form values', values);
                    if (!operation) {
                        console.warn('Operation is required');
                        return;
                    }
                    if (['add', 'create'].includes(operation)) {
                        if (!Array.isArray(values?.colors)) {
                            console.warn('Invalid values');
                            return;
                        }
                        if (!values?.colors?.length) {
                            console.warn('No colors selected');
                            return;
                        }
                        let origData = data;
                        if (!Array.isArray(origData)) {
                            origData = [];
                            return;
                        }
                        if (typeof onChange === 'function') {
                            onChange([
                                ...origData,
                                ...values?.colors.filter((item: any) => {
                                    return !origData.some((checkedItem: any) => checkedItem?.id === item?.id);
                                })
                            ]);
                        }
                        return;
                    }
                    if (!listingId) {
                        console.warn('Listing ID is required');
                        return;
                    }
                    const ids = RequestHelpers.extractIdsFromArray(values?.colors);
                    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                        endpoint: UrlHelpers.urlFromArray([
                            truJobApiConfig.endpoints.listingBrand.replace(
                                ':listingId',
                                listingId.toString()
                            ),
                            'create',
                        ]),
                        method: ApiMiddleware.METHOD.POST,
                        protectedReq: true,
                        data: {
                            ids: ids,
                        }
                    });
                    if (!response) {
                        notificationContext.show({
                            variant: 'danger',
                            type: 'toast',
                            title: 'Error',
                            component: (
                                <p>Failed to add followers</p>
                            ),
                        }, 'listing-add-error');
                        return false;
                    }
                    notificationContext.show({
                        variant: 'success',
                        type: 'toast',
                        title: 'Success',
                        component: (
                            <p>Added color/s as followers</p>
                        ),
                    }, 'listing-add-success');
                    dataTableContext.refresh();
                    dataTableContext.modal.close('create-listing-color-modal');
                    return true;
                }
            },
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
                                <EditListingColor
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_COLOR_MODAL_ID}
                                />
                            ),
                            ...getListingFormModalProps(),
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
                        e.stopPropagation();
                        dataTableContext.modal.show({
                            title: 'Delete Listing',
                            component: (
                                <p>Are you sure you want to delete this color ({item?.label})?</p>
                            ),
                            onOk: async () => {
                                if (!operation) {
                                    console.warn('Operation is required');
                                    return;
                                }
                                if (['add', 'create'].includes(operation)) {
                                    let cloneData = [...data];
                                    cloneData.splice(index, 1);
                                    if (typeof onChange === 'function') {
                                        onChange(cloneData);
                                    }
                                    dataTableContext.modal.close(DELETE_LISTING_COLOR_MODAL_ID);
                                    return;
                                }
                                if (!listingId) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Listing ID is required</p>
                                        ),
                                    }, 'listing-color-delete-error');
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
                                    }, 'listing-color-delete-error');
                                    return;
                                }
                                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: UrlHelpers.urlFromArray([
                                        truJobApiConfig.endpoints.listingColor.replace(':listingId', listingId.toString()),
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
                                            <p>Failed to delete listing color</p>
                                        ),
                                    }, 'listing-color-delete-error');
                                    return;
                                }
                                dataTableContextState.refresh();

                            },
                            show: true,
                            showFooter: true
                        }, DELETE_LISTING_COLOR_MODAL_ID);
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
                                            <EditListingColor
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_COLOR_MODAL_ID}
                                            />
                                        ),
                                        ...getListingFormModalProps(),
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
        if (!operation) {
            console.warn('Operation is required');
            return;
        }

        if (!listingId) {
            console.warn('Listing ID is required');
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
                truJobApiConfig.endpoints.listingColor.replace(':listingId', listingId.toString()),
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post,
        });
    }
    function renderAddNew(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { dataTableContextState, setDataTableContextState }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
    }) {
        e.preventDefault();
        // e.stopPropagation();
        dataTableContext.modal.show({
            title: 'Add New Listing Color',
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
                    <AccessControlComponent
                        roles={[
                            { name: 'admin' },
                            { name: 'superuser' },
                            { name: 'user' },
                        ]}
                    >
                        <ManageColor
                            operation={operation}
                            rowSelection={true}
                            multiRowSelection={true}
                            enableEdit={false}
                            paginationMode="state"
                            onChange={async (colors: Array<any>) => {
                                if (!Array.isArray(colors)) {
                                    console.log('Invalid values received from ManageUser component');
                                    return;
                                }
                                const checkedCategories = colors.filter((item) => item?.checked);

                                // setSelectedBrands(prevState => {
                                //     let cloneState = [...prevState];
                                //     return [
                                //         ...cloneState,
                                //         ...checkedBrands.filter((item) => {
                                //             return !cloneState.find((checkedItem) => checkedItem?.id === item?.id);
                                //         })
                                //     ];
                                // });
                                const existingCategories = data || [];
                                formHelpers.setFieldValue('colors', [
                                    ...existingCategories,
                                    ...checkedCategories.filter((item) => {
                                        return !existingCategories.find((checkedItem) => checkedItem?.id === item?.id);
                                    })
                                ]);
                            }}
                        />
                    </AccessControlComponent>
                )
            },
            ...getListingFormModalProps(),
        }, 'create-listing-color-modal');
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
                data={data}
                rowSelection={rowSelection}
                multiRowSelection={multiRowSelection}
                onChange={onChange}
                enableEdit={enableEdit}
                paginationMode={paginationMode}
                enablePagination={enablePagination}
                title={'Manage Listing Colors'}
                rowSelectActions={getRowSelectActions()}
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={listingRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Label', key: 'label' },
                    { label: 'Name', key: 'name' }
                ]}
            />
        </Suspense>
    );
}
export default ManageListingColor;