import React, { useEffect, useState } from "react";
import { Nav, Tab, TabContainerProps } from "react-bootstrap";
import Loader from "../Loader";

export type StepActions = {
    nextStep: () => void;
    previousStep: () => void;
    showNext?: () => void;
    showPrevious?: () => void;
    showFinish?: () => void;
    showCancel?: () => void;
};
export type StepperItem = {
    id: string;
    nextStep?: () => void;
    previousStep?: () => void;
    showNext?: boolean;
    showPrevious?: boolean;
    showFinish?: boolean;
    showCancel?: boolean;
    beforeNext?: () => Promise<boolean>;
    component: ({
        nextStep,
        previousStep,
        showNext,
        showPrevious,
        showFinish,
        showCancel,
    }: StepActions) => React.ReactNode | React.ReactNode[] | React.ReactElement | React.Component | React.Component[];
    default?: boolean;
    label?: string;
}
export type StepperProps = {
    title?: string;
    config: Array<StepperItem>;
};

function Stepper({
    title,
    config,
}: StepperProps) {
    const classes = {};
    const [tabs, setTabs] = useState<StepperItem[]>([]);
    const [activeStep, setActiveStep] = useState<string | null>(null);

    function getStepItem(id: string, key: string) {
        return tabs.find(step => step.id === id)?.[key];
    }

    function previousStep() {
        setActiveStep((activeStep: string | null) => {
            if (activeStep === tabs[0].id) {
                return tabs[0].id;
            }
            return tabs[tabs.findIndex(step => step.id === activeStep) - 1].id;
        })
    }
    async function nextStep() {
        const item = findTabById(activeStep);
        if (!item) {
            console.log('Stepper item not found', activeStep);
            return;
        }
        if (
            typeof item?.beforeNext === 'function'
        ) {
            if (!await item.beforeNext()) {
                return false;
            }
        }
        setActiveStep((activeStep: string | null) => {
            if (activeStep === tabs[tabs.length - 1].id) {
                return tabs[tabs.length - 1].id;
            }
            return tabs[tabs.findIndex(step => step.id === activeStep) + 1].id;
        })
    }

    function updateStepperItem(id: string | null, data: any) {
        console.log('updateStepperItem', id, data);
        if (!id) {
            console.log('Stepper id is required');
            return;
        }
        setTabs((prevState: StepperItem[]) => {
            const newState = [...prevState];
            const currentIndex = newState.findIndex(item => item.id === id);
            if (currentIndex !== -1) {
                newState[currentIndex] = {
                    ...newState[currentIndex],
                    ...data,
                };
            } else {
                console.log('Stepper item not found', id);
            }
            return newState;
        });
    }

    async function showNext() {
        updateStepperItem(activeStep, {
            showNext: true,
        });
    }

    function showPrevious() {
        updateStepperItem(activeStep, {
            showPrevious: true,
        });
    }

    function showFinish() {
        updateStepperItem(activeStep, {
            showFinish: true,
        });
    }
    function showCancel() {
        updateStepperItem(activeStep, {
            showCancel: true,
        });
    }
    function getDefaultKey() {
        const filterDefaults = config.filter(item => item?.default);
        if (filterDefaults.length > 0) {
            return filterDefaults[0].id;
        }
        return null;
    }

    function findTabById(id: string | null) {
        if (!id) {
            console.log('Stepper id is required');
            return null;
        }
        return tabs.find(item => item?.id === id);
    }

    function getTabContainerProps() {
        let containerProps: TabContainerProps = {
            defaultActiveKey: getDefaultKey() || '',
            activeKey: activeStep,
            mountOnEnter: true,
            unmountOnExit: true,
            onSelect: (eventKey: string | null) => {
            }
        };
        return containerProps;
    }

    useEffect(() => {
        setTabs(config);
        setActiveStep(getDefaultKey());
    }, [config]);

    console.log('Stepper', { tabs });
    return (
        <>
            {tabs.length > 0
                ? (
                    <Tab.Container {...getTabContainerProps()}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 mb-4">
                                    <div className="py-4 border-bottom">
                                        {/* <div className="form-title text-center">
                                <h3>{title}</h3>
                            </div> */}
                                        <Nav variant="pills" className="d-flex nav nav-pills mb-4 text-center event-tab">
                                            {Array.isArray(tabs) && tabs.map((item, index) => {
                                                if (!item?.id) {
                                                    console.log('Tab key is required', { index, item });
                                                    return null;
                                                }
                                                if (!item?.component) {
                                                    console.log('Tab component is required', { index, item });
                                                    return null;
                                                }
                                                return (
                                                    <Nav.Item key={index}>
                                                        <Nav.Link
                                                            eventKey={item.id}>
                                                            {item?.label || ''}
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                );
                                            })}
                                        </Nav>
                                    </div>
                                </div>

                                <div className="component-top">
                                    <div className="component-top--wrapper">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-10 col-md-8">

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
                                                {Array.isArray(tabs) && tabs.map((item: StepperItem, index: number) => {
                                                    if (!item?.id) {
                                                        console.log('Tab key is required', { index, item });
                                                        return null;
                                                    }
                                                    if (typeof item?.component !== 'function') {
                                                        console.log('Tab component is required', { index, item });
                                                        return null;
                                                    }

                                                    return (
                                                        <Tab.Pane eventKey={item.id} key={index}>
                                                            {item.component({
                                                                nextStep,
                                                                previousStep,
                                                                showNext,
                                                                showPrevious,
                                                                showFinish,
                                                                showCancel,
                                                            })}
                                                            {!item?.showNext && (
                                                                <div className="d-flex justify-content-end mt-3">
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={nextStep}
                                                                    >
                                                                        Next
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {item?.showPrevious && (
                                                                <div className="d-flex justify-content-end mt-3">
                                                                    <button
                                                                        className="btn btn-secondary"
                                                                        onClick={previousStep}
                                                                    >
                                                                        Previous
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {item?.showFinish && (
                                                                <div className="d-flex justify-content-end mt-3">
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => {
                                                                            console.log('Finish clicked');
                                                                        }}
                                                                    >
                                                                        Finish
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {item?.showCancel && (
                                                                <div className="d-flex justify-content-end mt-3">
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => {
                                                                            console.log('Cancel clicked');
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Tab.Pane>
                                                    );
                                                })}
                                            </Tab.Content>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Container>
                ) : (
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <Loader />
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}
export default Stepper;