import {isSet} from "../../library/utils";
import BlogSearch from "../../components/widgets/BlogSearch";
import SidebarMenu from "@/truvoicer-base/components/Menus/SidebarMenu";
import React from "react";
import CategoryListWidget from "../../components/widgets/CategoryListWidget";
import RecentPostsWidget from "../../components/widgets/RecentPostsWidget";
import EmailOptinWidget from "../../components/widgets/EmailOptinWidget";

export const buildSidebar = ({sidebarData, templateManager = null}) => {
    let sideBarListData = [];
    if (Array.isArray(sidebarData) && sidebarData.length > 0) {
        sidebarData.map((item, index) => {
            const widgetComponent = getSidebarWidgetComponent({
                item: item

            })
            if (widgetComponent) {
                if (typeof templateManager?.render === 'function') {
                    sideBarListData.push(templateManager.render(widgetComponent))
                } else {
                    sideBarListData.push(widgetComponent)
                }
            }
        })
    }
    return sideBarListData;
}

function buildGroupWidgets({groupData}) {
    let widgets = [];
    if (Array.isArray(groupData) && groupData.length > 0) {
        groupData.map((item, index) => {
            const widgetComponent = getSidebarWidgetComponent({
                item: item
            })
            if (widgetComponent) {
                widgets.push(widgetComponent)
            }
        })
    }
    return widgets;
}

const getSidebarWidgetComponent = ({item}) => {
    if (item?.['core/search']) {
        return <BlogSearch data={item['core/search']}/>
    }
    if (item?.['core/group']) {
        return buildGroupWidgets({groupData: item['core/group']})
    }
    if (item?.['core/heading']) {
        return <BlogSearch data={item['core/heading']}/>
    }
    if (isSet(item.nav_menu)) {
        return <SidebarMenu data={item.nav_menu}/>
    }
    if (isSet(item.categories)) {
        return <CategoryListWidget data={item.categories}/>
    }
    if (isSet(item["core/recent-posts"])) {
        return <RecentPostsWidget data={item["core/recent-posts"]}/>
    }
    if (isSet(item["core/latest-posts"])) {
        return <RecentPostsWidget data={item["core/latest-posts"]}/>
    }
    if (isSet(item.email_optin_widget)) {
        return <EmailOptinWidget data={item.email_optin_widget}/>
    }

    return false;
}
