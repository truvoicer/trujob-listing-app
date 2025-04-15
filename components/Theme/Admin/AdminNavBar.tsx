import React, { useEffect } from "react";
import MenuList from "./Menu/MenuList";
import { connect } from "react-redux";
import { APP_MODE, APP_SIDEBAR_OPEN, APP_STATE } from "@/library/redux/constants/app-constants";
import { setAppModeAction, setAppSidebarOpenAction } from "@/library/redux/actions/app-actions";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";
import DropDownMenuList from "./Menu/DropDownMenuList";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionService } from "@/library/services/session/SessionService";

function AdminNavBar({ app, session }) {
    
    function addClass(classes, className) {
        if (classes.indexOf(className) === -1) {
            classes.push(className);
        }
        return classes;
    }


    function toggleIconClass(dir) {
        let classes = [];
        switch (dir) {
            case 'left':
                classes = ['a-left', 'ri-moon-clear-line'];
                if (app[APP_MODE] === 'dark') {
                    addClass(classes, 'ri-moon-clear-line');
                } else if (app[APP_MODE] === 'light') {
                    //remove ri-moon-clear-line class
                    const findIndex = classes.indexOf('ri-moon-clear-line');
                    if (findIndex > -1) {
                        classes.splice(findIndex, 1);
                    }
                }
                break;
            case 'right':
                classes = ['a-right', 'ri-sun-line'];
                if (app[APP_MODE] === 'dark') {
                    const findIndex = classes.indexOf('ri-sun-line');
                    if (findIndex > -1) {
                        classes.splice(findIndex, 1);
                    }
                } else if (app[APP_MODE] === 'light') {
                    addClass(classes, 'ri-sun-line');
                }
                break;
        }
        return classes.join(' ');
    }
    return (
        <div className="iq-top-navbar">
            <div className="container">
                <div className="iq-navbar-custom">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
                            <i
                                className="ri-menu-line wrapper-menu"
                                onClick={() => {
                                    setAppSidebarOpenAction(!app[APP_SIDEBAR_OPEN]);
                                }}
                            ></i>
                            <a href="index.html" className="header-logo" >
                                <img src="/images/logo.png"
                                    className={`img-fluid rounded-normal light-logo ${app[APP_MODE] === 'dark' ? 'd-none' : ''}`}
                                    alt="logo" />
                                <img src="/images/logo-white.png"
                                    className={`img-fluid rounded-normal darkmode-logo ${app[APP_MODE] === 'light' ? 'd-none' : ''}`}
                                    alt="logo" />
                            </a>
                        </div>
                        <div className="iq-menu-horizontal">
                            <nav className="iq-sidebar-menu">
                                <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
                                    <a href="index.html" className="header-logo">
                                        <img src="/images/logo.png" className="img-fluid rounded-normal" alt="logo" />
                                    </a>
                                    <div className="iq-menu-bt-sidebar">
                                        <i
                                            className={`ri-menu-line wrapper-menu ${app[APP_SIDEBAR_OPEN] ? '' : 'd-none'}`}
                                            onClick={() => {
                                                setAppSidebarOpenAction(!app[APP_SIDEBAR_OPEN]);
                                            }}
                                        ></i>
                                    </div>
                                </div>
                                <MenuList name="admin-header-menu" className="iq-menu d-flex" />
                            </nav>
                        </div>
                        <nav className="navbar navbar-expand-lg navbar-light p-0">
                            <div className="change-mode">
                                <div className="custom-control custom-switch custom-switch-icon custom-control-indivne">
                                    <div className="custom-switch-inner">
                                        <p className="mb-0"> </p>
                                        <input type="checkbox"
                                            className="custom-control-input"
                                            id="dark-mode"
                                            data-active={app[APP_MODE] === 'dark' ? 'false' : 'true'}
                                            checked={app[APP_MODE] === 'dark' ? true : false}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAppModeAction('dark');
                                                } else {
                                                    setAppModeAction('light');
                                                }
                                            }} />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="dark-mode" data-mode="toggle">
                                            <span className="switch-icon-left">
                                                <i className={toggleIconClass('left')}></i>
                                            </span>
                                            <span className="switch-icon-right">
                                                <i className={toggleIconClass('right')}></i>
                                            </span>
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
                                        <DropDownMenuList name={"admin-header-user-dropdown-menu"}>
                                            <img src="/images/user/01.jpg"
                                                className="avatar-40 img-fluid rounded"
                                                alt="user" />
                                            <div className="caption ml-3">
                                                <h6 className="mb-0 line-height">
                                                    {SessionService.getUserName()}
                                                    <i className="las la-angle-down ml-3"></i>
                                                </h6>
                                            </div>
                                        </DropDownMenuList>

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
export default connect(
    state => ({
        app: state[APP_STATE],
        session: state[SESSION_STATE]
    }),
    null
)(AdminNavBar);