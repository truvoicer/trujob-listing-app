import { useContext, useEffect } from "react";
import { PaymentGateway } from "@/types/PaymentGateway";
import { CheckoutContext } from "./Checkout/context/CheckoutContext";
import { PaymentMethod } from "@/types/PaymentMethod";
import IntegrationCard from "@/components/Elements/IntegrationCard";

export const PAYMENT_METHODS_FETCH_ERROR_NOTIFICATION_ID =
  "payment-methods-fetch-error-notification";
export const PAYMENT_METHODS_DELETE_ERROR_NOTIFICATION_ID =
  "payment-methods-delete-error-notification";

export type PaymentGatewaysProps = {
  onSelect?: (paymentMethod: PaymentGateway) => void;
  title?: string;
};
function PaymentGateways({
  title = "Payment Gateways",
}: PaymentGatewaysProps) {
  const checkoutContext = useContext(CheckoutContext);

  useEffect(() => {
    checkoutContext.refresh("availablePaymentGateways");
  }, []);

  console.log("Shipping component rendered with order:", checkoutContext);
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="py-4 border-bottom">
            <div className="form-title text-center">
              <h3>{title}</h3>
            </div>
          </div>
        </div>

        {Array.isArray(checkoutContext?.availablePaymentGateways) &&
          checkoutContext.availablePaymentGateways.length > 0 &&
          checkoutContext.availablePaymentGateways.map(
            (paymentMethod: PaymentMethod, index: number) => {
              const isSelected = checkoutContext.selectedPaymentGateway?.id === paymentMethod.id;
              return (
                <div
                  key={index}
                  className="col-xl-3 col-lg-4 col-md-6 pointer cursor-pointer"
                  onClick={() => {
                    checkoutContext.update({ selectedPaymentGateway: paymentMethod });
                  }}
                >
                  <IntegrationCard
                    isSelected={isSelected}
                    title={paymentMethod.name}
                    description={paymentMethod.description}
                    onButtonClick={() => {
                      checkoutContext.update({ selectedPaymentGateway: paymentMethod });
                    }}
                  />
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}
export default PaymentGateways;
