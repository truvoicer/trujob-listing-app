import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Page } from "@/types/Page";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectPageProps = {
    name?: string;
    value?: number | null;
    showSubmitButton?: boolean;
}
function SelectPage({
    name = 'page',
    value,
}: SelectPageProps) {
    const [pages, setPages] = useState<Array<Page>>([]);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchPages() {
        // Fetch pages from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.log('No response from API when fetching pages');
            return;
        }
        setPages(response?.data || []);
    }

    useEffect(() => {
        fetchPages();
    }, []);

    useEffect(() => {
        if (value) {
            const findPage = pages.find((page: Page) => page?.id === value);
            
            if (findPage) {
                setSelectedPage(findPage);
            }
        }
    }, [value, pages]);
    useEffect(() => {
        if (!selectedPage) {
            return;
        }
        if (!formContext) {
            console.log('Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            console.log('setFieldValue function not found in form context');
            return;
        }
        formContext.setFieldValue(name, selectedPage);

    }, [selectedPage]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedPage(null);
                        return;
                    }
                    const findPage = pages.find((page: Page) => page?.id === parseInt(e.target.value));
                    if (!findPage) {
                        console.log('Selected page not found');
                        return;
                    }
                    setSelectedPage(findPage);
                }}
                value={selectedPage?.id || ''}
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