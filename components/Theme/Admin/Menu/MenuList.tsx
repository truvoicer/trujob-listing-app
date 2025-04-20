import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import siteConfig from "@/config/site-config";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MenuListItem from "./MenuListItem";
import truJobApiConfig from "@/config/api/truJobApiConfig";

function MenuList({ name, className = '', session }) {
    const [data, setData] = useState([]);

    async function menuItemsInit(name) {
        const menuFetch = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menu}/${name}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: session[SESSION_AUTHENTICATED],
        })
        if (!Array.isArray(menuFetch?.data?.menu_items)) {
            console.warn(`Menu data is not an array | name: ${name}`);
            return;
        }
        setData(menuFetch.data);
    }

    useEffect(() => {
        if (!name || name === '') {
            return;
        }
        menuItemsInit(name);
    }, [name]);

    return (
        <>
            {session[SESSION_IS_AUTHENTICATING]
                ? null
                : (
                    <ul className={className}>
                        <AccessControlComponent
                    roles={data?.roles}
                        >
                            {Array.isArray(data?.menu_items) && data?.menu_items.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <MenuListItem
                                            data={item}
                                        />
                                        {/* {renderMenuItem(item, root)} */}
                                    </React.Fragment>
                                );
                            })}
                        </AccessControlComponent>
                    </ul>
                )}
        </>
    );
}
export default connect(
    state => ({
        session: state[SESSION_STATE],
        settings: state[SETTINGS_STATE]
    })
)(MenuList);