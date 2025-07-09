import { useState } from "react";
import ButtonLink from "@/components/Elements/ButtonLink";

export type StepperButton = {
  text: string;
};
export type StepperItem = {
  id: string;
  title: string;
  description: string;
  component?: React.ComponentType<any> | null;
  buttonNext: StepperButton;
  buttonPrevious?: StepperButton;
  onNextClick?: (e: React.MouseEvent<HTMLButtonElement>) => boolean | Promise<boolean>;
  onPreviousClick?: (e: React.MouseEvent<HTMLButtonElement>) => boolean | Promise<boolean>;
};
export type Stepper = {
  steps: Array<StepperItem>;
};

function Stepper({ steps = [] }: Stepper) {
  function renderStepComponent(step: StepperItem): React.ReactNode | null {
    if (!step) return null;
    if (!step?.component) return null;
    const StepComponent = step.component;
    return <StepComponent />;
  }

  function isStepActive(step: StepperItem): boolean {
    return currentStep === step.id;
  }

  function getActiveStepperItem(): StepperItem | null {
    const activeStep = steps.find((step) => isStepActive(step));
    if (!activeStep) return null;
    return activeStep;
  }

  function isFirstStep(): boolean {
    return currentStep === steps[0].id;
  }

  const [currentStep, setCurrentStep] = useState<string>(steps[0].id);

  const activeStepperItem = getActiveStepperItem();

  return (
    <div className="row">
      {activeStepperItem ? (
        <>
          <div className="col-12">
            <h2 className="text-2xl font-bold mb-4">Payment Process</h2>
          </div>
          <div className="col-12">
            {renderStepComponent(activeStepperItem)}
            {!isFirstStep() && (
              <ButtonLink
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  if (typeof activeStepperItem?.onPreviousClick === "function") {
                    const response = await activeStepperItem.onPreviousClick(e);
                    if (response === false) {
                      return; // Prevent going back if the callback returns false
                    }
                  }
                  const currentIndex = steps.findIndex(
                    (step) => step.id === currentStep
                  );
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1].id);
                  }
                }}
              >
                {activeStepperItem?.buttonPrevious?.text || "Previous Step"}
              </ButtonLink>
            )}
            <ButtonLink
              className={`btn-primary ${isFirstStep() ? "w-100" : ""}`}
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                if (typeof activeStepperItem?.onNextClick === "function") {
                  const response = await activeStepperItem.onNextClick(e);
                  if (response === false) {
                    return; // Prevent going to next step if the callback returns false
                  }
                }
                const currentIndex = steps.findIndex(
                  (step) => step.id === currentStep
                );
                if (currentIndex < steps.length - 1) {
                  setCurrentStep(steps[currentIndex + 1].id);
                }
              }}
            >
              {activeStepperItem?.buttonNext?.text || "Next Step"}
            </ButtonLink>
          </div>
        </>
      ) : (
        <div className="col-12 text-center">
          <p className="text-gray-500">No active step found.</p>
        </div>
      )}
    </div>
  );
}
export default Stepper;
