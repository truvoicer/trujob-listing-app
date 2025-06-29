import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectProductUnitProps = {
    name: string;
    value?: string | null;
}
function SelectProductUnit({
    name,
    value,
}: SelectProductUnitProps) {
    const [productUnits, setProductUnits] = useState<Array<string>>([]);
    const [selectedProductUnit, setSelectedProductUnit] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchProductUnits() {
        // Fetch productUnits from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.product}/unit`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching product rate types');
            return;
        }
        setProductUnits(response?.data || []);
    }

    useEffect(() => {
        fetchProductUnits();
    }, []);

    useEffect(() => {
        if (value) {
            const findProductUnit = productUnits.find((productUnit: string) => productUnit === value);
            
            if (findProductUnit) {
                setSelectedProductUnit(findProductUnit);
            }
        }
    }, [value, productUnits]);
    useEffect(() => {
        if (!selectedProductUnit) {
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
        formContext.setFieldValue(name, selectedProductUnit);

    }, [selectedProductUnit]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedProductUnit(null);
                        return;
                    }
                    const findProductUnit = productUnits.find((productUnit: string) => productUnit === e.target.value);
                    if (!findProductUnit) {
                        console.warn('Selected product rate type not found');
                        return;
                    }
                    setSelectedProductUnit(findProductUnit);
                }}
                value={selectedProductUnit || ''}
            >
                <option value="">Select Unit</option>
                {productUnits.map((productUnit, index) => (
                    <option
                        key={index}
                        value={productUnit}>
                        {`${productUnit}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Product Unit</label>
        </div>
    );
}
export default SelectProductUnit;