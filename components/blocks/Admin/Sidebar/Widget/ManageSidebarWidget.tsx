import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext } from "react";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataTableContextType } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import EditSidebarWidget from "./EditSidebarWidget";
import { SidebarWidget } from "@/types/Widget";
import { FormikProps, FormikValues } from "formik";

export const EDIT_SIDEBAR_WIDGET_MODAL_ID = 'edit-sidebar-widget-modal';

function ManageSidebarWidget() {
    const appModalContext = useContext(AppModalContext);
    function getSidebarWidgetFormModalProps() {
        return {
            formProps: {},
            show: true,
            showFooter: true,
            onOk: ({ formHelpers }: {
                formHelpers?: FormikProps<FormikValues>
            }) => {
                if (!formHelpers) {
                    return;
                }
                if (typeof formHelpers?.submitForm !== 'function') {
                    return;
                }
                formHelpers.submitForm();
            },
            fullscreen: true
        }
    }
    function renderActions(item: SidebarWidget, index: number, dataTableContextState: DataTableContextType) {
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
                                <EditSidebarWidget
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_SIDEBAR_MODAL_ID}
                                />
                            ),
                            ...getSidebarWidgetFormModalProps(),
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
                                            <EditSidebarWidget
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_SIDEBAR_MODAL_ID}
                                            />
                                        ),
                                        ...getSidebarWidgetFormModalProps(),
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
                                            if (!item?.id) {
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
            data: dataTableContextState?.post || {},
        })
        if (!response) {
            setDataTableContextState((prevState: DataTableContextType) => {
                let newState = {
                    ...prevState,
                    requestStatus: 'idle'
                };
                return newState;
            });
            return;
        }
        setDataTableContextState((prevState: DataTableContextType) => {
            let newState = { ...prevState };
            newState.data = response.data;
            newState.links = response.links;
            newState.meta = response.meta;
            newState.requestStatus = 'idle';
            return newState;
        });
    }
    function renderAddNew(
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
        {
            dataTableContextState,
            setDataTableContextState
        }: {
            dataTableContextState: DataTableContextType,
            setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>
        }) {
        e.preventDefault();
        dataTableContextState.modal.show({
            title: 'New Widget',
            component: (
                <EditSidebarWidget
                    operation={'add'}
                    inModal={true}
                    modalId={EDIT_SIDEBAR_MODAL_ID}
                />
            ),
            ...getSidebarWidgetFormModalProps(),
        }, EDIT_SIDEBAR_MODAL_ID);
    }
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataManager
                renderAddNew={renderAddNew}
                renderActions={renderActions}
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
export default ManageSidebarWidget;