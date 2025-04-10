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

export const EDIT_PAGE_MODAL_ID = 'edit-page-modal';

function ManagePage() {
    const [modal, setModal] = useState({
        data: null,
        component: null,
        operation: null,
        show: false,
        title: '',
        footer: true,
    });

    const appModalContext = useContext(AppModalContext);

    function renderActions(item, index) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
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
                                    setModal({
                                        title: 'Edit Page',
                                        component: 'edit-page',
                                        data: item,
                                        operation: 'edit',
                                        show: true,
                                        showFooter: false
                                    });
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
    async function pageRequest() {
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
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

    const [dataTableContextState, setDataTableContextState] = useState({
        ...dataTableContextData,
        refresh: () => {
            console.log('refresh');
            pageRequest();
        }
    });

    useEffect(() => {
        pageRequest();
    }, []);
    return (
        <DataTableContext.Provider value={dataTableContextState}>
            <div className="content-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="navbar-breadcrumb">
                                    <h1 className="mb-1">Pages</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-10 col-md-8">
                            <ul className="d-flex nav nav-pills mb-4 text-center event-tab" id="event-pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a id="view-btn" className="nav-link active show" data-toggle="pill" href="#event1" data-extra="#search-with-button" role="tab" aria-selected="true">Manage</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-4 tab-extra" id="view-event">
                            <div className="float-md-right mb-4"><a href="#event1" className="btn view-btn">View Event</a></div>
                        </div>
                    </div>
                    <div className="tab-extra active" id="search-with-button">
                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <div className="iq-search-bar search-device mb-0 pr-3">
                                <form action="#" className="searchbox">
                                    <input type="text" className="text search-input" placeholder="Search..." />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="event-content">
                            <div id="event1" className="tab-pane fade active show">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-header d-flex justify-content-between">
                                                <div className="iq-header-title">
                                                    <h4 className="card-title mb-0">Pages</h4>
                                                </div>
                                                <a href="#"
                                                    className="btn btn-primary"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setModal({
                                                            title: 'Add New Page',
                                                            component: 'add-page',
                                                            operation: 'add',
                                                            show: true,
                                                            showFooter: false
                                                        });
                                                    }}
                                                >
                                                    Add New
                                                </a>
                                            </div>
                                            <div className="card-body">
                                                {Array.isArray(dataTableContextState?.data) && dataTableContextState.data.length && (
                                                    <DataTable
                                                        columns={[
                                                            { label: 'ID', key: 'id' },
                                                            { label: 'Title', key: 'title' },
                                                            { label: 'Permalink', key: 'permalink' }
                                                        ]}
                                                        data={dataTableContextState.data}
                                                        actions={(item, index) => {
                                                            return renderActions(item, index);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={modal.show} onHide={() => ModalService.hideModal(setModal)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal?.title || ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modal?.component === 'edit-page' && (
                        <EditPage
                            data={modal?.data}
                            operation={modal?.operation}
                        />
                    )}
                    {modal?.component === 'add-page' && (
                        <EditPage
                            operation={'add'}
                        />
                    )}
                </Modal.Body>
                {modal.footer &&
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => ModalService.hideModal(setModal)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => ModalService.hideModal(setModal)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        </DataTableContext.Provider>
    );
}
export default ManagePage;