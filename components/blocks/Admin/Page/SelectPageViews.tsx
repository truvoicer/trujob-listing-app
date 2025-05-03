import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectPageViewsProps = {
    name?: string;
    value?: string;
}
function SelectPageViews({
    name = 'view',
    value,
}: SelectPageViewsProps) {
    const [pageViews, setPageViews] = useState<Array<string>>([]);
    const [selectedPageView, setSelectedPageView] = useState<string | null>(value || null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchPageViews() {
        // Fetch pageViews from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}/view`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching pageViews');
            return;
        }
        setPageViews(response?.data || []);
    }

    useEffect(() => {
        fetchPageViews();
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedPageView(value);
        }
    }, [value]);

    useEffect(() => {
        if (!selectedPageView) {
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
        formContext.setFieldValue(name, selectedPageView);

    }, [selectedPageView]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    setSelectedPageView(e.target.value);
                }}
                value={selectedPageView || ''}
            >
                <option value="">Select PageView</option>
                {pageViews.map((pageView, index) => (
                    <option
                        key={index}
                        value={pageView}>
                        {pageView}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>
                View
            </label>
        </div>
    );
}
export default SelectPageViews;