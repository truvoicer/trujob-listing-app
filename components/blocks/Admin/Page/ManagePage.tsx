import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";
import EditPage from "./EditPage";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataTableContextType, DatatableSearchParams } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { PAGINATION_PAGE_NUMBER, SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import { Page } from "@/types/Page";
import { FormContextType } from "@/components/form/Form";

export type ManagePageProps = {
}
export const EDIT_PAGE_MODAL_ID = 'edit-page-modal';

function ManagePage({ }: ManagePageProps) {
    const appModalContext = useContext(AppModalContext);

    function getPageFormModalProps() {
        return {
            formProps: {},
            show: true,
            showFooter: true,
            onOk: ({ formHelpers }: {
                formHelpers?: FormContextType | null
            }) => {
                if (!formHelpers) {
                    return;
                }
                if (typeof formHelpers?.onSubmit !== 'function') {
                    return;
                }
                formHelpers.onSubmit();
            },
            fullscreen: true
        }
    }

    function renderActions(item: Page, index: number, dataTableContextState: DataTableContextType) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContextState.modal.show({
                            title: 'Edit Page',
                            component: (
                                <EditPage
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_PAGE_MODAL_ID}
                                />
                            ),
                            ...getPageFormModalProps(),
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
                                        title: 'Edit Page',
                                        component: (
                                            <EditPage
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_PAGE_MODAL_ID}
                                            />
                                        ),
                                        ...getPageFormModalProps(),
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
                                        title: 'Delete Page',
                                        component: (
                                            <p>Are you sure you want to delete this page ({item?.title})?</p>
                                        ),
                                        onOk: async () => {
                                            // if (!item?.id || item?.id === '') {
                                            //     throw new Error('Page ID is required');
                                            // }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.page}/${item.id}`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true
                                            })
                                            if (!response) {
                                                return;
                                            }
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

        // if (isNotEmpty(searchParams?.page_size)) {
        //     query[fetcherApiConfig.pageSizeKey] = parseInt(searchParams.page_size);
        // }
        if (isNotEmpty(searchParams?.page)) {
            query['page'] = searchParams.page;
        }
        return query;
    }
    async function pageRequest({ dataTableContextState, setDataTableContextState, searchParams }: {
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
            endpoint: `${truJobApiConfig.endpoints.page}`,
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
        console.log('Add New Page', dataTableContextState.modal);
        dataTableContextState.modal.show({
            title: 'Add New Page',
            component: (
                <EditPage
                    operation={'add'}
                    inModal={true}
                    modalId={EDIT_PAGE_MODAL_ID}
                />
            ),
            ...getPageFormModalProps(),
        }, EDIT_PAGE_MODAL_ID);
    }
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataManager
                renderAddNew={renderAddNew}
                renderActions={renderActions}
                request={pageRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Title', key: 'title' },
                    { label: 'Permalink', key: 'permalink' }
                ]}
            />
        </Suspense>
    );
}
export default ManagePage;