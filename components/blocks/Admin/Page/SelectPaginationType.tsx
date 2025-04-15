import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    showSubmitButton?: boolean;
}
function SelectPaginationTypes({
    value,
    onChange,
    showSubmitButton = true,
}: Props) {
    const [paginationTypes, setPaginationTypes] = useState<Array<string>>([]);
    const [selectedPaginationType, setSelectedPaginationType] = useState<string>('');

    async function fetchPaginationTypes() {
        // Fetch paginationTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pagination}/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        })
        if (!response) {
            console.warn('No response from API when fetching paginationTypes');
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
        if (typeof onChange === 'function') {
            onChange(selectedPaginationType);
        }
    }, [selectedPaginationType]);

    return (
        <div>
            <h2>Select a Pagination Type</h2>
            <p>Select a pagination type.</p>
            <select
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
            {showSubmitButton && (
                <button type="submit" className="btn btn-primary">Select</button>
            )}
        </div>
    );
}
export default SelectPaginationTypes;