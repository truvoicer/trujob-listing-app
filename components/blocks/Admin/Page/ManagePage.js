import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import EditPage from "./EditPage";
import BadgeDropDown from "@/components/BadgeDropDown";

function ManagePage() {
    const [data, setData] = useState(null);
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
                                    appModalContext.show({
                                        component: (
                                            <EditPage data={item} operation={'edit'} />
                                        ),
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
                                            const response = await TruJobApiMiddleware.getInstance().pageDeleteRequest(item?.id);
                                            if (!response) {
                                                return;
                                            }
                                        },
                                        show: true,
                                        showFooter: true
                                    });
                                }
                            }
                        }
                    ]}
                />
            </div>
        )
    }
    async function pageRequest() {
        const response = await TruJobApiMiddleware.getInstance().pageIndexRequest();
        if (!response) {
            return;
        }
        setData(response);
    }
    useEffect(() => {
        pageRequest();
    }, []);
    console.log(data);
    return (
        <>
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
                                                        appModalContext.show({
                                                            title: 'Add New Page',
                                                            component: (
                                                                <EditPage operation={'add'} />
                                                            ),
                                                            show: true,
                                                            showFooter: false
                                                        });
                                                    }}
                                                >
                                                    Add New
                                                </a>
                                            </div>
                                            <div className="card-body">
                                                {Array.isArray(data?.data) && data.data.length && (
                                                    <DataTable
                                                        columns={[
                                                            { label: 'ID', key: 'id' },
                                                            { label: 'Title', key: 'title' },
                                                            { label: 'Permalink', key: 'permalink' }
                                                        ]}
                                                        data={data.data}
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
        </>
    );
}
export default ManagePage;