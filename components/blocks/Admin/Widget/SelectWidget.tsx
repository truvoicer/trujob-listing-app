import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Widget } from "@/types/Widget";
import { FormikValues, useFormikContext } from "formik";
import { useContext, useEffect, useState } from "react";

export type SelectWidgetProps = {
    name?: string;
}
function SelectWidget({
    name = 'widget',
}: SelectWidgetProps) {
    const [widgets, setWidgets] = useState<Array<Widget>>([]);
    const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchWidgets() {
        // Fetch widgets from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: truJobApiConfig.endpoints.widget,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            console.warn('No response from API when fetching widgets');
            return;
        }
        setWidgets(response?.data || []);
    }

    useEffect(() => {
        fetchWidgets();
    }, []);

    useEffect(() => {
        if (!selectedWidget) {
            return;
        }
        if (!formContext) {
            console.warn('Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            console.warn('setFieldValue function not found in form context');
            return;
        }
        formContext.setFieldValue(name, selectedWidget);
        
    }, [selectedWidget]);

    return (
        <div className="floating-input form-group">
                <select
                    id={name}
                    name={name}
                    className="form-control"
                    onChange={e => {
                        const findSelectedWidget = widgets.find(widget => parseInt(widget?.id) === parseInt(e.target.value));
                        if (!findSelectedWidget) {
                            console.warn('No widget found with id', e.target.value);
                            return;
                        }
                        setSelectedWidget(findSelectedWidget);
                    }}
                    value={selectedWidget?.id || ''}
                >
                    <option value="">Select Widget</option>
                    {widgets.map((widget, index) => (
                        <option
                            key={index}
                            value={widget.id}>
                            {`${widget.title} (${widget.name})`}
                        </option>
                    ))}
                </select>
            <label className="form-label" htmlFor={name}>
                Widget
            </label>
        </div>
    );
}
export default SelectWidget;