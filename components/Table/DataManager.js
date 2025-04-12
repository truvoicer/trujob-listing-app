import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { useContext, useEffect, useState } from "react";
import { DataTableContext, dataTableContextData } from "@/contexts/DataTableContext";
import { Button, Modal, Nav, Tab } from "react-bootstrap";
import { ModalService } from "@/library/services/modal/ModalService";
import Pagination from "@/components/listings/Pagination";
import { useSearchParams } from "next/navigation";
import { isObject, isObjectEmpty } from "@/helpers/utils";

export const EDIT_PAGE_MODAL_ID = 'edit-page-modal';

function DataManager({
    renderActions = null,
    renderAddNew = null,
    request = null,
    columns = [],
}) {

    const searchParams = useSearchParams();

    const searchParamPage = searchParams.get('page');
    const searchParamSortOrder = searchParams.get('sort_order');
    const searchParamSortBy = searchParams.get('sort_by');
    const searchParamQuery = searchParams.get('query');
    const searchParamPageSize = searchParams.get('page_size');


    const appModalContext = useContext(AppModalContext);
    const modalService = new ModalService();

    const [dataTableContextState, setDataTableContextState] = useState({
        ...dataTableContextData,
        refresh: () => {
            console.log('refresh');
            makeRequest();
        },
    });

    modalService.setModalKey('modal');
    modalService.setSetter(setDataTableContextState);
    modalService.setState(dataTableContextState);

    async function makeRequest() {
        if (typeof request === 'function') {
            request({
                dataTableContextState,
                setDataTableContextState
            });
            return;
        }
    }

    useEffect(() => {
        makeRequest();
    }, []);

    useEffect(() => {
        setDataTableContextState(prevState => {
            let newState = {
                ...prevState,
                ...modalService.getModalState()
            };
            return newState;
        });
    }, []);

    useEffect(() => {
        setDataTableContextState(prevState => {
            let newState = { ...prevState };
            if (!newState.searchParams) {
                newState.searchParams = {};
            }
            newState.searchParams['page'] = searchParamPage;
            newState.searchParams['sort_order'] = searchParamSortOrder;
            newState.searchParams['sort_by'] = searchParamSortBy;
            newState.searchParams['query'] = searchParamQuery;
            newState.searchParams['page_size'] = searchParamPageSize;
            return newState;
        });
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
                                    onClick={e => {
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
            {Array.isArray(dataTableContextState?.modal?.modals) && dataTableContextState.modal.modals.map((modal, index) => {
                if (!modal?.show) {
                    return null;
                }
                return (
                    <Modal
                        key={index}
                        show={modal.show}
                        size={modal?.size || 'md'}
                        fullscreen={modal?.fullscreen || false}
                        onHide={() => modalService.handleModalCancel(index)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{modal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {modal?.component || ''}
                        </Modal.Body>
                        {modal?.showFooter &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => modalService.handleModalCancel(index)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => modalService.handleModalOk(index)}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        }
                    </Modal>
                );
            })}
        </DataTableContext.Provider>
    );
}
export default DataManager;