import DataTable, { OnRowSelectActionClick } from "@/components/Table/DataTable";
import { useEffect, useState } from "react";
import { ModalService } from "@/library/services/modal/ModalService";
import Pagination from "@/components/listings/Pagination";
import { useSearchParams } from "next/navigation";
import { isObject, isObjectEmpty } from "@/helpers/utils";
import { DataTableContext, dataTableContextData } from "@/contexts/DataTableContext";
import { ConfirmationService } from "@/library/services/confirmation/ConfirmationService";

export interface DMOnRowSelectActionClick extends OnRowSelectActionClick {
    data: Array<any>;
    dataTableContextState: any;
    setDataTableContextState: (data: any) => void;
}

export type DataManagerProps = {
    title?: string;
    rowSelectActions?: Array<any>
    multiRowSelection?: boolean;
    renderActionColumn?: null | ((item: any, index: number, dataTableContextState: any) => React.ReactNode | React.Component | null);
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
    title,
    rowSelectActions = [],
    multiRowSelection = false,
    renderActionColumn,
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
    const confirmationService = new ConfirmationService(dataTableContextState, setDataTableContextState);
    modalService.setKey('modal');
    confirmationService.setKey('confirmation');

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

    function handleRowSelectActionClick({action, data}: OnRowSelectActionClick) {
        if (!isObject(action)) {
             return;
         }
         if (typeof action?.onClick === 'function') {
             action.onClick({
                 action,
                 data,
                 dataTableContextState,
             });
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
                ...modalService.getState(),
                ...confirmationService.getState(),
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
                                    {title && (
                                        <h4 className="card-title mb-0">{title}</h4>
                                    )}
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
                        </div>
                        <div className="card-body">
                            {Array.isArray(dataTableContextState?.data) && dataTableContextState.data.length && (
                                <>
                                    <DataTable
                                        onRowSelectActionClick={handleRowSelectActionClick}
                                        rowSelectActions={rowSelectActions}
                                        multiRowSelection={multiRowSelection}
                                        columns={columns}
                                        data={dataTableContextState.data}
                                        actionColumn={(item, index) => {
                                            if (typeof renderActionColumn === 'function') {
                                                return renderActionColumn(item, index, dataTableContextState);
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {modalService.render()}
            {confirmationService.render()}
        </DataTableContext.Provider>
    );
}
export default DataManager;