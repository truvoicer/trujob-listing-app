import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import {getSidebarWidget} from "@/components/products/sidebar/partials/SidebarWidgets";
import WidgetGroup from "@/components/products/sidebar/partials/WidgetGroup";
import WidgetContainer from "@/components/products/sidebar/partials/WidgetContainer";
import {WidgetFactory} from "@/components/factories/widget/WidgetFactory";

const Sidebar = ({data = []}) => {
    const widgetFactory = new WidgetFactory();
    function buildWidgets(widgetData) {
        return widgetData.map((item, index) => {
            return widgetFactory.renderWidget(item?.type);
        });
    }

    function renderWidgets(widgetData) {
        return (
            <>
                {widgetData.map((item, index) => {
                    if (Array.isArray(item) && item.length > 0) {
                        return (
                            <WidgetGroup key={index} widgets={item} />
                        )
                    }

                    if (!item) {
                        return null;
                    }

                    if (!item?.component) {
                        return null;
                    }
                    const WidgetComponent = item.component;
                    const widgetProps = item?.props || {};
                    if (item?.hasContainer === false) {
                        return (
                            <React.Fragment key={index}>
                                <WidgetComponent {...widgetProps} />
                            </React.Fragment>
                        );
                    }

                    return (
                        <WidgetContainer key={index} title={item?.title || ''}>
                            <WidgetComponent {...widgetProps} />
                        </WidgetContainer>
                    )
                })}
            </>
        )
    }
    return (
        <div className={`job_filter white-bg sidebar`}>
            <div className="form_inner white-bg">
                {renderWidgets(buildWidgets(data))}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(Sidebar);
