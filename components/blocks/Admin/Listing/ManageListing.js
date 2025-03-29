function ManageListing() {
    return (
        <>
            <div className="content-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="navbar-breadcrumb">
                                    <h1 className="mb-1">My Calender</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-10 col-md-8">
                            <ul className="d-flex nav nav-pills mb-4 text-center event-tab" id="event-pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a id="view-btn" className="nav-link active show" data-toggle="pill" href="#event1" data-extra="#search-with-button" role="tab" aria-selected="true">Event Type</a>
                                </li>
                                <li className="nav-item">
                                    <a id="view-schedule" className="nav-link" data-toggle="pill" href="#event2" data-extra="#view-event" role="tab" aria-selected="false">Schedule Event</a>
                                </li>
                                <li className="nav-item">
                                    <a id="view-workflow" className="nav-link" data-toggle="pill" href="#event3" data-extra="#view-data" role="tab" aria-selected="false">Workflow</a>
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
                                Add Event<span className="event-add-btn" style={{ height: 40 }}><i className="ri-add-line"></i></span></a></div>
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
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body rounded event-detail event-detail-danger disabled">
                                                <div className="d-flex align-items-top justify-content-between">
                                                    <div>
                                                        <h4 className="mb-2 mr-4">Reminder of App Project And Design</h4>
                                                        <p className="mb-2 text-danger font-weight-500 text-uppercase"><i className="las la-user pr-2"></i>One On One</p>
                                                        <p className="mb-4 card-description">Calendify always allows you to set the reminder to optimize task management roles and jobs.</p>
                                                        <div className="d-flex align-items-center pt-4">
                                                            <a href="#" className="btn btn-danger mr-3 px-xl-4">50 Min</a>
                                                            <a href="#" className="btn btn-outline-danger copy d-none px-xl-4" data-extra-toggle="copy" title="Copy to clipboard" data-toggle="tooltip"><i className="las la-link pr-2"></i>Copy Link</a>
                                                            <a href="#" className="btn btn-outline-danger turn-on px-xl-4">Turn On</a>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar mt-1">
                                                        <div className="dropdown d-none">
                                                            <span className="dropdown-toggle" id="dropdownMenuButton1" data-toggle="dropdown">
                                                                <i className="ri-more-2-fill"></i>
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <a className="dropdown-item" href="#"><i className="ri-pencil-line mr-3"></i>Edit</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-sticky-note-line mr-3"></i>Add Internal Note</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-save-line mr-3"></i>Save to Template</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-code-s-slash-line mr-3"></i>Save to Website</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-delete-bin-6-line mr-3"></i>Delete</a>
                                                                <div className="dropdown-item border-top mt-2">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div>On/Off</div>
                                                                        <div className="custom-control custom-switch p-0">
                                                                            <input type="checkbox" className="custom-control-input card-change" id="customSwitch2" checked />
                                                                            <label className="custom-control-label" htmlFor="customSwitch2"></label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body rounded event-detail event-detail-info">
                                                <div className="d-flex align-items-top justify-content-between">
                                                    <div>
                                                        <h4 className="mb-2 mr-4">Email Signature for Support Team</h4>
                                                        <p className="mb-2 text-info font-weight-500 text-uppercase"><i className="las la-user pr-2"></i>One On One</p>
                                                        <p className="mb-4 card-description">Outsmart back-and-forth in communication by staying alert with your support team follow-ups.</p>
                                                        <div className="d-flex align-items-center pt-4">
                                                            <a href="#" className="btn btn-info mr-3 px-xl-4">30 Min</a>
                                                            <a href="#" className="btn btn-outline-info copy px-xl-4" data-extra-toggle="copy" title="Copy to clipboard" data-toggle="tooltip"><i className="las la-link pr-2"></i>Copy Link</a>
                                                            <a href="#" className="btn btn-outline-info d-none turn-on px-xl-4">Turn On</a>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar mt-1">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle" id="dropdownMenuButton02" data-toggle="dropdown">
                                                                <i className="ri-more-2-fill"></i>
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton02">
                                                                <a className="dropdown-item" href="#"><i className="ri-pencil-line mr-3"></i>Edit</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-sticky-note-line mr-3"></i>Add Internal Note</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-save-line mr-3"></i>Save to Template</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-code-s-slash-line mr-3"></i>Save to Website</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-delete-bin-6-line mr-3"></i>Delete</a>
                                                                <div className="dropdown-item border-top mt-2">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div>On/Off</div>
                                                                        <div className="custom-control custom-switch p-0">
                                                                            <input type="checkbox" className="custom-control-input card-change" id="customSwitch5" />
                                                                            <label className="custom-control-label" htmlFor="customSwitch5"></label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body rounded event-detail event-detail-success">
                                                <div className="d-flex align-items-top justify-content-between">
                                                    <div>
                                                        <h4 className="mb-2 mr-4">Plugins & Team Review Meeting</h4>
                                                        <p className="mb-2 text-success font-weight-500 text-uppercase"><i className="las la-user-friends pr-2"></i>Group</p>
                                                        <p className="mb-4 card-description">Calendify lets you to simplify and prioritize your calendar and your team’s calendar with review. </p>
                                                        <div className="d-flex align-items-center pt-4">
                                                            <a href="#" className="btn btn-success mr-3 px-xl-4">35 Min</a>
                                                            <a href="#" className="btn btn-outline-success copy px-xl-4" data-extra-toggle="copy" title="Copy to clipboard" data-toggle="tooltip"><i className="las la-link pr-2"></i>Copy Link</a>
                                                            <a href="#" className="btn btn-outline-success d-none turn-on px-xl-4">Turn On</a>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar mt-1">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle" id="dropdownMenuButton03" data-toggle="dropdown">
                                                                <i className="ri-more-2-fill"></i>
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton03">
                                                                <a className="dropdown-item" href="#"><i className="ri-pencil-line mr-3"></i>Edit</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-sticky-note-line mr-3"></i>Add Internal Note</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-save-line mr-3"></i>Save to Template</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-code-s-slash-line mr-3"></i>Save to Website</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-delete-bin-6-line mr-3"></i>Delete</a>
                                                                <div className="dropdown-item border-top mt-2">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div>On/Off</div>
                                                                        <div className="custom-control custom-switch p-0">
                                                                            <input type="checkbox" className="custom-control-input card-change" id="customSwitch1" />
                                                                            <label className="custom-control-label" htmlFor="customSwitch1"></label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body rounded event-detail event-detail-primary">
                                                <div className="d-flex align-items-top justify-content-between">
                                                    <div>
                                                        <h4 className="mb-2 mr-4">New Year Iqonic Design Campaigns</h4>
                                                        <p className="mb-2 text-primary font-weight-500 text-uppercase"><i className="las la-user-friends pr-2"></i>Group</p>
                                                        <p className="mb-4 card-description">Quickly schedule and set the event type to manage all your marketing and management campaigns. </p>
                                                        <div className="d-flex align-items-center pt-4">
                                                            <a href="#" className="btn btn-primary mr-3 px-xl-4">15 Min</a>
                                                            <a href="#" className="btn btn-outline-primary copy px-xl-4" data-extra-toggle="copy" title="Copy to clipboard" data-toggle="tooltip"><i className="las la-link pr-2"></i>Copy Link</a>
                                                            <a href="#" className="btn btn-outline-primary d-none turn-on px-xl-4">Turn On</a>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar mt-1">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle" id="dropdownMenuButton4" data-toggle="dropdown">
                                                                <i className="ri-more-2-fill"></i>
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton4">
                                                                <a className="dropdown-item" href="#"><i className="ri-pencil-line mr-3"></i>Edit</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-sticky-note-line mr-3"></i>Add Internal Note</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-save-line mr-3"></i>Save to Template</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-code-s-slash-line mr-3"></i>Save to Website</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-delete-bin-6-line mr-3"></i>Delete</a>
                                                                <div className="dropdown-item border-top mt-2">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div>On/Off</div>
                                                                        <div className="custom-control custom-switch p-0">
                                                                            <input type="checkbox" className="custom-control-input card-change" id="customSwitch4" />
                                                                            <label className="custom-control-label" htmlFor="customSwitch4"></label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body rounded event-detail event-detail-warning">
                                                <div className="d-flex align-items-top justify-content-between">
                                                    <div>
                                                        <h4 className="mb-2 mr-4">Project And Task Management Roles</h4>
                                                        <p className="mb-2 text-warning font-weight-500 text-uppercase"><i className="las la-user-friends pr-2"></i>Group</p>
                                                        <p className="mb-4 card-description">Set reminders for your team regarding their project and task completion so that they are not overlooked. </p>
                                                        <div className="d-flex align-items-center pt-4">
                                                            <a href="#" className="btn btn-warning mr-3 px-xl-4">25 Min</a>
                                                            <a href="#" className="btn btn-outline-warning copy px-xl-4" data-extra-toggle="copy" title="Copy to clipboard" data-toggle="tooltip"><i className="las la-link pr-2"></i>Copy Link</a>
                                                            <a href="#" className="btn btn-outline-warning d-none turn-on px-xl-4">Turn On</a>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar mt-1">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle" id="dropdownMenuButton5" data-toggle="dropdown">
                                                                <i className="ri-more-2-fill"></i>
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton5">
                                                                <a className="dropdown-item" href="#"><i className="ri-pencil-line mr-3"></i>Edit</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-sticky-note-line mr-3"></i>Add Internal Note</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-save-line mr-3"></i>Save to Template</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-code-s-slash-line mr-3"></i>Save to Website</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-delete-bin-6-line mr-3"></i>Delete</a>
                                                                <div className="dropdown-item border-top mt-2">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div>On/Off</div>
                                                                        <div className="custom-control custom-switch p-0">
                                                                            <input type="checkbox" className="custom-control-input card-change" id="customSwitch3" />
                                                                            <label className="custom-control-label" htmlFor="customSwitch3"></label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
export default ManageListing;