import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { DiscountAmountType } from "@/types/Discount";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectDiscountAmountTypeProps = {
    name?: string;
    value?: string | null;
}
function SelectDiscountAmountType({
    name = 'type',
    value,
}: SelectDiscountAmountTypeProps) {
    const [discountAmountTypes, setDiscountAmountTypes] = useState<Array<string>>([]);
    const [selectedDiscountAmountType, setSelectedDiscountAmountType] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchDiscountAmountTypes() {
        // Fetch discountAmountTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.discount}/amount-type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching discount amount types');
            return;
        }
        setDiscountAmountTypes(response?.data || []);
    }

    useEffect(() => {
        fetchDiscountAmountTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findDiscountAmountType = discountAmountTypes.find((discountAmountType: string) => discountAmountType === value);
            
            if (findDiscountAmountType) {
                setSelectedDiscountAmountType(findDiscountAmountType);
            }
        }
    }, [value, discountAmountTypes]);
    useEffect(() => {
        if (!selectedDiscountAmountType) {
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
        formContext.setFieldValue(name, selectedDiscountAmountType);

    }, [selectedDiscountAmountType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedDiscountAmountType(null);
                        return;
                    }
                    const findDiscountAmountType = discountAmountTypes.find((discountAmountType: string) => discountAmountType === e.target.value);
                    if (!findDiscountAmountType) {
                        console.warn('Selected discount amount type not found');
                        return;
                    }
                    setSelectedDiscountAmountType(findDiscountAmountType);
                }}
                value={selectedDiscountAmountType || ''}
            >
                <option value="">Select Discount Amount Type</option>
                {discountAmountTypes.map((discountAmountType, index) => (
                    <option
                        key={index}
                        value={discountAmountType}>
                        {`${discountAmountType}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Discount Amount Type</label>
        </div>
    );
}
export default SelectDiscountAmountType;