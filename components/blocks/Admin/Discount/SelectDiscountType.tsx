import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectDiscountTypeProps = {
    name?: string;
    value?: string | null;
}
function SelectDiscountType({
    name = 'type',
    value,
}: SelectDiscountTypeProps) {
    const [discountTypes, setDiscountTypes] = useState<Array<string>>([]);
    const [selectedDiscountType, setSelectedDiscountType] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchDiscountTypes() {
        // Fetch discountTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.discount}/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching discount types');
            return;
        }
        setDiscountTypes(response?.data || []);
    }

    useEffect(() => {
        fetchDiscountTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findDiscountType = discountTypes.find((discountType: string) => discountType === value);
            
            if (findDiscountType) {
                setSelectedDiscountType(findDiscountType);
            }
        }
    }, [value, discountTypes]);
    useEffect(() => {
        if (!selectedDiscountType) {
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
        formContext.setFieldValue(name, selectedDiscountType);

    }, [selectedDiscountType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedDiscountType(null);
                        return;
                    }
                    const findDiscountType = discountTypes.find((discountType: string) => discountType === e.target.value);
                    if (!findDiscountType) {
                        console.warn('Selected discountType not found');
                        return;
                    }
                    setSelectedDiscountType(findDiscountType);
                }}
                value={selectedDiscountType || ''}
            >
                <option value="">Select DiscountType</option>
                {discountTypes.map((discountType, index) => (
                    <option
                        key={index}
                        value={discountType}>
                        {`${discountType}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Discount Type</label>
        </div>
    );
}
export default SelectDiscountType;