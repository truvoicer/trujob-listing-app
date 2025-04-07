import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectPaginationScrollTypes({
    onChange,
    onSubmit,
    showSubmitButton = true,
}) {
    const [paginationScrollTypes, setPaginationScrollTypes] = useState([]);
    const [selectedPaginationScrollType, setSelectedPaginationScrollType] = useState(null);

    async function fetchPaginationScrollTypes() {
        // Fetch paginationScrollTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().paginationScrollTypeRequest();
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
                required=""
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