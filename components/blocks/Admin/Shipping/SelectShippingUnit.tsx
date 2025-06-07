import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectShippingUnitProps = {
    name: string;
    value?: string | null;
}
function SelectShippingUnit({
    name,
    value,
}: SelectShippingUnitProps) {
    const [shippingUnits, setShippingUnits] = useState<Array<string>>([]);
    const [selectedShippingUnit, setSelectedShippingUnit] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchShippingUnits() {
        // Fetch shippingUnits from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shipping}/unit`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping rate types');
            return;
        }
        setShippingUnits(response?.data || []);
    }

    useEffect(() => {
        fetchShippingUnits();
    }, []);

    useEffect(() => {
        if (value) {
            const findShippingUnit = shippingUnits.find((shippingUnit: string) => shippingUnit === value);
            
            if (findShippingUnit) {
                setSelectedShippingUnit(findShippingUnit);
            }
        }
    }, [value, shippingUnits]);
    useEffect(() => {
        if (!selectedShippingUnit) {
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
        formContext.setFieldValue(name, selectedShippingUnit);

    }, [selectedShippingUnit]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedShippingUnit(null);
                        return;
                    }
                    const findShippingUnit = shippingUnits.find((shippingUnit: string) => shippingUnit === e.target.value);
                    if (!findShippingUnit) {
                        console.warn('Selected shipping rate type not found');
                        return;
                    }
                    setSelectedShippingUnit(findShippingUnit);
                }}
                value={selectedShippingUnit || ''}
            >
                <option value="">Select Unit</option>
                {shippingUnits.map((shippingUnit, index) => (
                    <option
                        key={index}
                        value={shippingUnit}>
                        {`${shippingUnit}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Shipping Unit</label>
        </div>
    );
}
export default SelectShippingUnit;