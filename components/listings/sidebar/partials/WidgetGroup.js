import React, {useContext} from 'react';
import WidgetContainer from "@/components/listings/sidebar/partials/WidgetContainer";

function WidgetGroup({children, widgets = [], title}) {
    return (
        <WidgetContainer title={title || ''}>
            <div className={'widget-group'}>
                {widgets.map((item, index) => {
                    if (Array.isArray(item) && item.length > 0) {
                        return (
                            <WidgetGroup key={index.toString()} widgets={item}/>
                        )
                    }

                    if (!item) {
                        return null;
                    }

                    if (!item?.component) {
                        return null;
                    }
                    return item.component;
                })}
            </div>
        </WidgetContainer>
    );
}

WidgetGroup.category = 'sidebars';
WidgetGroup.templateId = 'widgetGroup';
export default WidgetGroup;
