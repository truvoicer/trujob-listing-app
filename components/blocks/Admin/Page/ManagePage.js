import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import EditPage from "./EditPage";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext, dataTableContextData } from "@/contexts/DataTableContext";
import { Button, Modal } from "react-bootstrap";
import { ModalService } from "@/library/services/modal/ModalService";
import Pagination from "@/components/listings/Pagination";
import DataManager from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { PAGINATION_PAGE_NUMBER, SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";

export const EDIT_PAGE_MODAL_ID = 'edit-page-modal';

function ManagePage() {
    function renderActions(item, index, dataTableContextState) {
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
                                />
                            ),
                            show: true,
                            showFooter: false,
                            fullscreen: true
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
                                            />
                                        ),
                                        show: true,
                                        showFooter: false
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
                                            if (!item?.id || item?.id === '') {
                                                throw new Error('Page ID is required');
                                            }
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
            query['page'] = parseInt(searchParams.page);
        }
        return query;
    }
    async function pageRequest({ dataTableContextState, setDataTableContextState }) {
        let query = dataTableContextState?.query || {};
        const preparedQuery = await prepareSearch(dataTableContextState?.searchParams);
        query = {
            ...query,
            ...preparedQuery
        }
        console.log('Page Request', {
            dataTableContextState, 
            query,
            preparedQuery
        });
        
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            post: dataTableContextState?.post || {},
        })
        if (!response) {
            return;
        }
        setDataTableContextState(prevState => {
            let newState = { ...prevState };
            newState.data = response.data;
            newState.links = response.links;
            newState.meta = response.meta;
            return newState;
        });
    }
    function renderAddNew(e, { dataTableContextState, setDataTableContextState }) {
        e.preventDefault();
        // e.stopPropagation();
        console.log('Add New Page', dataTableContextState.modal);
        dataTableContextState.modal.show({
            title: 'Add New Page',
            component: (
                <EditPage
                    operation={'add'}
                />
            ),
            show: true,
            showFooter: false
        }, EDIT_PAGE_MODAL_ID);
    }
    return (
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
    );
}
export default ManagePage;