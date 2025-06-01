import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectTaxRateAmountTypeProps = {
    name?: string;
    value?: string | null;
}
function SelectTaxRateAmountType({
    name = 'amount_type',
    value,
}: SelectTaxRateAmountTypeProps) {
    const [taxRateAmountTypes, setTaxRateAmountTypes] = useState<Array<string>>([]);
    const [selectedTaxRateAmountType, setSelectedTaxRateAmountType] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchTaxRateAmountTypes() {
        // Fetch taxRateAmountTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.taxRate}/amount-type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching taxRateAmountTypes');
            return;
        }
        setTaxRateAmountTypes(response?.data || []);
    }

    useEffect(() => {
        fetchTaxRateAmountTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findTaxRateAmountType = taxRateAmountTypes.find((taxRateAmountType: string) => taxRateAmountType === value);
            
            if (findTaxRateAmountType) {
                setSelectedTaxRateAmountType(findTaxRateAmountType);
            }
        }
    }, [value, taxRateAmountTypes]);
    useEffect(() => {
        if (!selectedTaxRateAmountType) {
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
        formContext.setFieldValue(name, selectedTaxRateAmountType);

    }, [selectedTaxRateAmountType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedTaxRateAmountType(null);
                        return;
                    }
                    const findTaxRateAmountType = taxRateAmountTypes.find((taxRateAmountType: string) => taxRateAmountType === e.target.value);
                    if (!findTaxRateAmountType) {
                        console.warn('Selected taxRateAmountType not found');
                        return;
                    }
                    setSelectedTaxRateAmountType(findTaxRateAmountType);
                }}
                value={selectedTaxRateAmountType || ''}
            >
                <option value="">Select Tax Rate Amount Type</option>
                {taxRateAmountTypes.map((taxRateAmountType, index) => (
                    <option
                        key={index}
                        value={taxRateAmountType}>
                        {`${taxRateAmountType}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Tax Rate Amount Type</label>
        </div>
    );
}
export default SelectTaxRateAmountType;