import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectPaymentGatewayEnvironmentProps = {
    name?: string;
    value?: string;
}
function SelectPaymentGatewayEnvironment({
    value,
    name = 'environment',
}: SelectPaymentGatewayEnvironmentProps) {
    const [paymentGatewayEnvironments, setPaymentGatewayEnvironments] = useState<Array<string>>([]);
    const [selectedPaymentGatewayEnvironment, setSelectedPaymentGatewayEnvironment] = useState<string | null>(value || null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchPaymentGatewayEnvironment() {
        // Fetch paymentGatewayEnvironments from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.paymentGateway}/environment`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        })
        if (!response) {
            console.log('No response from API when fetching paymentGatewayEnvironments');
            return;
        }
        setPaymentGatewayEnvironments(response?.data || []);
    }

    useEffect(() => {
        fetchPaymentGatewayEnvironment();
    }, []);
    
    useEffect(() => {
        if (value) {
            setSelectedPaymentGatewayEnvironment(value);
        }
    }, [value]);


    useEffect(() => {
        if (!selectedPaymentGatewayEnvironment) {
            return;
        }
        if (!formContext) {
            console.log('Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            console.log('setFieldValue function not found in form context');
            return;
        }
        formContext.setFieldValue(name, selectedPaymentGatewayEnvironment);
    }, [selectedPaymentGatewayEnvironment]);
    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    setSelectedPaymentGatewayEnvironment(e.target.value);
                }}
                value={selectedPaymentGatewayEnvironment || ''}
            >
                <option value="">Select Payment Gateway Environment</option>
                {paymentGatewayEnvironments.map((paymentGatewayEnvironment, index) => (
                    <option
                        key={index}
                        value={paymentGatewayEnvironment}>
                        {paymentGatewayEnvironment}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>
                Payment Gateway Environment
            </label>
        </div>
    );
}
export default SelectPaymentGatewayEnvironment;