import React from "react";
import MenuList from "./Menu/MenuList";
import { connect } from "react-redux";
import {
  APP_MODE,
  APP_SIDEBAR_OPEN,
  APP_STATE,
} from "@/library/redux/constants/app-constants";
import {
  setAppModeAction,
  setAppSidebarOpenAction,
} from "@/library/redux/actions/app-actions";
import { Container, Dropdown, Navbar } from "react-bootstrap";
import DropDownMenuList from "./Menu/DropDownMenuList";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionService } from "@/library/services/session/SessionService";
import Branding from "./Branding/Branding";
import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import { getSiteCurrencyAction, refreshSiteAction } from "@/library/redux/actions/site-actions";
import { SiteState } from "@/library/redux/reducers/site-reducer";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { refreshSessionUserAction } from "@/library/redux/actions/session-actions";
import { RootState } from "@/library/redux/store";

export type AdminNavBarProps = {
  app: SiteState;
  session: SessionState;
};
function AdminNavBar({ app, session }: AdminNavBarProps) {
  function addClass(classes: Array<string>, className: string) {
    if (classes.indexOf(className) === -1) {
      classes.push(className);
    }
    return classes;
  }

  function toggleIconClass(dir: "left" | "right") {
    let classes: Array<string> = [];
    switch (dir) {
      case "left":
        classes = ["a-left", "ri-moon-clear-line"];
        if (app[APP_MODE] === "dark") {
          addClass(classes, "ri-moon-clear-line");
        } else if (app[APP_MODE] === "light") {
          //remove ri-moon-clear-line class
          const findIndex = classes.indexOf("ri-moon-clear-line");
          if (findIndex > -1) {
            classes.splice(findIndex, 1);
          }
        }
        break;
      case "right":
        classes = ["a-right", "ri-sun-line"];
        if (app[APP_MODE] === "dark") {
          const findIndex = classes.indexOf("ri-sun-line");
          if (findIndex > -1) {
            classes.splice(findIndex, 1);
          }
        } else if (app[APP_MODE] === "light") {
          addClass(classes, "ri-sun-line");
        }
        break;
    }
    return classes.join(" ");
  }

  async function handleCurrencyChange(value: Record<string, unknown> | null) {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.user,
       'setting',
        "update",
      ]),
      method: TruJobApiMiddleware.METHOD.PATCH,
      protectedReq: true,
      data: {
        currency_id: value?.value,
      },
    });
    if (!response) {
      console.error("Failed to set currency");
      return;
    }
    console.log("Currency set successfully:", response);
    TruJobApiMiddleware.getInstance().refreshSessionUser();
  }

  const currency = LocaleService.getCurrency();
  console.log("Currency in AdminNavBar:", session);
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
              <Branding />
            </div>
            <div className="iq-menu-horizontal">
              <nav className="iq-sidebar-menu">
                <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
                  <Branding />
                  <div className="iq-menu-bt-sidebar">
                    <i
                      className={`ri-menu-line wrapper-menu ${
                        app[APP_SIDEBAR_OPEN] ? "" : "d-none"
                      }`}
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
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="dark-mode"
                      data-active={app[APP_MODE] === "dark" ? "false" : "true"}
                      checked={app[APP_MODE] === "dark" ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAppModeAction("dark");
                        } else {
                          setAppModeAction("light");
                        }
                      }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="dark-mode"
                      data-mode="toggle"
                    >
                      <span className="switch-icon-left">
                        <i className={toggleIconClass("left")}></i>
                      </span>
                      <span className="switch-icon-right">
                        <i className={toggleIconClass("right")}></i>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                  <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <i className="ri-menu-3-line"></i>
                  </Navbar.Toggle>
                  <Navbar.Collapse id="basic-navbar-nav">
                    <ul className="navbar-nav ml-auto navbar-list align-items-center">
                      <li className="nav-item nav-icon dropdown ml-3">
                        <CurrencySelect
                          displayText={(data: Record<string, unknown>) => {
                            return `${data?.country?.name} | ${data?.code}`;
                          }}
                          value={
                            currency
                              ? {
                                  value: currency?.id,
                                  label: currency?.name,
                                }
                              : null
                          }
                          isMulti={false}
                          showLoadingSpinner={true}
                          onChange={handleCurrencyChange}
                          loadingMore={true}
                          loadMoreLimit={10}
                        />
                      </li>
                      <li className="nav-item nav-icon dropdown ml-3">
                        <Dropdown>
                          <Dropdown.Toggle className="search-toggle" as="a">
                            <i className="las la-envelope"></i>
                            <span className="badge badge-primary count-mail rounded-circle">
                              2
                            </span>
                            <span className="bg-primary"></span>
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="iq-sub-dropdown dropdown-menu">
                            <div className="card shadow-none m-0">
                              <div className="card-body p-0 ">
                                <div className="cust-title p-3">
                                  <h5 className="mb-0">All Messages</h5>
                                </div>
                                <div className="p-2">
                                  <a href="#" className="iq-sub-card">
                                    <div className="media align-items-center cust-card p-2">
                                      <div className="">
                                        <img
                                          className="avatar-40 rounded-small"
                                          src="../assets/images/user/u-1.jpg"
                                          alt="01"
                                        />
                                      </div>
                                      <div className="media-body ml-3">
                                        <h6 className="mb-0">
                                          Barry Emma Watson
                                        </h6>
                                        <small className="mb-0">
                                          We Want to see you On..
                                        </small>
                                      </div>
                                    </div>
                                  </a>
                                  <a href="#" className="iq-sub-card">
                                    <div className="media align-items-center cust-card p-2">
                                      <div className="">
                                        <img
                                          className="avatar-40 rounded-small"
                                          src="/images/user/u-2.jpg"
                                          alt="02"
                                        />
                                      </div>
                                      <div className="media-body ml-3">
                                        <h6 className="mb-0">
                                          Lorem Ipsum Watson
                                        </h6>
                                        <small className="mb-0">
                                          Can we have a Call?
                                        </small>
                                      </div>
                                    </div>
                                  </a>
                                  <a href="#" className="iq-sub-card">
                                    <div className="media align-items-center cust-card p-2">
                                      <div className="">
                                        <img
                                          className="avatar-40 rounded-small"
                                          src="/images/user/u-3.jpg"
                                          alt="03"
                                        />
                                      </div>
                                      <div className="media-body ml-3">
                                        <h6 className="mb-0">
                                          Why do we use it?
                                        </h6>
                                        <small className="mb-0">
                                          Thank You but now we Don't...
                                        </small>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <a
                                  className="right-ic btn-block position-relative p-3 border-top text-center"
                                  href="#"
                                  role="button"
                                >
                                  View All
                                </a>
                              </div>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </li>
                      <li className="nav-item nav-icon dropdown">
                        <Dropdown>
                          <Dropdown.Toggle className="search-toggle" as="a">
                            <i className="las la-bell"></i>
                            <span className="badge badge-primary count-mail rounded-circle">
                              2
                            </span>
                            <span className="bg-primary"></span>
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="iq-sub-dropdown dropdown-menu">
                            <div className="card shadow-none m-0">
                              <div className="card-body p-0 ">
                                <div className="cust-title p-3">
                                  <h5 className="mb-0">Notifications</h5>
                                </div>
                                <div className="p-2">
                                  <a href="#" className="iq-sub-card">
                                    <div className="media align-items-center cust-card p-2">
                                      <div className="">
                                        <img
                                          className="avatar-40 rounded-small"
                                          src="../assets/images/user/u-1.jpg"
                                          alt="01"
                                        />
                                      </div>
                                      <div className="media-body ml-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                          <h6 className="mb-0">Anne Effit</h6>
                                          <small className="mb-0">
                                            02 Min Ago
                                          </small>
                                        </div>
                                        <small className="mb-0">Manager</small>
                                      </div>
                                    </div>
                                  </a>
                                  <a href="#" className="iq-sub-card">
                                    <div className="media align-items-center cust-card p-2">
                                      <div className="">
                                        <img
                                          className="avatar-40 rounded-small"
                                          src="/images/user/u-2.jpg"
                                          alt="02"
                                        />
                                      </div>
                                      <div className="media-body ml-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                          <h6 className="mb-0">Eric Shun</h6>
                                          <small className="mb-0">
                                            05 Min Ago
                                          </small>
                                        </div>
                                        <small className="mb-0">Manager</small>
                                      </div>
                                    </div>
                                  </a>
                                  <a href="#" className="iq-sub-card">
                                    <div className="media align-items-center cust-card p-2">
                                      <div className="">
                                        <img
                                          className="avatar-40 rounded-small"
                                          src="../assets/images/user/u-3.jpg"
                                          alt="03"
                                        />
                                      </div>
                                      <div className="media-body ml-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                          <h6 className="mb-0">Ken Tucky</h6>
                                          <small className="mb-0">
                                            10 Min Ago
                                          </small>
                                        </div>
                                        <small className="mb-0">Employee</small>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <a
                                  className="right-ic btn-block position-relative p-3 border-top text-center"
                                  href="#"
                                  role="button"
                                >
                                  See All Notification
                                </a>
                              </div>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </li>
                      <li className="caption-content">
                        <DropDownMenuList
                          name={"admin-header-user-dropdown-menu"}
                        >
                          <img
                            src="/images/user/01.jpg"
                            className="avatar-40 img-fluid rounded"
                            alt="user"
                          />
                          <div className="caption ml-3">
                            <h6 className="mb-0 line-height">
                              {SessionService.getUserName()}
                              <i className="las la-angle-down ml-3"></i>
                            </h6>
                          </div>
                        </DropDownMenuList>
                      </li>
                    </ul>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
export default connect(
  (state: RootState) => ({
    app: state[APP_STATE],
    session: state[SESSION_STATE],
  }),
  null
)(AdminNavBar);
