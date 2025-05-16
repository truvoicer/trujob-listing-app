import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectPaginationTypesProps = {
    name?: string;
    value?: string;
}
function SelectPaginationTypes({
    value,
    name = 'pagination_type',
}: SelectPaginationTypesProps) {
    const [paginationTypes, setPaginationTypes] = useState<Array<string>>([]);
    const [selectedPaginationType, setSelectedPaginationType] = useState<string | null>(value || null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchPaginationTypes() {
        // Fetch paginationTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pagination}/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        })
        if (!response) {
            console.log('No response from API when fetching paginationTypes');
            return;
        }
        setPaginationTypes(response?.data || []);
    }

    useEffect(() => {
        fetchPaginationTypes();
    }, []);
    
    useEffect(() => {
        if (value) {
            setSelectedPaginationType(value);
        }
    }, [value]);


    useEffect(() => {
        if (!selectedPaginationType) {
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
        formContext.setFieldValue(name, selectedPaginationType);
    }, [selectedPaginationType]);
    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    setSelectedPaginationType(e.target.value);
                }}
                value={selectedPaginationType || ''}
            >
                <option value="">Select Pagination Type</option>
                {paginationTypes.map((paginationType, index) => (
                    <option
                        key={index}
                        value={paginationType}>
                        {paginationType}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>
                Pagination Type
            </label>
        </div>
    );
}
export default SelectPaginationTypes;