import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectPaginationScrollTypesProps = {
    name?: string;
    value?: string;
}
function SelectPaginationScrollTypes({
    value,
    name = 'pagination_scroll_type',
}: SelectPaginationScrollTypesProps) {
    const [paginationScrollTypes, setPaginationScrollTypes] = useState<Array<string>>([]);
    const [selectedPaginationScrollType, setSelectedPaginationScrollType] = useState<string | null>(value || null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchPaginationScrollTypes() {
        // Fetch paginationScrollTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pagination}/scroll/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.log('No response from API when fetching paginationScrollTypes');
            return;
        }
        setPaginationScrollTypes(response?.data || []);
    }

    useEffect(() => {
        fetchPaginationScrollTypes();
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedPaginationScrollType(value);
        }
    }, [value]);

    useEffect(() => {
        if (!selectedPaginationScrollType) {
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
        formContext.setFieldValue(name, selectedPaginationScrollType);
    }, [selectedPaginationScrollType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    setSelectedPaginationScrollType(e.target.value);
                }}
                value={selectedPaginationScrollType || ''}
            >
                <option value="">Select Pagination Type</option>
                {paginationScrollTypes.map((paginationScrollType, index) => (
                    <option
                        key={index}
                        value={paginationScrollType}>
                        {paginationScrollType}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>
                Pagination Scroll Type
            </label>
        </div>
    );
}
export default SelectPaginationScrollTypes;