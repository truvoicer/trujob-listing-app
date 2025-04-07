import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectPaginationTypes({
    onChange,
    onSubmit,
    showSubmitButton = true,
}) {
    const [paginationTypes, setPaginationTypes] = useState([]);
    const [selectedPaginationType, setSelectedPaginationType] = useState(null);

    async function fetchPaginationTypes() {
        // Fetch paginationTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().paginationTypeRequest();
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
                required=""
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