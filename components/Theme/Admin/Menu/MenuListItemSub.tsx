import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import siteConfig from "@/config/site-config";
import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import Link from "next/link";
import React, { useState } from "react";
import { connect } from "react-redux";
import MenuListItem from "./MenuListItem";

function MenuListItemSub({ data, session, settings }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <AccessControlComponent
        roles={data?.roles}
            id={'menuListItemSub'}
        >
            <li>
                <Link href={data?.url || '#'}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(!isOpen)
                    }}
                    className="collapsed">
                    <span>{data?.label || ''}</span>
                </Link>
                <ul className={`iq-submenu sub-scrll collapse ${isOpen ? 'show' : ''}`}>
                    {Array.isArray(data?.menus) && data.menus.map((menu, index) => {
                        return (
                            <React.Fragment key={index}>
                                {Array.isArray(menu?.menu_items) && menu?.menu_items.map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <MenuListItem data={item} />
                                        </React.Fragment>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </ul>
            </li>
        </AccessControlComponent>
    );
}

export default connect(
    state => ({
        session: state[SESSION_STATE],
        settings: state[SETTINGS_STATE]
    })
)(MenuListItemSub);