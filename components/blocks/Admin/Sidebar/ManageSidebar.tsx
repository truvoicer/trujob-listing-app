import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext } from "react";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataManageComponentProps, DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import EditSidebar from "./EditSidebar";
import { FormikProps, FormikValues } from "formik";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { Sidebar } from "@/types/Sidebar";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContext } from "@/contexts/DataTableContext";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


export const EDIT_SIDEBAR_MODAL_ID = 'edit-sidebar-modal';
export const CREATE_SIDEBAR_MODAL_ID = 'create-sidebar-modal';
export const DELETE_SIDEBAR_MODAL_ID = 'delete-sidebar-modal';
export interface ManageSidebarProps extends DataManageComponentProps {
    data?: Array<Sidebar>;
}
function ManageSidebar({
    operation = 'create',
    data,
    mode = 'selector',
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageSidebarProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppModalContext);
    const dataTableContext = useContext(DataTableContext);


    function getAddNewModalInitialValues() {
        switch (mode) {
            case 'selector':
                return {
                    sidebars: [],
                };
            case 'edit':
                return {};
            default:
                return {};
        }
    }

    function getSidebarFormModalProps() {
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
                            values: formHelpers?.values?.sidebars,
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
                            title: 'Edit Sidebar',
                            component: (
                                <EditSidebar
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_SIDEBAR_MODAL_ID}
                                />
                            ),
                            ...getSidebarFormModalProps(),
                        }, EDIT_SIDEBAR_MODAL_ID);
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
                                        title: 'Edit Sidebar',
                                        component: (
                                            <EditSidebar
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_SIDEBAR_MODAL_ID}
                                            />
                                        ),
                                        ...getSidebarFormModalProps(),
                                    }, EDIT_SIDEBAR_MODAL_ID);
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
                                        title: 'Delete Sidebar',
                                        component: (
                                            <p>Are you sure you want to delete this sidebar | name: {item?.name} | id: ({item?.id})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id || item?.id === '') {
                                                throw new Error('Sidebar ID is required');
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.sidebar}/${item.id}/delete`,
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
                                    }, EDIT_SIDEBAR_MODAL_ID);
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
    async function sidebarRequest({ dataTableContextState, setDataTableContextState, searchParams }) {
        let query = dataTableContextState?.query || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebar}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: dataTableContextState?.post || {},
        });
    }
    function renderAddNew(e, { dataTableContextState, setDataTableContextState }) {
        e.preventDefault();
        dataTableContextState.modal.show({
            title: 'New Sidebar',
            component: (
                <EditSidebar
                    operation={'add'}
                    inModal={true}
                    modalId={EDIT_SIDEBAR_MODAL_ID}
                />
            ),
            ...getSidebarFormModalProps(),
        }, EDIT_SIDEBAR_MODAL_ID);
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
                    title: 'Bulk Delete Sidebars',
                    message: 'Are you sure you want to delete selected sidebars?',
                    onOk: async () => {
                        console.log('Yes')
                        if (!data?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>No sidebars selected</p>
                                ),
                            }, 'sidebar-bulk-delete-error');
                            return;
                        }
                        const ids = RequestHelpers.extractIdsFromArray(data);
                        if (!ids?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Sidebar IDs are required</p>
                                ),
                            }, 'sidebar-bulk-delete-error');
                            return;
                        }
                        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                            endpoint: `${truJobApiConfig.endpoints.sidebar}/bulk/delete`,
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
                                    <p>Failed to delete sidebars</p>
                                ),
                            }, 'sidebar-bulk-delete-error');
                            return;
                        }

                        notificationContext.show({
                            variant: 'success',
                            type: 'toast',
                            title: 'Success',
                            component: (
                                <p>Sidebars deleted successfully</p>
                            ),
                        }, 'sidebar-bulk-delete-success');
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
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={sidebarRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Name', key: 'name' },
                    { label: 'Title', key: 'title' },
                ]}
            />
        </Suspense>
    );
}
export default ManageSidebar;