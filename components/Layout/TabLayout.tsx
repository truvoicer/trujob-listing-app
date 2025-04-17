import { PageBlock } from "@/types/PageBlock";
import { useRouter, useSearchParams } from "next/navigation";
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
    onSelect?: (eventKey: string | null) => void;
}
function TabLayout({
    config = []
}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    console.log('TabLayout', config);
    function getDefaultKey() {
        const filterDefaults = config.filter(item => item?.default);
        if (filterDefaults.length > 0) {
            return filterDefaults[0].key;
        }
        return null;
    }
    function createQueryString(query: Array<{
        name: string;
        value: string | number | boolean | null | undefined;
    }> = []) {
        const params = new URLSearchParams(searchParams.toString())
        if (query.length === 0) {
            return params.toString()
        }
        query.forEach(({ name, value }) => {
            if (typeof value === 'object') {
                console.warn('Query value should not be an object', { name, value });
                return;
            }
            if (value === null || value === undefined) {
                console.warn('Query value should not be null or undefined', { name, value });
                return;
            }
            if (typeof value === 'string') {
                params.set(name, value);
            } else if (typeof value === 'number') {
                params.set(name, value.toString());
            } else if (typeof value === 'boolean') {
                params.set(name, value ? 'true' : 'false');
            } else {
                console.warn('Query value should be a string, number or boolean', { name, value });
                return;
            }
        });
    
        return params.toString()
    }
    function getTabContainerProps() {
        let containerProps: ContainerProps = {
            defaultActiveKey: '',
            onSelect: (eventKey: string | null) => {
                console.log('Selected Tab:', eventKey);
                const findKey = config.find(item => item.key === eventKey);
                console.log('findKey', findKey);
                if (!findKey) {
                    console.error('Tab key not found', eventKey);
                    return;
                }
                const query = createQueryString([
                    {
                        name: 'tab',
                        value: findKey,
                    }
                ]);
                router.push(`?${query}`);
            }
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