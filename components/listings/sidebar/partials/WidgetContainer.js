import React from 'react';
import {isNotEmpty} from "@/helpers/utils";

function WidgetContainer({title, children}) {
    return (
        <div className="mb-5">
            {isNotEmpty(title) && (
                <h3 className="h5 text-black mb-3">{title}</h3>
            )}
            {children}
        </div>
    );
}

export default WidgetContainer;
