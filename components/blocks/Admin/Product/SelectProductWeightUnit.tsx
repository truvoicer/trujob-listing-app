import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectProductWeightUnitProps = {
    name: string;
    value?: string | null;
}
function SelectProductWeightUnit({
    name,
    value,
}: SelectProductWeightUnitProps) {
    const [productWeightUnits, setProductWeightUnits] = useState<Array<string>>([]);
    const [selectedProductWeightUnit, setSelectedProductWeightUnit] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchProductWeightUnits() {
        // Fetch productWeightUnits from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.product}/weight-unit`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching product rate types');
            return;
        }
        setProductWeightUnits(response?.data || []);
    }

    useEffect(() => {
        fetchProductWeightUnits();
    }, []);

    useEffect(() => {
        if (value) {
            const findProductWeightUnit = productWeightUnits.find((productWeightUnit: string) => productWeightUnit === value);
            
            if (findProductWeightUnit) {
                setSelectedProductWeightUnit(findProductWeightUnit);
            }
        }
    }, [value, productWeightUnits]);
    useEffect(() => {
        if (!selectedProductWeightUnit) {
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
        formContext.setFieldValue(name, selectedProductWeightUnit);

    }, [selectedProductWeightUnit]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedProductWeightUnit(null);
                        return;
                    }
                    const findProductWeightUnit = productWeightUnits.find((productWeightUnit: string) => productWeightUnit === e.target.value);
                    if (!findProductWeightUnit) {
                        console.warn('Selected product rate type not found');
                        return;
                    }
                    setSelectedProductWeightUnit(findProductWeightUnit);
                }}
                value={selectedProductWeightUnit || ''}
            >
                <option value="">Select Unit</option>
                {productWeightUnits.map((productWeightUnit, index) => (
                    <option
                        key={index}
                        value={productWeightUnit}>
                        {`${productWeightUnit}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Product Unit</label>
        </div>
    );
}
export default SelectProductWeightUnit;