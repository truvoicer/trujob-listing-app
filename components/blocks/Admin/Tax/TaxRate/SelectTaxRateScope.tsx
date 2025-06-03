import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectTaxRateScopeProps = {
    name?: string;
    value?: string | null;
}
function SelectTaxRateScope({
    name = 'scope',
    value,
}: SelectTaxRateScopeProps) {
    const [taxRateScopes, setTaxRateScopes] = useState<Array<string>>([]);
    const [selectedTaxRateScope, setSelectedTaxRateScope] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchTaxRateScopes() {
        // Fetch taxRateScopes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.taxRate}/scope`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching tax RateScopes');
            return;
        }
        setTaxRateScopes(response?.data || []);
    }

    useEffect(() => {
        fetchTaxRateScopes();
    }, []);

    useEffect(() => {
        if (value) {
            const findTaxRateScope = taxRateScopes.find((taxRateScope: string) => taxRateScope === value);
            
            if (findTaxRateScope) {
                setSelectedTaxRateScope(findTaxRateScope);
            }
        }
    }, [value, taxRateScopes]);
    useEffect(() => {
        if (!selectedTaxRateScope) {
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
        formContext.setFieldValue(name, selectedTaxRateScope);

    }, [selectedTaxRateScope]);
    console.log(selectedTaxRateScope);
    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedTaxRateScope(null);
                        return;
                    }
                    const findTaxRateScope = taxRateScopes.find((taxRateScope: string) => taxRateScope === e.target.value);
                    if (!findTaxRateScope) {
                        console.warn('Selected taxRateScope not found');
                        return;
                    }
                    setSelectedTaxRateScope(findTaxRateScope);
                }}
                value={selectedTaxRateScope || ''}
            >
                <option value="">Select Tax Rate Scope</option>
                {taxRateScopes.map((taxRateScope, index) => (
                    <option
                        key={index}
                        value={taxRateScope}>
                        {`${taxRateScope}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Tax Rate Scope</label>
        </div>
    );
}
export default SelectTaxRateScope;