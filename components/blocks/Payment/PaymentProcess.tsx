import { SessionState } from "@/library/redux/reducers/session-reducer";
import Basket from "./Basket/Basket";
import { act, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/library/redux/store";
import ButtonLink from "@/components/Elements/ButtonLink";
import Shipping from "./Shipping/Shipping";

export const STEP_BASKET = "basket";
export const STEP_SHIPPING_DETAILS = "shipping_details";
export const STEP_PAYMENT_METHOD = "payment_method";
export const STEP_PAYMENT_DETAILS = "payment_details";
export const STEP_REVIEW_CONFIRM = "review_confirm";

export type PaymentProcess = {
  session: SessionState;
};

export type StepConfig = {
  id: string;
  title: string;
  description: string;
  component?: React.ComponentType<any>;
};

function PaymentProcess({ session }: PaymentProcess) {
  const steps: Array<StepConfig> = [
    {
      id: STEP_BASKET,
      title: "Basket",
      description: "",
      component: Basket,
    },
    {
      id: STEP_SHIPPING_DETAILS,
      title: "Shipping Address",
      description:
        "Enter your shipping address to ensure the products are delivered to the correct location.",
      component: Shipping, // Placeholder for future component
    },
    {
      id: STEP_PAYMENT_METHOD,
      title: "Select Payment Method",
      description:
        "Choose your preferred payment method to proceed with the transaction.",
      component: undefined, // Placeholder for future component
    },
    {
      id: STEP_PAYMENT_DETAILS,
      title: "Enter Payment Details",
      description:
        "Provide the necessary payment information such as card number, expiration date, and CVV.",
      component: undefined, // Placeholder for future component
    },
    {
      id: STEP_REVIEW_CONFIRM,
      title: "Review and Confirm",
      description:
        "Review your payment details and confirm the transaction to complete the process.",
      component: undefined, // Placeholder for future component
    },
  ];

  function renderStepComponent(step: StepConfig): React.ReactNode | null {
    if (!step) return null;
    if (!step?.component) return null;
    const StepComponent = step.component;
    return <StepComponent />;
  }

  function isStepActive(step: StepConfig): boolean {
    return currentStep === step.id;
  }

  function getActiveStepConfig(): StepConfig | null {
    const activeStep = steps.find((step) => isStepActive(step));
    if (!activeStep) return null;
    return activeStep;
  }

  function isFirstStep(): boolean {
    return currentStep === steps[0].id;
  }

  const [currentStep, setCurrentStep] = useState<string>(steps[0].id);

  const activeStepConfig = getActiveStepConfig();

  return (
    <>
      {activeStepConfig ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">Payment Process</h2>
          <div className="w-full max-w-md">
            <div className={`p-4 mb-4 border rounded bg-gray-100`}>
              <h3 className="text-lg font-semibold">
                {activeStepConfig.title}
              </h3>
              <p className="text-sm text-gray-600">
                {activeStepConfig.description}
              </p>
              {renderStepComponent(activeStepConfig)}
              {!isFirstStep() && (
                <ButtonLink
                  onClick={() => {
                    const currentIndex = steps.findIndex(
                      (step) => step.id === currentStep
                    );
                    if (currentIndex > 0) {
                      setCurrentStep(steps[currentIndex - 1].id);
                    }
                  }}
                >
                  Previous Step
                </ButtonLink>
              )}
              <ButtonLink
                className={`btn-primary ${isFirstStep() ? "w-100" : ""}`}
                onClick={() => {
                  const currentIndex = steps.findIndex(
                    (step) => step.id === currentStep
                  );
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1].id);
                  } else {
                    // Handle completion of the payment process
                    alert("Payment process completed!");
                  }
                }}
              >
                {currentStep === STEP_BASKET
                  ? "Proceed to Shipping Address"
                  : currentStep === STEP_SHIPPING_DETAILS
                  ? "Proceed to Payment Method"
                  : currentStep === STEP_PAYMENT_METHOD
                  ? "Proceed to Payment Details"
                  : currentStep === STEP_PAYMENT_DETAILS
                  ? "Review and Confirm"
                  : "Complete Payment"}
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No active step found.</p>
        </div>
      )}
    </>
  );
}
export default connect(
  (state: RootState) => ({
    session: state.session,
  }),
  null
)(PaymentProcess);
