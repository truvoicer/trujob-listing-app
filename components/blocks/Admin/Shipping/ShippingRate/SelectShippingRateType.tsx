import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectShippingRateTypeProps = {
    name?: string;
    value?: string | null;
}
function SelectShippingRateType({
    name = 'type',
    value,
}: SelectShippingRateTypeProps) {
    const [shippingRateTypes, setShippingRateTypes] = useState<Array<string>>([]);
    const [selectedShippingRateType, setSelectedShippingRateType] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchShippingRateTypes() {
        // Fetch shippingRateTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shippingRate}/type`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping rate types');
            return;
        }
        setShippingRateTypes(response?.data || []);
    }

    useEffect(() => {
        fetchShippingRateTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findShippingRateType = shippingRateTypes.find((shippingRateType: string) => shippingRateType === value);
            
            if (findShippingRateType) {
                setSelectedShippingRateType(findShippingRateType);
            }
        }
    }, [value, shippingRateTypes]);
    useEffect(() => {
        if (!selectedShippingRateType) {
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
        formContext.setFieldValue(name, selectedShippingRateType);

    }, [selectedShippingRateType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedShippingRateType(null);
                        return;
                    }
                    const findShippingRateType = shippingRateTypes.find((shippingRateType: string) => shippingRateType === e.target.value);
                    if (!findShippingRateType) {
                        console.warn('Selected shipping rate type not found');
                        return;
                    }
                    setSelectedShippingRateType(findShippingRateType);
                }}
                value={selectedShippingRateType || ''}
            >
                <option value="">Select Shipping Rate Type</option>
                {shippingRateTypes.map((shippingRateType, index) => (
                    <option
                        key={index}
                        value={shippingRateType}>
                        {`${shippingRateType}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Shipping Rate Type</label>
        </div>
    );
}
export default SelectShippingRateType;