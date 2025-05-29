import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import siteConfig from "@/config/site-config";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

function MenuList({ name, className = '', session }) {
    const [data, setData] = useState([]);

    async function menuItemsInit(name) {
        const menuFetch = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menu}/${name}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: session[SESSION_AUTHENTICATED],
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
            id={'MenuListRenderMenus'}
            roles={item?.roles}
            >
                <li className="has-children">
                    <Link href={item?.url || '#'}>
                        {item?.label || ''}
                    </Link>
                    <ul className="dropdown">
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
        if (Array.isArray(item?.menus) && item.menus.length > 0) {
            return renderMenus(item, false);
        }
        let liClass = item?.li_class || '';
        const aClass = item?.a_class || '';

        if (
            !session[SESSION_IS_AUTHENTICATING] &&
            session[SESSION_AUTHENTICATED] &&
            siteConfig.site.menu.types.auth.unauthenticated.includes(item?.type)
        ) {
            return null;
        }
        switch (item?.type) {
            case 'register':
                return (
                    <AccessControlComponent
            id={'enuListrenderMenuItem'}
                    roles={item?.roles}
                    >
                        <li className={liClass}>
                            <Link
                                href={item?.url || '#'}
                                className={aClass}
                            >
                                <span className="bg-primary text-white rounded">{item.label}</span>
                            </Link>
                        </li>
                    </AccessControlComponent>
                );
        }
        return (
            <AccessControlComponent
            id={'MenuListrenderMenuItem'}
            roles={item?.roles}
            >
                <li className={liClass}>
                    <Link
                        href={item?.url || '#'}
                        className={aClass}
                    >
                        {item.label}
                    </Link>
                </li>
            </AccessControlComponent>
        );
    }

    useEffect(() => {
        if (!name || name === '') {
            return;
        }
        menuItemsInit(name);
    }, [name, session[SESSION_IS_AUTHENTICATING], session[SESSION_AUTHENTICATED]]);

    return (
        <>
            {session[SESSION_IS_AUTHENTICATING]
                ? null
                : (
                    <ul className={className}>
                        <AccessControlComponent

            id={'rendMenuListrItems'}
                            roles={data?.roles}
                        >
                            {renderMenuItems(data?.menu_items, true)}
                        </AccessControlComponent>
                    </ul>
                )
            }
        </>
    );
}
export default connect(
    state => ({
        session: state[SESSION_STATE],
        settings: state[SETTINGS_STATE]
    })
)(MenuList);