import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    showSubmitButton?: boolean;
}
function SelectPaginationScrollTypes({
    value,
    onChange,
    showSubmitButton = true,
}: Props) {
    const [paginationScrollTypes, setPaginationScrollTypes] = useState<Array<string>>([]);
    const [selectedPaginationScrollType, setSelectedPaginationScrollType] = useState<string>('');

    async function fetchPaginationScrollTypes() {
        // Fetch paginationScrollTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pagination}/scroll/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching paginationScrollTypes');
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
        if (typeof onChange === 'function') {
            onChange(selectedPaginationScrollType);
        }
    }, [selectedPaginationScrollType]);

    return (
        <div>
            <h2>Select a Pagination Type</h2>
            <p>Select a pagination type.</p>
            <select
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
            {showSubmitButton && (
                <button type="submit" className="btn btn-primary">Select</button>
            )}
        </div>
    );
}
export default SelectPaginationScrollTypes;