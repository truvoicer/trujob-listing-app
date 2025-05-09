import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext, dataTableContextData } from "@/contexts/DataTableContext";
import { Button, Modal } from "react-bootstrap";
import { ModalService } from "@/library/services/modal/ModalService";
import Pagination from "@/components/listings/Pagination";
import DataManager, { DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { PAGINATION_PAGE_NUMBER, SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import EditMenu from "./EditMenu";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { RequestHelpers } from "@/helpers/RequestHelpers";

export const EDIT_MENU_MODAL_ID = 'edit-menu-modal';
export type ManageMenuProps = {
    enableEdit?: boolean;
    paginationMode?: 'router' | 'state';
    enablePagination?: boolean;
    onChange: (tableData: Array<any>) => void;
    rowSelection?: boolean;
    multiRowSelection?: boolean;
}
function ManageMenu({
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageMenuProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    function getMenuFormModalProps() {
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
    function renderActionColumn(item, index, dataTableContextState) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContextState.modal.show({
                            title: 'Edit Menu',
                            component: (
                                <EditMenu
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_MENU_MODAL_ID}
                                />
                            ),
                            ...getMenuFormModalProps(),
                        }, EDIT_MENU_MODAL_ID);
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
                                        title: 'Edit Menu',
                                        component: (
                                            <EditMenu
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_MENU_MODAL_ID}
                                            />
                                        ),
                                        ...getMenuFormModalProps(),
                                    }, EDIT_MENU_MODAL_ID);
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
                                        title: 'Delete Menu',
                                        component: (
                                            <p>Are you sure you want to delete this menu | name: {item?.name} | id: ({item?.id})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id || item?.id === '') {
                                                throw new Error('Menu ID is required');
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.menu}/${item.id}/delete`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true
                                            })
                                            if (!response) {
                                                return;
                                            }
                                            dataTableContextState.refresh();
                                        },
                                        show: true,
                                        showFooter: true
                                    }, EDIT_MENU_MODAL_ID);
                                }
                            }
                        }
                    ]}
                />
            </div>
        )
    }
    async function prepareSearch(searchParams = {}) {

        let query = {};

        if (isNotEmpty(searchParams?.sort_by)) {
            query[SORT_BY] = searchParams?.sort_by;
        }

        if (isNotEmpty(searchParams?.sort_order)) {
            query[SORT_ORDER] = searchParams?.sort_order;
        }

        // if (isNotEmpty(searchParams?.page_size)) {
        //     query[fetcherApiConfig.pageSizeKey] = parseInt(searchParams.page_size);
        // }
        if (isNotEmpty(searchParams?.page)) {
            query['page'] = searchParams.page;
        }
        return query;
    }
    async function menuRequest({ dataTableContextState, setDataTableContextState, searchParams }) {
        let query = dataTableContextState?.query || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menu}`,
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
    function renderAddNew(e, { dataTableContextState, setDataTableContextState }) {
        e.preventDefault();
        dataTableContextState.modal.show({
            title: 'New Menu',
            component: (
                <EditMenu
                    operation={'add'}
                    inModal={true}
                    modalId={EDIT_MENU_MODAL_ID}

                />
            ),
            ...getMenuFormModalProps(),
        }, EDIT_MENU_MODAL_ID);
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
                    title: 'Bulk Delete Menus',
                    message: 'Are you sure you want to delete selected menus?',
                    onOk: async () => {
                        console.log('Yes')
                        if (!data?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>No menus selected</p>
                                ),
                            }, 'menu-bulk-delete-error');
                            return;
                        }
                        const ids = RequestHelpers.extractIdsFromArray(data);
                        if (!ids?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Menu IDs are required</p>
                                ),
                            }, 'menu-bulk-delete-error');
                            return;
                        }
                        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                            endpoint: `${truJobApiConfig.endpoints.menu}/bulk/delete`,
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
                                    <p>Failed to delete menus</p>
                                ),
                            }, 'menu-bulk-delete-error');
                            return;
                        }

                        notificationContext.show({
                            variant: 'success',
                            type: 'toast',
                            title: 'Success',
                            component: (
                                <p>Menus deleted successfully</p>
                            ),
                        }, 'menu-bulk-delete-success');
                        dataTableContextState.refresh();
                    },
                    onCancel: () => {
                        console.log('Cancel delete');
                    },
                }, 'delete-bulk-page-confirmation');
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
                rowSelectActions={getRowSelectActions()}
                multiRowSelection={true}
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={menuRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Name', key: 'name' },
                ]}
            />
        </Suspense>
    );
}
export default ManageMenu;