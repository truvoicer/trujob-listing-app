import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectMenuItemTypeProps = {
    name?: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    onSubmit?: (value: string | null) => void;
    showSubmitButton?: boolean;
}
function SelectMenuItemType({
    name = 'menu_item_type',
    value,
    onChange,
}: SelectMenuItemTypeProps) {
    const [menuItemTypes, setMenuItemTypes] = useState<Array<string>>([]);
    const [selectedMenuItemType, setSelectedMenuItemType] = useState<string | null>(null);

        const formContext = useFormikContext<FormikValues>() || {};
        
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
    }, [value, menuItemTypes]);


    useEffect(() => {
        if (!selectedMenuItemType) {
            return;
        }
        if (!formContext) {
            console.warn('Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            console.warn('setFieldValue function not found in form context');
            return;
        }
        
        formContext.setFieldValue(name, selectedMenuItemType);

    }, [selectedMenuItemType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    setSelectedMenuItemType(e.target.value);
                }}
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
            <label className="form-label" htmlFor={name}>
                Menu Item Type
            </label>
        </div>
    );
}
export default SelectMenuItemType;