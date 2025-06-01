import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { ProductType } from "@/types/Product";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectProductTypeProps = {
    name?: string;
    value?: number | null;
}
function SelectProductType({
    name = 'type',
    value,
}: SelectProductTypeProps) {
    const [productTypes, setProductTypes] = useState<Array<ProductType>>([]);
    const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchProductTypes() {
        // Fetch productTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.productType}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching productTypes');
            return;
        }
        setProductTypes(response?.data || []);
    }

    useEffect(() => {
        fetchProductTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findProductType = productTypes.find((productType: ProductType) => productType?.id === value);
            
            if (findProductType) {
                setSelectedProductType(findProductType);
            }
        }
    }, [value, productTypes]);
    useEffect(() => {
        if (!selectedProductType) {
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
        formContext.setFieldValue(name, selectedProductType);

    }, [selectedProductType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedProductType(null);
                        return;
                    }
                    const findProductType = productTypes.find((productType: ProductType) => productType?.id === parseInt(e.target.value));
                    if (!findProductType) {
                        console.warn('Selected productType not found');
                        return;
                    }
                    setSelectedProductType(findProductType);
                }}
                value={selectedProductType?.id || ''}
            >
                <option value="">Select ProductType</option>
                {productTypes.map((productType, index) => (
                    <option
                        key={index}
                        value={productType.id}>
                        {`${productType.name} | id: (${productType.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>ProductType</label>
        </div>
    );
}
export default SelectProductType;