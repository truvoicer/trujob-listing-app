import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SubscriptionSetupFeeFailureAction } from "@/types/Subscription";
import { useEffect, useState } from "react";

export type SelectSubscriptionSetupFeeFailureActionProps = {
    name?: string;
    value?: SubscriptionSetupFeeFailureAction | null;
    onChange?: (value: SubscriptionSetupFeeFailureAction | null) => void;
}
function SelectSubscriptionSetupFeeFailureAction({
    name = 'subscriptionSetupFeeFailureAction',
    value,
    onChange
}: SelectSubscriptionSetupFeeFailureActionProps) {
    const [subscriptionSetupFeeFailureActions, setSubscriptionSetupFeeFailureActions] = useState<Array<SubscriptionSetupFeeFailureAction>>([]);
    const [selectedSubscriptionSetupFeeFailureAction, setSelectedSubscriptionSetupFeeFailureAction] = useState<SubscriptionSetupFeeFailureAction | null>(null);

    async function fetchSubscriptionSetupFeeFailureActions() {
        // Fetch subscriptionSetupFeeFailureActions from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.subscription.setupFeeFailureAction}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching subscriptionSetupFeeFailureActions');
            return;
        }
        setSubscriptionSetupFeeFailureActions(response?.data || []);
    }

    useEffect(() => {
        fetchSubscriptionSetupFeeFailureActions();
    }, []);

    useEffect(() => {
        if (value) {
            const findSubscriptionSetupFeeFailureAction = subscriptionSetupFeeFailureActions.find((subscriptionSetupFeeFailureAction: string) => subscriptionSetupFeeFailureAction === value);

            if (findSubscriptionSetupFeeFailureAction) {
                setSelectedSubscriptionSetupFeeFailureAction(findSubscriptionSetupFeeFailureAction);
            }
        }
    }, [value, subscriptionSetupFeeFailureActions]);
    useEffect(() => {
        if (typeof onChange === 'function' && selectedSubscriptionSetupFeeFailureAction) {
            onChange(selectedSubscriptionSetupFeeFailureAction);
        }
    }, [selectedSubscriptionSetupFeeFailureAction]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedSubscriptionSetupFeeFailureAction(null);
                        return;
                    }
                    const findSubscriptionSetupFeeFailureAction = subscriptionSetupFeeFailureActions.find((subscriptionSetupFeeFailureAction: string) => subscriptionSetupFeeFailureAction === e.target.value);
                    if (!findSubscriptionSetupFeeFailureAction) {
                        console.warn('Selected subscriptionSetupFeeFailureAction not found');
                        return;
                    }
                    setSelectedSubscriptionSetupFeeFailureAction(findSubscriptionSetupFeeFailureAction);
                }}
                value={selectedSubscriptionSetupFeeFailureAction || ''}
            >
                <option value="">Select Setup Fee Failure Action</option>
                {subscriptionSetupFeeFailureActions.map((subscriptionSetupFeeFailureAction, index) => (
                    <option
                        key={index}
                        value={subscriptionSetupFeeFailureAction}>
                        {`${subscriptionSetupFeeFailureAction}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Setup Fee Failure Action</label>
        </div>
    );
}
export default SelectSubscriptionSetupFeeFailureAction;