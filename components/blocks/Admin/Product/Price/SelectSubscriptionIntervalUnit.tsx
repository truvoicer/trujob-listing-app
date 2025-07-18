import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SubscriptionIntervalUnit } from "@/types/Subscription";
import { useEffect, useState } from "react";

export type SelectSubscriptionIntervalUnitProps = {
    name?: string;
    value?: SubscriptionIntervalUnit | null;
    onChange?: (value: SubscriptionIntervalUnit | null) => void;
}
function SelectSubscriptionIntervalUnit({
    name = 'subscriptionIntervalUnit',
    value,
    onChange
}: SelectSubscriptionIntervalUnitProps) {
    const [subscriptionIntervalUnits, setSubscriptionIntervalUnits] = useState<Array<SubscriptionIntervalUnit>>([]);
    const [selectedSubscriptionIntervalUnit, setSelectedSubscriptionIntervalUnit] = useState<SubscriptionIntervalUnit | null>(null);

    async function fetchSubscriptionIntervalUnits() {
        // Fetch subscriptionIntervalUnits from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.subscription.intervalUnit}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching subscriptionIntervalUnits');
            return;
        }
        setSubscriptionIntervalUnits(response?.data || []);
    }

    useEffect(() => {
        fetchSubscriptionIntervalUnits();
    }, []);

    useEffect(() => {
        if (value) {
            const findSubscriptionIntervalUnit = subscriptionIntervalUnits.find((subscriptionIntervalUnit: string) => subscriptionIntervalUnit === value);

            if (findSubscriptionIntervalUnit) {
                setSelectedSubscriptionIntervalUnit(findSubscriptionIntervalUnit);
            }
        }
    }, [value, subscriptionIntervalUnits]);
    useEffect(() => {
        if (typeof onChange === 'function' && selectedSubscriptionIntervalUnit) {
            onChange(selectedSubscriptionIntervalUnit);
        }
    }, [selectedSubscriptionIntervalUnit]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedSubscriptionIntervalUnit(null);
                        return;
                    }
                    const findSubscriptionIntervalUnit = subscriptionIntervalUnits.find((subscriptionIntervalUnit: string) => subscriptionIntervalUnit === e.target.value);
                    if (!findSubscriptionIntervalUnit) {
                        console.warn('Selected subscriptionIntervalUnit not found');
                        return;
                    }
                    setSelectedSubscriptionIntervalUnit(findSubscriptionIntervalUnit);
                }}
                value={selectedSubscriptionIntervalUnit || ''}
            >
                <option value="">Select Interval Unit</option>
                {subscriptionIntervalUnits.map((subscriptionIntervalUnit, index) => (
                    <option
                        key={index}
                        value={subscriptionIntervalUnit}>
                        {`${subscriptionIntervalUnit}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Interval Unit</label>
        </div>
    );
}
export default SelectSubscriptionIntervalUnit;