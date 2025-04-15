import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectPage({
    id = null,
    value,
    onChange,
    showSubmitButton = true,
}) {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);

    async function fetchPages() {
        // Fetch pages from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching pages');
            return;
        }
        setPages(response?.data || []);
    }

    useEffect(() => {
        fetchPages();
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedPage(value);
        }
    }, [value]);


    return (
        <div>

            <select
                id={id || 'page'}
                className="form-control"
                onChange={e => {
                    setSelectedPage(e.target.value);
                    if (typeof onChange === 'function') {
                        onChange(e.target.value);
                    }
                }}
                required=""
                value={selectedPage || ''}
            >
                <option value="">Select Page</option>
                {pages.map((page, index) => (
                    <option
                        key={index}
                        value={page.id}>
                        {`${page?.title} | name: ${page?.name} | id: (${page?.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={id || 'page'}>Page</label>
            {showSubmitButton && (
                <button type="submit" className="btn btn-primary">Select</button>
            )}
        </div>
    );
}
export default SelectPage;