import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import siteConfig from "@/config/site-config";
import {
  SESSION_AUTHENTICATED,
  SESSION_IS_AUTHENTICATING,
  SESSION_STATE,
} from "@/library/redux/constants/session-constants";
import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import Link from "next/link";
import React from "react";
import { connect } from "react-redux";
import MenuListItemSub from "./MenuListItemSub";

function MenuListItem({ data, session, settings }) {
  function renderMenuItem(item) {
    if (Array.isArray(item?.menus) && item.menus.length > 0) {
      return <MenuListItemSub data={item} />;
    }
    let liClass = item?.li_class || "";
    const aClass = item?.a_class || "";

    if (
      !session[SESSION_IS_AUTHENTICATING] &&
      session[SESSION_AUTHENTICATED] &&
      siteConfig.site.menu.types.auth.unauthenticated.includes(item?.type)
    ) {
      return null;
    }
    switch (item?.type) {
      case "register":
        return (
          <AccessControlComponent roles={item?.roles} id={"renderMenuItem"}>
            <li className={liClass}>
              <Link href={item?.url || "#"} className={aClass}>
                <span className="bg-primary text-white rounded">
                  {item.label}
                </span>
              </Link>
            </li>
          </AccessControlComponent>
        );
    }
    return (
      <AccessControlComponent roles={item?.roles} id={"menuListItem"}>
        <li className={liClass}>
          <Link href={item?.url || "#"} className={aClass}>
            <span>{item.label}</span>
          </Link>
        </li>
      </AccessControlComponent>
    );
  }
  return renderMenuItem(data);
}

export default connect((state) => ({
  session: state[SESSION_STATE],
  settings: state[SETTINGS_STATE],
}))(MenuListItem);
