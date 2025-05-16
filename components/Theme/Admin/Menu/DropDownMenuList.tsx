import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import siteConfig from "@/config/site-config";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";

const CustomDropdownItem = React.forwardRef(
    (atts, ref) => {
        const { children, style, className, 'aria-labelledby': labeledBy, href } = atts;
        return (
            <Link
                href={href}
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                {children}
            </Link>
        );
    },
);
const CustomDropdown = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        className = className.replace('dropdown', '')
        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                {children}
            </div>
        );
    },
);

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        return (
            <div
                ref={ref}
                style={style}
                className={className + " iq-sub-dropdown user-dropdown"}
                aria-labelledby={labeledBy}
            >
                <div className="card m-0">
                    <div className="card-body p-0">
                        <div className="py-3">
                            {children}
                        </div>

                        <a
                            className="right-ic p-3 border-top btn-block position-relative text-center"
                            href="/logout"
                            role="button">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        );
    },
);

function DropDownMenuList({ name, className = '', session, children }) {
    const [data, setData] = useState([]);

    async function menuItemsInit(name) {
        const menuFetch = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menu}/${name}`,
            method: ApiMiddleware.METHOD.GET,
        })
        if (!Array.isArray(menuFetch?.data?.menu_items)) {
            console.log(`Menu data is not an array | name: ${name}`);
            return;
        }
        setData(menuFetch.data);
    }

    function renderMenus(item, root = true) {
        return (
            <AccessControlComponent
                roles={item?.roles}
            >
                <li>
                    <Link href={item?.url || '#'} className="collapsed">
                        <span>{item?.label || ''}</span>
                    </Link>
                    <ul className="iq-submenu sub-scrll collapse">
                        {Array.isArray(item?.menus) && item.menus.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    {renderMenuItems(item?.menu_items, root)}
                                </React.Fragment>
                            );
                        })}
                    </ul>
                </li>
            </AccessControlComponent>
        );
    }
    function renderMenuItems(items, root = true) {
        return (
            <>
                {Array.isArray(items) && items.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            {renderMenuItem(item, root)}
                        </React.Fragment>
                    );
                })}
            </>
        );
    }

    function renderMenuItem(item) {
        // if (Array.isArray(item?.menus) && item.menus.length > 0) {
        //     return renderMenus(item, false);
        // }
        let liClass = item?.li_class || '';
        const aClass = item?.a_class || '';

        if (
            !session[SESSION_IS_AUTHENTICATING] &&
            session[SESSION_AUTHENTICATED] &&
            siteConfig.site.menu.types.auth.unauthenticated.includes(item?.type)
        ) {
            return null;
        }
        return (
            <AccessControlComponent
                roles={item?.roles}
            >
                <Dropdown.Item
                    as={CustomDropdownItem}
                    className={"iq-sub-card " + aClass}
                    href={item?.url || '#'}>
                    <div className="media align-items-center">
                        <i className="ri-calendar-line mr-3"></i>
                        <h6>{item.label}</h6>
                    </div>
                </Dropdown.Item>
            </AccessControlComponent>
        );
    }

    useEffect(() => {
        if (!name || name === '') {
            return;
        }
        menuItemsInit(name);
    }, [name]);

    return (
        <Dropdown as={CustomDropdown}>
            <Dropdown.Toggle
                className="text-decoration-none search-toggle dropdown-toggle d-flex align-items-center pointer"
                id="dropdownMenuButton3"
                as={'a'}
            >
                {children}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>

                <AccessControlComponent
                    roles={data?.roles}
                >
                    {renderMenuItems(data?.menu_items, true)}
                </AccessControlComponent>
            </Dropdown.Menu>
        </Dropdown>
    );
}
export default connect(
    state => ({
        session: state[SESSION_STATE],
        settings: state[SETTINGS_STATE]
    })
)(DropDownMenuList);