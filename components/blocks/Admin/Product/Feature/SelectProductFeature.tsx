import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { ProductFeature } from "@/types/Product";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectProductFeatureProps = {
    name?: string;
    value?: number | null;
}
function SelectProductFeature({
    name = 'feature',
    value,
}: SelectProductFeatureProps) {
    const [productFeatures, setProductFeatures] = useState<Array<ProductFeature>>([]);
    const [selectedProductFeature, setSelectedProductFeature] = useState<ProductFeature | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchProductFeatures() {
        // Fetch productFeatures from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.feature}`,
            method: ApiMiddleware.METHOD.GET,
        });
        if (!response) {
            console.warn('No response from API when fetching productFeatures');
            return;
        }
        setProductFeatures(response?.data || []);
    }

    useEffect(() => {
        fetchProductFeatures();
    }, []);

    useEffect(() => {
        if (value) {
            const findProductFeature = productFeatures.find((productFeature: ProductFeature) => productFeature?.id === value);
            
            if (findProductFeature) {
                setSelectedProductFeature(findProductFeature);
            }
        }
    }, [value, productFeatures]);
    useEffect(() => {
        if (!selectedProductFeature) {
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
        formContext.setFieldValue(name, selectedProductFeature);

    }, [selectedProductFeature]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedProductFeature(null);
                        return;
                    }
                    const findProductFeature = productFeatures.find((productFeature: ProductFeature) => productFeature?.id === parseInt(e.target.value));
                    if (!findProductFeature) {
                        console.warn('Selected productFeature not found');
                        return;
                    }
                    setSelectedProductFeature(findProductFeature);
                }}
                value={selectedProductFeature?.id || ''}
            >
                <option value="">Select ProductFeature</option>
                {productFeatures.map((productFeature, index) => (
                    <option
                        key={index}
                        value={productFeature.id}>
                        {`${productFeature.label} | name: ${productFeature.name} | id: (${productFeature.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>ProductFeature</label>
        </div>
    );
}
export default SelectProductFeature;