import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectTaxRateTypeProps = {
    name?: string;
    value?: string | null;
}
function SelectTaxRateType({
    name = 'type',
    value,
}: SelectTaxRateTypeProps) {
    const [taxRateTypes, setTaxRateTypes] = useState<Array<string>>([]);
    const [selectedTaxRateType, setSelectedTaxRateType] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchTaxRateTypes() {
        // Fetch taxRateTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.taxRate}/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching taxRateTypes');
            return;
        }
        setTaxRateTypes(response?.data || []);
    }

    useEffect(() => {
        fetchTaxRateTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findTaxRateType = taxRateTypes.find((taxRateType: string) => taxRateType === value);
            
            if (findTaxRateType) {
                setSelectedTaxRateType(findTaxRateType);
            }
        }
    }, [value, taxRateTypes]);
    useEffect(() => {
        if (!selectedTaxRateType) {
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
        formContext.setFieldValue(name, selectedTaxRateType);

    }, [selectedTaxRateType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedTaxRateType(null);
                        return;
                    }
                    const findTaxRateType = taxRateTypes.find((taxRateType: string) => taxRateType === e.target.value);
                    if (!findTaxRateType) {
                        console.warn('Selected taxRateType not found');
                        return;
                    }
                    setSelectedTaxRateType(findTaxRateType);
                }}
                value={selectedTaxRateType || ''}
            >
                <option value="">Select Tax Rate Type</option>
                {taxRateTypes.map((taxRateType, index) => (
                    <option
                        key={index}
                        value={taxRateType}>
                        {`${taxRateType}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Tax Rate Type</label>
        </div>
    );
}
export default SelectTaxRateType;