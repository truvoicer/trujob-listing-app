import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Brand } from "@/types/Brand";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectBrandProps = {
    name?: string;
    value?: number | null;
}
function SelectBrand({
    name = 'brand',
    value,
}: SelectBrandProps) {
    const [brands, setBrands] = useState<Array<Brand>>([]);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchBrands() {
        // Fetch brands from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.brand}`,
            method: ApiMiddleware.METHOD.GET,
        });
        if (!response) {
            console.warn('No response from API when fetching brands');
            return;
        }
        setBrands(response?.data || []);
    }

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        if (value) {
            const findBrand = brands.find((brand: Brand) => brand?.id === value);
            
            if (findBrand) {
                setSelectedBrand(findBrand);
            }
        }
    }, [value, brands]);
    useEffect(() => {
        if (!selectedBrand) {
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
        formContext.setFieldValue(name, selectedBrand);

    }, [selectedBrand]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedBrand(null);
                        return;
                    }
                    const findBrand = brands.find((brand: Brand) => brand?.id === parseInt(e.target.value));
                    if (!findBrand) {
                        console.warn('Selected brand not found');
                        return;
                    }
                    setSelectedBrand(findBrand);
                }}
                value={selectedBrand?.id || ''}
            >
                <option value="">Select Brand</option>
                {brands.map((brand, index) => (
                    <option
                        key={index}
                        value={brand.id}>
                        {`${brand.label} | name: ${brand.name} | id: (${brand.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Brand</label>
        </div>
    );
}
export default SelectBrand;