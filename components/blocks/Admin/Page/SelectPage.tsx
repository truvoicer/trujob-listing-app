import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Page } from "@/types/Page";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectPageProps = {
    name?: string;
    value?: number | null;
    onChange?: (pageId: number | null) => void;
    onSubmit?: (pageId: number | null) => void;
    showSubmitButton?: boolean;
}
function SelectPage({
    name = 'page',
    value,
    onChange,
}: SelectPageProps) {
    const [pages, setPages] = useState<Array<Page>>([]);
    const [selectedPage, setSelectedPage] = useState<number | null>(null);


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
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    setSelectedPage(parseInt(e.target.value));
                    if (typeof onChange === 'function') {
                        onChange(parseInt(e.target.value));
                    }
                }}
                value={selectedPage || ''}
            >
                <option value="">Select Page</option>
                {pages.map((page, index) => (
                    <option
                        key={index}
                        value={page.id}>
                        {`${page.title} | name: ${page.name} | id: (${page.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Page</label>
        </div>
    );
}
export default SelectPage;