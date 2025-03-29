import MenuList from "./Menu/MenuList";

function AdminNavBar() {
    return (
        <div className="iq-top-navbar">
            <div className="container">
                <div className="iq-navbar-custom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
                            <i className="ri-menu-line wrapper-menu"></i>
                            <a href="index.html" className="header-logo" >
                                <img src="/images/logo.png" className="img-fluid rounded-normal light-logo" alt="logo" />
                                <img src="/images/logo-white.png" className="img-fluid rounded-normal darkmode-logo" alt="logo" />
                            </a>
                        </div>
                        <div className="iq-menu-horizontal">
                            <nav className="iq-sidebar-menu">
                                <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
                                    <a href="index.html" className="header-logo">
                                        <img src="/images/logo.png" className="img-fluid rounded-normal" alt="logo" />
                                    </a>
                                    <div className="iq-menu-bt-sidebar">
                                        <i className="las la-bars wrapper-menu"></i>
                                    </div>
                                </div>
                                <MenuList name="admin-header-menu" className="iq-menu d-flex"/>
                            </nav>
                        </div>
                        <nav className="navbar navbar-expand-lg navbar-light p-0">
                            <div className="change-mode">
                                <div className="custom-control custom-switch custom-switch-icon custom-control-indivne">
                                    <div className="custom-switch-inner">
                                        <p className="mb-0"> </p>
                                        <input type="checkbox" className="custom-control-input" id="dark-mode" data-active="true" />
                                        <label className="custom-control-label" htmlFor="dark-mode" data-mode="toggle">
                                            <span className="switch-icon-left"><i className="a-left ri-moon-clear-line"></i></span>
                                            <span className="switch-icon-right"><i className="a-right ri-sun-line"></i></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-label="Toggle navigation">
                                <i className="ri-menu-3-line"></i>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ml-auto navbar-list align-items-center">
                                    <li className="nav-item nav-icon dropdown ml-3">
                                        <a href="#" className="search-toggle dropdown-toggle" id="dropdownMenuButton2" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">
                                            <i className="las la-envelope"></i>
                                            <span className="badge badge-primary count-mail rounded-circle">2</span>
                                            <span className="bg-primary"></span>
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                            <div className="card shadow-none m-0">
                                                <div className="card-body p-0 ">
                                                    <div className="cust-title p-3">
                                                        <h5 className="mb-0">All Messages</h5>
                                                    </div>
                                                    <div className="p-2">
                                                        <a href="#" className="iq-sub-card">
                                                            <div className="media align-items-center cust-card p-2">
                                                                <div className="">
                                                                    <img className="avatar-40 rounded-small" src="../assets/images/user/u-1.jpg" alt="01" />
                                                                </div>
                                                                <div className="media-body ml-3">
                                                                    <h6 className="mb-0">Barry Emma Watson</h6>
                                                                    <small className="mb-0">We Want to see you On..</small>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="#" className="iq-sub-card">
                                                            <div className="media align-items-center cust-card p-2">
                                                                <div className="">
                                                                    <img className="avatar-40 rounded-small" src="../assets/images/user/u-2.jpg" alt="02" />
                                                                </div>
                                                                <div className="media-body ml-3">
                                                                    <h6 className="mb-0">Lorem Ipsum Watson</h6>
                                                                    <small className="mb-0">Can we have a Call?</small>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="#" className="iq-sub-card">
                                                            <div className="media align-items-center cust-card p-2">
                                                                <div className="">
                                                                    <img className="avatar-40 rounded-small" src="../assets/images/user/u-3.jpg" alt="03" />
                                                                </div>
                                                                <div className="media-body ml-3">
                                                                    <h6 className="mb-0">Why do we use it?</h6>
                                                                    <small className="mb-0">Thank You but now we Don't...</small>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <a className="right-ic btn-block position-relative p-3 border-top text-center" href="#" role="button">
                                                        View All
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item nav-icon dropdown">
                                        <a href="#" className="search-toggle dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">
                                            <i className="las la-bell"></i>
                                            <span className="badge badge-primary count-mail rounded-circle">2</span>
                                            <span className="bg-primary"></span>
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <div className="card shadow-none m-0">
                                                <div className="card-body p-0 ">
                                                    <div className="cust-title p-3">
                                                        <h5 className="mb-0">Notifications</h5>
                                                    </div>
                                                    <div className="p-2">
                                                        <a href="#" className="iq-sub-card">
                                                            <div className="media align-items-center cust-card p-2">
                                                                <div className="">
                                                                    <img className="avatar-40 rounded-small" src="../assets/images/user/u-1.jpg" alt="01" />
                                                                </div>
                                                                <div className="media-body ml-3">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <h6 className="mb-0">Anne Effit</h6>
                                                                        <small className="mb-0">02 Min Ago</small>
                                                                    </div>
                                                                    <small className="mb-0">Manager</small>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="#" className="iq-sub-card">
                                                            <div className="media align-items-center cust-card p-2">
                                                                <div className="">
                                                                    <img className="avatar-40 rounded-small" src="../assets/images/user/u-2.jpg" alt="02" />
                                                                </div>
                                                                <div className="media-body ml-3">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <h6 className="mb-0">Eric Shun</h6>
                                                                        <small className="mb-0">05 Min Ago</small>
                                                                    </div>
                                                                    <small className="mb-0">Manager</small>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="#" className="iq-sub-card">
                                                            <div className="media align-items-center cust-card p-2">
                                                                <div className="">
                                                                    <img className="avatar-40 rounded-small" src="../assets/images/user/u-3.jpg" alt="03" />
                                                                </div>
                                                                <div className="media-body ml-3">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <h6 className="mb-0">Ken Tucky</h6>
                                                                        <small className="mb-0">10 Min Ago</small>
                                                                    </div>
                                                                    <small className="mb-0">Employee</small>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <a className="right-ic btn-block position-relative p-3 border-top text-center" href="#" role="button">
                                                        See All Notification
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="caption-content">
                                        <a href="#" className="search-toggle dropdown-toggle d-flex align-items-center" id="dropdownMenuButton3" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">
                                            <img src="/images/user/01.jpg" className="avatar-40 img-fluid rounded" alt="user" />
                                            <div className="caption ml-3">
                                                <h6 className="mb-0 line-height">Rick O'shea<i className="las la-angle-down ml-3"></i></h6>
                                            </div>
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu user-dropdown" aria-labelledby="dropdownMenuButton3">
                                            <div className="card m-0">
                                                <div className="card-body p-0">
                                                    <div className="py-3">
                                                        <a href="../app/user-profile.html" className="iq-sub-card">
                                                            <div className="media align-items-center">
                                                                <i className="ri-user-line mr-3"></i>
                                                                <h6>Account Settings</h6>
                                                            </div>
                                                        </a>
                                                        <a href="../backend/page-calendar-connections.html" className="iq-sub-card">
                                                            <div className="media align-items-center">
                                                                <i className="ri-calendar-line mr-3"></i>
                                                                <h6>Calender Connections</h6>
                                                            </div>
                                                        </a>
                                                        <a href="../backend/page-users.html" className="iq-sub-card">
                                                            <div className="media align-items-center">
                                                                <i className="ri-group-line mr-3"></i>
                                                                <h6>Users</h6>
                                                            </div>
                                                        </a>
                                                        <a href="../backend/privacy-policy.html" className="iq-sub-card">
                                                            <div className="media align-items-center">
                                                                <i className="ri-lock-line mr-3"></i>
                                                                <h6>Privacy & Security Settings</h6>
                                                            </div>
                                                        </a>
                                                        <a href="#popup1" data-toggle="modal" data-target="#exampleModalCenter" className="iq-sub-card">
                                                            <div className="media align-items-center">
                                                                <i className="ri-links-line mr-3"></i>
                                                                <h6>Share Your Link</h6>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <a className="right-ic p-3 border-top btn-block position-relative text-center" href="auth-sign-in.html" role="button">
                                                        Logout
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminNavBar;