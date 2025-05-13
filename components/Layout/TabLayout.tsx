import { DebugHelpers } from "@/helpers/DebugHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { PageBlock } from "@/types/PageBlock";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Nav, Tab, TabContainerProps } from "react-bootstrap";

export type TabItem = PageBlock & {
    key: string;
    component: any;
}
type Props = {
    config: Array<TabItem>;
}
type ContainerProps = {
    defaultActiveKey: string;
    onSelect?: (eventKey: string | null) => void;
}
function TabLayout({
    config = []
}: Props) {

    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTabKey = getActiveTabKey();

    function getDefaultKey() {
        const filterDefaults = config.filter(item => item?.default);
        if (filterDefaults.length > 0) {
            return filterDefaults[0].key;
        }
        return null;
    }

    function buildTabId(tabItem: TabItem) {
        const filterTabsByType = config.filter(item => item?.type === tabItem?.type);
        if (filterTabsByType.length === 1) {
            return tabItem?.type;
        }
        return tabItem?.type + '-' + tabItem?.key;
    }
    function findTabById(tabId: string) {
        const filterTabsByType = config.filter(item => item?.type === tabId);
        if (filterTabsByType.length === 0) {
            return null;
        }
        if (filterTabsByType.length === 1) {
            return filterTabsByType[0];
        }
        const findTab = config.find(item => {
            const findKey = buildTabId(item);
            return findKey === tabId;
        });
        if (!findTab) {
            return null;
        }
        return findTab;
    }
    function getTabContainerProps() {
        let containerProps: TabContainerProps = {
            defaultActiveKey: '',
            mountOnEnter: true,
            unmountOnExit: true,
            onSelect: (eventKey: string | null) => {
                DebugHelpers.log(DebugHelpers.DEBUG, 'Selected Tab:', eventKey);
                const findKey = config.find(item => item.key === eventKey);
                DebugHelpers.log(DebugHelpers.DEBUG, 'findKey', findKey);
                if (!findKey) {
                    DebugHelpers.log(DebugHelpers.ERROR, 'Tab key not found', eventKey);
                    return;
                }
                const query = UrlHelpers.createQueryString(searchParams, [
                    {
                        name: 'tab',
                        value: buildTabId(findKey),
                    }
                ]);
                router.push(`?${query}`);
            }
        };
        
        if (activeTabKey && activeTabKey !== null) {
            containerProps.defaultActiveKey = activeTabKey;
        }
        return containerProps;
    }
    function getActiveTabKey() {

        const tabId = searchParams.get('tab');
        if (!tabId) {
            return getDefaultKey();
        }

        const findTab = findTabById(tabId);
        if (!findTab) {
            DebugHelpers.log(DebugHelpers.ERROR, 'Tab not found', tabId);
            return;
        }
        return findTab.key;
    }

    return (
        <Tab.Container {...getTabContainerProps()}>
            <div className="content-top">
                <div className="content-top--wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="navbar-breadcrumb">
                                    <h1 className="mb-1">Pages</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-10 col-md-8">
                            <Nav variant="pills" className="d-flex nav nav-pills mb-4 text-center event-tab">
                                {config.map((item, index) => {
                                    if (!item?.key) {
                                        DebugHelpers.log(DebugHelpers.WARN, 'Tab key is required', { index, item });
                                        return null;
                                    }
                                    if (!item?.component) {
                                        DebugHelpers.log(DebugHelpers.WARN, 'Tab component is required', { index, item });
                                        return null;
                                    }
                                    return (
                                        <Nav.Item key={index}>
                                            <Nav.Link
                                                eventKey={item.key}>
                                                {item?.nav_title || ''}
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })}
                            </Nav>
                        </div>
                        {/* <div className="col-lg-2 col-md-4 tab-extra" id="view-event">
                            <div className="float-md-right mb-4"><a href="#event1" className="btn view-btn">View Event</a></div>
                        </div> */}
                    </div>
                    {/* <div className="tab-extra active" id="search-with-button">
                        <div className="d-flex flex-wrap align-items-center mb-4">
                            <div className="iq-search-bar search-device mb-0 pr-3">
                                <form action="#" className="searchbox">
                                    <input type="text" className="text search-input" placeholder="Search..." />
                                </form>
                            </div>
                        </div>
                    </div> */}
                </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">


                        <Tab.Content>
                            {config.map((item: TabItem, index: number) => {
                                if (!item?.key) {
                                    DebugHelpers.log(DebugHelpers.WARN, 'Tab key is required', { index, item });
                                    return null;
                                }
                                if (!item?.component) {
                                    DebugHelpers.log(DebugHelpers.WARN, 'Tab component is required', { index, item });
                                    return null;
                                }
                                // const Component = item.component;
                                // const componentProps = item.componentProps || {};
                                return (
                                    <Tab.Pane eventKey={item.key} key={index}>
                                        {item.component}
                                    </Tab.Pane>
                                );
                            })}
                        </Tab.Content>
                    </div>
                </div>
            </div>

        </Tab.Container>
    );
}
export default TabLayout;