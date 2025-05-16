import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext } from "react";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import EditWidget from "./EditWidget";
import { FormikProps, FormikValues } from "formik";
import { RequestHelpers } from "@/helpers/RequestHelpers";


export const EDIT_SIDEBAR_MODAL_ID = 'edit-widget-modal';
export type ManageWidgetProps = {
    enableEdit?: boolean;
    paginationMode?: 'router' | 'state';
    enablePagination?: boolean;
    onChange: (tableData: Array<any>) => void;
    rowSelection?: boolean;
    multiRowSelection?: boolean;
}
function ManageWidget({
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageWidgetProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppModalContext);
    function getWidgetFormModalProps() {
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
                            title: 'Edit Widget',
                            component: (
                                <EditWidget
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_SIDEBAR_MODAL_ID}
                                />
                            ),
                            ...getWidgetFormModalProps(),
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
                                        title: 'Edit Widget',
                                        component: (
                                            <EditWidget
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_SIDEBAR_MODAL_ID}
                                            />
                                        ),
                                        ...getWidgetFormModalProps(),
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
                                        title: 'Delete Widget',
                                        component: (
                                            <p>Are you sure you want to delete this widget | name: {item?.name} | id: ({item?.id})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id || item?.id === '') {
                                                throw new Error('Widget ID is required');
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.widget}/${item.id}/delete`,
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
    async function widgetRequest({ dataTableContextState, setDataTableContextState, searchParams }) {
        let query = dataTableContextState?.query || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.widget}`,
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
            title: 'New Widget',
            component: (
                <EditWidget
                    operation={'add'}
                    inModal={true}
                    modalId={EDIT_SIDEBAR_MODAL_ID}
                />
            ),
            ...getWidgetFormModalProps(),
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
                        title: 'Bulk Delete Widgets',
                        message: 'Are you sure you want to delete selected widgets?',
                        onOk: async () => {
                            console.log('Yes')
                            if (!data?.length) {
                                notificationContext.show({
                                    variant: 'danger',
                                    type: 'toast',
                                    title: 'Error',
                                    component: (
                                        <p>No widgets selected</p>
                                    ),
                                }, 'widget-bulk-delete-error');
                                return;
                            }
                            const ids = RequestHelpers.extractIdsFromArray(data);
                            if (!ids?.length) {
                                notificationContext.show({
                                    variant: 'danger',
                                    type: 'toast',
                                    title: 'Error',
                                    component: (
                                        <p>Widget IDs are required</p>
                                    ),
                                }, 'widget-bulk-delete-error');
                                return;
                            }
                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                endpoint: `${truJobApiConfig.endpoints.widget}/bulk/delete`,
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
                                        <p>Failed to delete widgets</p>
                                    ),
                                }, 'widget-bulk-delete-error');
                                return;
                            }
    
                            notificationContext.show({
                                variant: 'success',
                                type: 'toast',
                                title: 'Success',
                                component: (
                                    <p>Widgets deleted successfully</p>
                                ),
                            }, 'widget-bulk-delete-success');
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
                request={widgetRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Name', key: 'name' },
                    { label: 'Title', key: 'title' },
                ]}
            />
        </Suspense>
    );
}
export default ManageWidget;