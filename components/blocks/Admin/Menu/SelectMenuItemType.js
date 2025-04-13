import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectMenuItemType({
    id = null,
    value,
    onChange,
    onSubmit,
    showSubmitButton = true,
}) {
    const [menuItemTypes, setMenuItemTypes] = useState([]);
    const [selectedMenuItemType, setSelectedMenuItemType] = useState(null);

    async function fetchMenuItemTypes() {
        // Fetch menuItemTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menu}/item/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching menuItemTypes');
            return;
        }
        setMenuItemTypes(response?.data || []);
    }

    useEffect(() => {
        fetchMenuItemTypes();
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedMenuItemType(value);
        }
    }, [value]);


    return (
        <div className="floating-input form-group">
            <select
                id={id || 'menuItemType'}
                className="form-control"
                onChange={e => {
                    setSelectedMenuItemType(e.target.value);
                    if (typeof onChange === 'function') {
                        onChange(e.target.value);
                    }
                }}
                required=""
                value={selectedMenuItemType || ''}
            >
                <option value="">Select Menu Item Type</option>
                {menuItemTypes.map((menuItemType, index) => (
                    <option
                        key={index}
                        value={menuItemType}>
                        {menuItemType}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={id || 'menuItemType'}>
                Menu Item Type
            </label>
            {showSubmitButton && (
                <button type="submit" className="btn btn-primary">Select</button>
            )}
        </div>
    );
}
export default SelectMenuItemType;