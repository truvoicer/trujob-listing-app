import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SubscriptionTenureType } from "@/types/Subscription";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectSubscriptionTenureTypeProps = {
    name?: string;
    value?: SubscriptionTenureType | null;
    onChange?: (value: SubscriptionTenureType | null) => void;
}
function SelectSubscriptionTenureType({
    name = 'subscriptionTenureType',
    value,
    onChange
}: SelectSubscriptionTenureTypeProps) {
    const [subscriptionTenureTypes, setSubscriptionTenureTypes] = useState<Array<SubscriptionTenureType>>([]);
    const [selectedSubscriptionTenureType, setSelectedSubscriptionTenureType] = useState<SubscriptionTenureType | null>(null);

    async function fetchSubscriptionTenureTypes() {
        // Fetch subscriptionTenureTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.subscription.tenureType}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching subscriptionTenureTypes');
            return;
        }
        setSubscriptionTenureTypes(response?.data || []);
    }

    useEffect(() => {
        fetchSubscriptionTenureTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findSubscriptionTenureType = subscriptionTenureTypes.find((subscriptionTenureType: string) => subscriptionTenureType === value);

            if (findSubscriptionTenureType) {
                setSelectedSubscriptionTenureType(findSubscriptionTenureType);
            }
        }
    }, [value, subscriptionTenureTypes]);
    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(selectedSubscriptionTenureType);
        }
    }, [selectedSubscriptionTenureType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedSubscriptionTenureType(null);
                        return;
                    }
                    const findSubscriptionTenureType = subscriptionTenureTypes.find((subscriptionTenureType: string) => subscriptionTenureType === e.target.value);
                    if (!findSubscriptionTenureType) {
                        console.warn('Selected subscriptionTenureType not found');
                        return;
                    }
                    setSelectedSubscriptionTenureType(findSubscriptionTenureType);
                }}
                value={selectedSubscriptionTenureType || ''}
            >
                <option value="">Select Tenure Type</option>
                {subscriptionTenureTypes.map((subscriptionTenureType, index) => (
                    <option
                        key={index}
                        value={subscriptionTenureType}>
                        {`${subscriptionTenureType}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Tenure Type</label>
        </div>
    );
}
export default SelectSubscriptionTenureType;