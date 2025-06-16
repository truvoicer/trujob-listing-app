import { ShippingProviderContext } from "@/components/Provider/Shipping/context/ShippingProviderContext";
import { ShippingService } from "@/library/services/cashier/shipping/ShippingService";
import { FormikValues, useFormikContext } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";

export type SelectShippingRestrictionActionProps = {
    name?: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    hideLabel?: boolean;
}
function SelectShippingRestrictionAction({
    name = 'action',
    value,
    onChange,
    hideLabel = false,
}: SelectShippingRestrictionActionProps) {
    
    const [selectedShippingRestrictionAction, setSelectedShippingRestrictionAction] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};
    const { refresh, restrictionActions} = useContext(ShippingProviderContext);

    const shippingRestrictionActions = useMemo(
        () => (Array.isArray(restrictionActions) ? restrictionActions : []),
        [restrictionActions]
    );
    useEffect(() => {
        if (!Array.isArray(shippingRestrictionActions) || shippingRestrictionActions.length === 0) {
            refresh(ShippingService.REFRESH.TYPE.RESTRICTION_ACTIONS);
        }
    }, [shippingRestrictionActions]);

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
        if (typeof onChange === 'function') {
            onChange(selectedShippingRestrictionAction);
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
            {!hideLabel && <label className="form-label" htmlFor={name}>Shipping Restriction Action</label>}
        </div>
    );
}
export default SelectShippingRestrictionAction;