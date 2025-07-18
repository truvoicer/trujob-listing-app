import { SessionState } from "@/library/redux/reducers/session-reducer";
import Basket from "./Basket/Basket";
import { connect } from "react-redux";
import { RootState } from "@/library/redux/store";
import Shipping from "./Shipping/Shipping";
import Summary from "./Summary/Summary";
import PaymentGateways from "./PaymentGateways";
import Stepper from "@/components/Elements/Stepper";
import { StepperItem } from "@/components/Stepper/Stepper";
import { useContext } from "react";
import {
  CheckoutContext,
  CheckoutContextType,
} from "./Checkout/context/CheckoutContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import PaymentDetail from "./PaymentDetail";
import Confirmation from "./Confirmation";
import PriceType from "./Price/PriceType";

export const STEP_PRICE = "price";
export const STEP_BASKET = "basket";
export const STEP_SHIPPING_DETAILS = "shipping_details";
export const STEP_SUMMARY = "summary";
export const STEP_PAYMENT_METHOD = "payment_method";
export const STEP_PAYMENT_DETAILS = "payment_details";
export const STEP_CONFIRM = "confirm";

export type PaymentProcess = {
  session: SessionState;
  productId: number;
};

export type StepConfig = {
  id: string;
  title: string;
  description: string;
  component?: React.ComponentType<any>;
};

function PaymentProcess({ productId }: PaymentProcess) {
  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const steps: Array<StepperItem> = [
    {
      id: STEP_PRICE,
      title: "Price",
      description: "",
      component: {
        node: PriceType,
        props: { productId: productId },
      },
      onNextClick: async (
        e: React.MouseEvent<HTMLButtonElement>,
        { checkoutContext }: { checkoutContext: CheckoutContextType }
      ) => {
        e.preventDefault();
        if (!checkoutContext?.priceType?.name) {
          console.error("Price type name is not available in checkout context");
          return false;
        }

        const response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            TruJobApiMiddleware.getConfig().endpoints.order,
            "store",
          ]),
          method: TruJobApiMiddleware.METHOD.POST,
          protectedReq: true,
          data: {
            price_type: checkoutContext?.priceType?.name,
            items: [
              {
                entity_type: "product",
                entity_id: productId,
                quantity: 1,
              },
            ],
          },
        });
        if (!response) {
          console.error("Failed to create order");
          return false;
        }

        checkoutContext.update({
          order: response.data,
        });
        return true;
      },
      buttonNext: { text: "Continue to Shipping" },
      buttonPrevious: undefined, // No previous step for the first step
      showNextButton: false,
    },
    {
      id: STEP_BASKET,
      title: "Basket",
      description: "",
      component: { node: Basket },
      buttonNext: { text: "Continue to Shipping" },
      buttonPrevious: undefined, // No previous step for the first step
      showNextButton: true,
    },
    {
      id: STEP_SHIPPING_DETAILS,
      title: "Shipping Address",
      description:
        "Enter your shipping address to ensure the products are delivered to the correct location.",
      component: { node: Shipping },
      buttonNext: { text: "Continue to Summary" },
      buttonPrevious: { text: "Back to Basket" },
    },
    {
      id: STEP_SUMMARY,
      title: "Order Summary",
      description: "Review your order details before proceeding to payment.",
      component: { node: Summary },
      buttonNext: { text: "Continue to Payment Method" },
      buttonPrevious: { text: "Back to Shipping" },
      showNextButton: true,
      showPreviousButton: true,
    },
    {
      id: STEP_PAYMENT_METHOD,
      title: "Select Payment Method",
      description:
        "Choose your preferred payment method to proceed with the transaction.",
      component: { node: PaymentGateways },
      buttonNext: { text: "Enter Payment Details" },
      buttonPrevious: { text: "Back to Summary" },
      onNextClick: async (
        e: React.MouseEvent<HTMLButtonElement>,
        { checkoutContext }: { checkoutContext: CheckoutContextType }
      ) => {
        e.preventDefault();
        if (!checkoutContext?.order?.id) {
          console.error("Order ID is not available in checkout context");
          return false;
        }

        const response =
          await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              TruJobApiMiddleware.getConfig().endpoints.orderTransaction.replace(
                ":orderId",
                checkoutContext.order.id.toString()
              ),
              "store",
            ]),
            method: ApiMiddleware.METHOD.POST,
            protectedReq: true,
            encrypted: true,
            data: {
              payment_gateway_id: checkoutContext?.selectedPaymentGateway?.id,
            },
          });
        if (!response) {
          console.error("Failed to proceed to payment details");
          return false;
        }

        checkoutContext.update({
          transaction: response.data,
        });
        return true;
      },
      onPreviousClick: (
        e: React.MouseEvent<HTMLButtonElement>,
        { checkoutContext }: { checkoutContext: CheckoutContextType }
      ) => {
        e.preventDefault();
        console.log("Previous button clicked for payment method");
        return true;
        // Handle previous button click
      },
    },
    {
      id: STEP_PAYMENT_DETAILS,
      title: "Enter Payment Details",
      description:
        "Provide the necessary payment information such as card number, expiration date, and CVV.",
      component: { node: PaymentDetail },
      buttonNext: undefined,
      buttonPrevious: { text: "Back to Payment Method" },
    },
    {
      id: STEP_CONFIRM,
      title: "Confirm",
      description: "Transaction confirmation",
      component: { node: Confirmation },
      buttonNext: { text: "Complete Payment" },
      buttonPrevious: { text: "Back to Payment Details" },
    },
  ];

  const checkoutContext = useContext(CheckoutContext);
  return (
    <div className="container">
      <Stepper
        functionProps={{ checkoutContext }}
        steps={steps}
        currentStep={checkoutContext.currentStep}
        onStepChange={(step: StepperItem) => {
          // console.log("Step changed to:", step);
          checkoutContext.update({
            currentStep: step.id,
          });
        }}
      />
    </div>
  );
}
export default connect(
  (state: RootState) => ({
    session: state.session,
  }),
  null
)(PaymentProcess);
