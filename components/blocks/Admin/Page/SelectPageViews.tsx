import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

type Props = {
    value: string | null;
    onChange: (pageView: string) => void;
    onSubmit?: (pageView: string) => void;
    showSubmitButton?: boolean;
}
function SelectPageViews({
    value,
    onChange,
    onSubmit,
    showSubmitButton = true,
}: Props) {
    const [pageViews, setPageViews] = useState<Array<string>>([]);
    const [selectedPageView, setSelectedPageView] = useState<string>(value || '');

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


    return (
        <div>
            <h2>Select View</h2>
            <p>Select a view.</p>
                <select
                    className="form-control"
                    onChange={e => {
                        setSelectedPageView(e.target.value);
                        if (typeof onChange === 'function') {
                            onChange(e.target.value);
                        }
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
                {showSubmitButton && (
                    <button type="submit" className="btn btn-primary">Select</button>
                )}
        </div>
    );
}
export default SelectPageViews;