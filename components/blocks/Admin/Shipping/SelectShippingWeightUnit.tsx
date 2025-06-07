import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectShippingWeightUnitProps = {
    name: string;
    value?: string | null;
}
function SelectShippingWeightUnit({
    name,
    value,
}: SelectShippingWeightUnitProps) {
    const [shippingWeightUnits, setShippingWeightUnits] = useState<Array<string>>([]);
    const [selectedShippingWeightUnit, setSelectedShippingWeightUnit] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchShippingWeightUnits() {
        // Fetch shippingWeightUnits from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shipping}/weight-unit`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping rate types');
            return;
        }
        setShippingWeightUnits(response?.data || []);
    }

    useEffect(() => {
        fetchShippingWeightUnits();
    }, []);

    useEffect(() => {
        if (value) {
            const findShippingWeightUnit = shippingWeightUnits.find((shippingWeightUnit: string) => shippingWeightUnit === value);
            
            if (findShippingWeightUnit) {
                setSelectedShippingWeightUnit(findShippingWeightUnit);
            }
        }
    }, [value, shippingWeightUnits]);
    useEffect(() => {
        if (!selectedShippingWeightUnit) {
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
        formContext.setFieldValue(name, selectedShippingWeightUnit);

    }, [selectedShippingWeightUnit]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedShippingWeightUnit(null);
                        return;
                    }
                    const findShippingWeightUnit = shippingWeightUnits.find((shippingWeightUnit: string) => shippingWeightUnit === e.target.value);
                    if (!findShippingWeightUnit) {
                        console.warn('Selected shipping rate type not found');
                        return;
                    }
                    setSelectedShippingWeightUnit(findShippingWeightUnit);
                }}
                value={selectedShippingWeightUnit || ''}
            >
                <option value="">Select Unit</option>
                {shippingWeightUnits.map((shippingWeightUnit, index) => (
                    <option
                        key={index}
                        value={shippingWeightUnit}>
                        {`${shippingWeightUnit}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Shipping Unit</label>
        </div>
    );
}
export default SelectShippingWeightUnit;