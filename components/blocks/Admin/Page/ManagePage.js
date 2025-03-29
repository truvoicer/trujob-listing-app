import DataTable from "@/components/Table/DataTable";

function ManagePage() {
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
                            <div className="float-sm-right"><a href="page-new-event.html" className="btn btn-primary pr-5 position-relative" style={{ height: 40 }}>
                                Add Page<span className="event-add-btn" style={{ height: 40 }}><i className="ri-add-line"></i></span></a></div>
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
                                                <a href="#" className="btn btn-primary" data-toggle="modal" data-target="#addContact">Add New</a>
                                            </div>
                                            <div className="card-body">
                                                <DataTable
                                                    columns={[{label: 'ID', key: 'id'}, {label: 'Title', key: 'title'}, {label: 'Status', key: 'status'}]}
                                                    data={[
                                                        { id: 1, title: 'Home', status: 'Active' },
                                                        { id: 2, title: 'About Us', status: 'Inactive' },
                                                        { id: 3, title: 'Contact Us', status: 'Active' },
                                                        { id: 4, title: 'Services', status: 'Inactive' },
                                                        { id: 5, title: 'Blog', status: 'Active' },
                                                    ]}
                                                />
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