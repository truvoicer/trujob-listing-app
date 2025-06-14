import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectShippingRestrictionActionProps = {
    name?: string;
    value?: string | null;
}
function SelectShippingRestrictionAction({
    name = 'action',
    value,
}: SelectShippingRestrictionActionProps) {
    const [shippingRestrictionActions, setShippingRestrictionActions] = useState<Array<string>>([]);
    const [selectedShippingRestrictionAction, setSelectedShippingRestrictionAction] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchShippingRestrictionActions() {
        // Fetch shippingRestrictionActions from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shipping}/restriction/action`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching shipping restriction actions');
            return;
        }
        setShippingRestrictionActions(response?.data || []);
    }

    useEffect(() => {
        fetchShippingRestrictionActions();
    }, []);

    useEffect(() => {
        if (value) {
            const findShippingRestrictionAction = shippingRestrictionActions.find((shippingRestrictionAction: string) => shippingRestrictionAction === value);
            
            if (findShippingRestrictionAction) {
                setSelectedShippingRestrictionAction(findShippingRestrictionAction);
            }
        }
    }, [value, shippingRestrictionActions]);
    useEffect(() => {
        if (!selectedShippingRestrictionAction) {
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
        formContext.setFieldValue(name, selectedShippingRestrictionAction);

    }, [selectedShippingRestrictionAction]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedShippingRestrictionAction(null);
                        return;
                    }
                    const findShippingRestrictionAction = shippingRestrictionActions.find((shippingRestrictionAction: string) => shippingRestrictionAction === e.target.value);
                    if (!findShippingRestrictionAction) {
                        console.warn('Selected shipping restriction action not found');
                        return;
                    }
                    setSelectedShippingRestrictionAction(findShippingRestrictionAction);
                }}
                value={selectedShippingRestrictionAction || ''}
            >
                <option value="">Select Shipping Restriction Action</option>
                {shippingRestrictionActions.map((shippingRestrictionAction, index) => (
                    <option
                        key={index}
                        value={shippingRestrictionAction}>
                        {`${shippingRestrictionAction}`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Shipping Restriction Action</label>
        </div>
    );
}
export default SelectShippingRestrictionAction;