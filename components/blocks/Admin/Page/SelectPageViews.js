import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectPageViews({
    onChange,
    onSubmit,
    showSubmitButton = true,
}) {
    const [pageViews, setPageViews] = useState([]);
    const [selectedPageView, setSelectedPageView] = useState(null);

    async function fetchPageViews() {
        // Fetch pageViews from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().pageViewRequest();
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
        if (typeof onChange === 'function') {
            onChange(selectedPageView);
        }
    }, [selectedPageView]);

    return (
        <div>
            <h2>Select View</h2>
            <p>Select a view.</p>
                <select
                    className="form-control"
                    onChange={e => {
                        setSelectedPageView(e.target.value);
                    }}
                    required=""
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