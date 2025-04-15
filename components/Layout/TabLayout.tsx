import { PageBlock } from "@/types/PageBlock";
import { Nav, Tab } from "react-bootstrap";

export type TabItem = PageBlock & {
    key: string;
    component: any;
}
type Props = {
    config: Array<TabItem>;
}
type ContainerProps = {
    defaultActiveKey: string;
}
function TabLayout({
    config = []
}: Props) {
    console.log('TabLayout', config);
    function getDefaultKey() {
        const filterDefaults = config.filter(item => item?.default);
        if (filterDefaults.length > 0) {
            return filterDefaults[0].key;
        }
        return null;
    }

    function getTabContainerProps() {
        let containerProps: ContainerProps = {
            defaultActiveKey: '',
        };
        
        const defaultKey = getDefaultKey();
        if (defaultKey) {
            containerProps.defaultActiveKey = defaultKey;
        }
        return containerProps;
    }
    return (
        <Tab.Container {...getTabContainerProps()}>
            <div className="content-top">
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
                                        console.warn('Tab key is required', { index, item });
                                        return null;
                                    }
                                    if (!item?.component) {
                                        console.warn('Tab component is required', { index, item });
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
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">


                        <Tab.Content>
                            {config.map((item: TabItem, index: number) => {
                                if (!item?.key) {
                                    console.warn('Tab key is required', { index, item });
                                    return null;
                                }
                                if (!item?.component) {
                                    console.warn('Tab component is required', { index, item });
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