import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectWidget({
    onChange,
    onSubmit
}) {
    const [widgets, setWidgets] = useState([]);
    const [selectedWidget, setSelectedWidget] = useState(null);

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
        if (typeof onChange === 'function') {
            onChange(selectedWidget);
        }
    }, [selectedWidget]);

    return (
        <div>
            <h2>Select Widget</h2>
            <p>Select a widget to add to the page.</p>
            <form onSubmit={e => {
                e.preventDefault();
                console.log('Selected Widget:', selectedWidget);
                if (typeof onSubmit === 'function') {
                    onSubmit(selectedWidget);
                }
            }}>
                <select
                    className="form-control"
                    onChange={e => {
                        const findSelectedWidget = widgets.find(widget => parseInt(widget?.id) === parseInt(e.target.value));
                        setSelectedWidget(findSelectedWidget);
                    }}
                    required=""
                    value={parseInt(selectedWidget?.id) || ''}
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
                <button type="submit" className="btn btn-primary">Select</button>
            </form>
        </div>
    );
}
export default SelectWidget;