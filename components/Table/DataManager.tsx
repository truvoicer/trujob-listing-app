import DataTable from "@/components/Table/DataTable";
import { useContext, useEffect, useState } from "react";
import { Button, Modal, Nav, Tab } from "react-bootstrap";
import { ModalItem, ModalService } from "@/library/services/modal/ModalService";
import Pagination from "@/components/listings/Pagination";
import { useSearchParams } from "next/navigation";
import { isObject, isObjectEmpty } from "@/helpers/utils";
import { createContext } from "vm";
import { DataTableContext, dataTableContextData } from "@/contexts/DataTableContext";

export type DataManagerProps = {
    renderActions?: null | ((item: any, index: number, dataTableContextState: any) => React.ReactNode | React.Component | null);
    renderAddNew?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLAnchorElement, MouseEvent>, context: any) => void;
    request?: (context: any) => void;
    columns?: Array<any>;
}

export type DataTableContextType = {
    requestStatus: string;
    data: Array<any>;
    links: any;
    meta: any;
    query: any;
    post: any;
    modal: any;
    refresh: () => void;
    update: (data: any) => void;
}

export type DatatableSearchParams = {
    [key: string]: string | null | undefined;
    page?: string | null;
    sort_order?: string | null;
    sort_by?: string | null;
    query?: string | null;
    page_size?: string | null;
}

export const EDIT_PAGE_MODAL_ID = 'edit-page-modal';

function DataManager({
    renderActions,
    renderAddNew,
    request,
    columns = [],
}: DataManagerProps) {

    const searchParamsUse = useSearchParams();

    const searchParamPage = searchParamsUse.get('page');
    const searchParamSortOrder = searchParamsUse.get('sort_order');
    const searchParamSortBy = searchParamsUse.get('sort_by');
    const searchParamQuery = searchParamsUse.get('query');
    const searchParamPageSize = searchParamsUse.get('page_size');

    const searchParams: DatatableSearchParams = {
        page: searchParamPage,
        sort_order: searchParamSortOrder,
        sort_by: searchParamSortBy,
        query: searchParamQuery,
        page_size: searchParamPageSize,
    };

    const [dataTableContextState, setDataTableContextState] = useState<DataTableContextType>({
        ...dataTableContextData,
        refresh: () => {
            console.log('refresh');
            makeRequest();
        },
    });

    const modalService = new ModalService(dataTableContextState, setDataTableContextState);
    modalService.setKey('modal');

    async function makeRequest() {
        if (typeof request === 'function') {
            if (dataTableContextState?.requestStatus !== 'loading') {
                setDataTableContextState(prevState => {
                    let newState = {
                        ...prevState,
                        requestStatus: 'loading'
                    };
                    return newState;
                });
            }
            request({
                dataTableContextState,
                setDataTableContextState,
                searchParams
            });
            return;
        }
    }

    useEffect(() => {
        const someSet = Object.keys(searchParams).some(key => {
            return searchParams[key] !== null && searchParams[key] !== undefined;
        });
        if (someSet) {
            return;
        }
        makeRequest();
    }, []);

    useEffect(() => {
        setDataTableContextState(prevState => {
            let newState = {
                ...prevState,
                ...modalService.getState()
            };
            return newState;
        });
    }, []);

    useEffect(() => {
        if (dataTableContextState?.requestStatus !== 'idle') {
            return;
        }
        makeRequest();
    }, [
        searchParamPage,
        searchParamSortOrder,
        searchParamSortBy,
        searchParamQuery,
        searchParamPageSize
    ]);
    useEffect(() => {
        if (!dataTableContextState?.query) {
            return;
        }
        if (!isObject(dataTableContextState.query)) {
            return;
        }
        if (isObjectEmpty(dataTableContextState.query)) {
            return;
        }
        makeRequest();
    }, [dataTableContextState.query]);
    
    return (
        <DataTableContext.Provider value={dataTableContextState}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card card-block card-stretch card-height">
                        <div className="card-header">
                            <div className="d-flex justify-content-between">
                                <div className="iq-header-title">
                                    <h4 className="card-title mb-0">Pages</h4>
                                </div>
                                <a href="#"
                                    className="btn btn-primary"
                                    onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                        if (typeof renderAddNew === 'function') {
                                            renderAddNew(e, {
                                                dataTableContextState,
                                                setDataTableContextState
                                            });
                                        }
                                    }}
                                >
                                    Add New
                                </a>
                            </div>
                            <div className="d-flex flex-wrap align-items-end mt-3">
                                <div>
                                    <div>
                                        <label className="mb-0">
                                            Show
                                            <select
                                                name="DataTables_Table_0_length"
                                                aria-controls="DataTables_Table_0"
                                            >
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                            entries
                                        </label>
                                    </div>
                                </div>
                                <div className="iq-search-bar search-device ml-auto mb-0 ">
                                    <form action="#" className="searchbox">
                                        <input type="text" className="text search-input" placeholder="Search..." />
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {Array.isArray(dataTableContextState?.data) && dataTableContextState.data.length && (
                                <DataTable
                                    columns={columns}
                                    data={dataTableContextState.data}
                                    actions={(item, index) => {
                                        if (typeof renderActions === 'function') {
                                            return renderActions(item, index, dataTableContextState);
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <div className="card-footer">
                            <Pagination
                                data={dataTableContextState?.meta}
                                showIndicator={true}
                                onPageClick={(e, page) => {
                                    // e.preventDefault();
                                    console.log('Page Clicked', page);

                                    // setDataTableContextState(prevState => {
                                    //     let newState = { ...prevState };
                                    //     newState.query = {
                                    //         ...prevState.query,
                                    //         page: page
                                    //     };
                                    //     return newState;
                                    // });
                                    // listingsService.contextService.updateContext({
                                    //     query: {
                                    //         ...listingsService.contextService.context.query,
                                    //         [ListingsFetch.PAGINATION.PAGE]: pageNumber
                                    //     }
                                    // });
                                }} />
                        </div>
                    </div>
                </div>
            </div>
            {modalService.render()}
        </DataTableContext.Provider>
    );
}
export default DataManager;