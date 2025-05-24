import truJobApiConfig from "@/config/api/truJobApiConfig";
import { AppModalContext } from "@/contexts/AppModalContext";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import { PaymentGateway } from "@/types/PaymentGateway";

export const PAYMENT_METHODS_FETCH_ERROR_NOTIFICATION_ID = 'payment-methods-fetch-error-notification';
export const PAYMENT_METHODS_DELETE_ERROR_NOTIFICATION_ID = 'payment-methods-delete-error-notification';

export type PaymentMethodsProps = {
    onSelect?: (paymentMethod: PaymentGateway) => void;
    title?: string;
}
function PaymentMethods({
    onSelect,
    title = 'Payment Methods',
}: PaymentMethodsProps){
    const [paymentMethods, setPaymentMethods] = useState<PaymentGateway[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentGateway | null>(null);

    const notificationContext = useContext(AppNotificationContext);

    async function fetchPaymentMethods() {
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: truJobApiConfig.endpoints.paymentGateway,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });

        if (!response) {
            notificationContext.show({
                title: 'Error',
                message: 'Error fetching payment methods',
                variant: 'error',
            }, PAYMENT_METHODS_FETCH_ERROR_NOTIFICATION_ID);
            return;
        }
        if (!Array.isArray(response?.data)) {
            notificationContext.show({
                title: 'Error',
                message: 'Error fetching payment methods',
                variant: 'error',
            }, PAYMENT_METHODS_FETCH_ERROR_NOTIFICATION_ID);
            return;
        }
        setPaymentMethods(response.data);
    }

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12 mb-4">
                    <div className="py-4 border-bottom">
                        <div className="form-title text-center">
                            <h3>Payment Methods</h3>
                        </div>
                    </div>
                </div>

                {paymentMethods.map((paymentMethod, index) => {
                    return (
                        <div key={index} className="col-xl-3 col-lg-4 col-md-6 pointer cursor-pointer" onClick={() => {
                            setSelectedPaymentMethod(paymentMethod);
                            if (typeof onSelect === 'function') {
                                onSelect(paymentMethod);
                            }
                        }
                        }>
                            <div className="card card-block card-stretch card-height">
                                <div className="card-body rounded work-detail work-detail-info">
                                    <h5 className="mb-2">
                                        {paymentMethod.name}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default PaymentMethods;