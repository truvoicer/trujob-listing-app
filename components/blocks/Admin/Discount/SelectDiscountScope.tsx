import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { DiscountScope } from "@/types/Discount";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectDiscountScopeProps = {
    name?: string;
    value?: string | null;
}
function SelectDiscountScope({
    name = 'scope',
    value,
}: SelectDiscountScopeProps) {
    const [discountScopes, setDiscountScopes] = useState<Array<string>>([]);
    const [selectedDiscountScope, setSelectedDiscountScope] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchDiscountScopes() {
        // Fetch discountScopes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.discount}/scope`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching discount types');
            return;
        }
        setDiscountScopes(response?.data || []);
    }

    useEffect(() => {
        fetchDiscountScopes();
    }, []);

    useEffect(() => {
        if (value) {
            const findDiscountScope = discountScopes.find((discountScope: string) => discountScope === value);
            
            if (findDiscountScope) {
                setSelectedDiscountScope(findDiscountScope);
            }
        }
    }, [value, discountScopes]);
    useEffect(() => {
        if (!selectedDiscountScope) {
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
        formContext.setFieldValue(name, selectedDiscountScope);

    }, [selectedDiscountScope]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedDiscountScope(null);
                        return;
                    }
                    const findDiscountScope = discountScopes.find((discountScope: string) => discountScope === e.target.value);
                    if (!findDiscountScope) {
                        console.warn('Selected discountScope not found');
                        return;
                    }
                    setSelectedDiscountScope(findDiscountScope);
                }}
                value={selectedDiscountScope || ''}
            >
                <option value="">Select DiscountScope</option>
                {discountScopes.map((discountScope, index) => (
                    <option
                        key={index}
                        value={discountScope}>
                        {`${discountScope}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Discount Scope</label>
        </div>
    );
}
export default SelectDiscountScope;