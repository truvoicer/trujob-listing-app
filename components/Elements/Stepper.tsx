import { useEffect, useState } from "react";
import ButtonLink from "@/components/Elements/ButtonLink";
import { clone } from "underscore";

export type StepperComponentProps = {
  showNext: () => void;
  showPrevious: () => void;
};
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
  showNextButton?: boolean;
  showPreviousButton?: boolean;
  onNextClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    functionProps?: Record<string, unknown>
  ) => boolean | Promise<boolean>;
  onPreviousClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    functionProps?: Record<string, unknown>
  ) => boolean | Promise<boolean>;
};
export type Stepper = {
  steps: Array<StepperItem>;
  currentStep?: string | null;
  onStepChange?: (step: StepperItem) => void;
  functionProps?: Record<string, unknown>;
};

function Stepper({ steps = [], currentStep, onStepChange, functionProps = {} }: Stepper) {
  const [stepsState, setStepsState] = useState<Array<StepperItem>>(
    buildSteps(steps)
  );

  function showNextButton(): void {
    setStepsState((prevSteps) => {
      const clonedSteps = [...prevSteps];
      const stepIndex = clonedSteps.findIndex((s) => s.id === currentStep);
      if (stepIndex !== -1) {
        clonedSteps[stepIndex] = {
          ...clonedSteps[stepIndex],
          showNextButton: true, // Default to true if not specified
        };
      }
      return clonedSteps;
    });
  }
  function showPreviousButton(): void {
    setStepsState((prevSteps) => {
      const clonedSteps = [...prevSteps];
      const stepIndex = clonedSteps.findIndex((s) => s.id === currentStep);
      if (stepIndex !== -1) {
        clonedSteps[stepIndex] = {
          ...clonedSteps[stepIndex],
          showPreviousButton: true, // Default to true if not specified
        };
      }
      return clonedSteps;
    });
  }

  function renderStepComponent(step: StepperItem): React.ReactNode | null {
    if (!step) return null;
    if (!step?.component) return null;
    const StepComponent = step.component;
    return (
      <StepComponent
        showNext={showNextButton}
        showPrevious={showPreviousButton}
      />
    );
  }

  function isStepActive(step: StepperItem): boolean {
    if (!currentStep || !step) return false;
    return currentStep === step.id;
  }

  function getActiveStepperItem(): StepperItem | null {
    const activeStep = stepsState.find((step) => isStepActive(step));
    if (!activeStep) return null;
    return activeStep;
  }

  function isFirstStep(): boolean {
    return currentStep === stepsState[0].id;
  }

  function buildSteps(steps: Array<StepperItem>): Array<StepperItem> {
    return steps.map((step) => {
      let clonedStep = { ...step };
      if (typeof clonedStep?.showPreviousButton === "undefined") {
        clonedStep.showPreviousButton = true; // Default to true if not specified
      } else {
        clonedStep.showPreviousButton = clonedStep.showPreviousButton ?? true; // Default to true
      }
      clonedStep.showNextButton = clonedStep.showNextButton ?? false; // Default to false
      return clonedStep;
    });
  }

  function setCurrentStep(stepId: string): void {
    if (typeof onStepChange === "function") {
      const step = stepsState.find((s) => s.id === stepId);
      if (step) {
        onStepChange(step);
      }
    }
  }

  const activeStepperItem = getActiveStepperItem();

  return (
    <div className="row">
      {Array.isArray(stepsState) &&
      stepsState.length > 0 &&
      activeStepperItem ? (
        <>
          <div className="col-12">
            <h2 className="text-2xl font-bold mb-4">Payment Process</h2>
          </div>
          <div className="col-12">
            {renderStepComponent(activeStepperItem)}
            {!isFirstStep() && activeStepperItem?.showPreviousButton && (
              <ButtonLink
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  if (
                    typeof activeStepperItem?.onPreviousClick === "function"
                  ) {
                    const response = await activeStepperItem.onPreviousClick(
                      e,
                      functionProps
                    );
                    if (response === false) {
                      return; // Prevent going back if the callback returns false
                    }
                  }
                  const currentIndex = stepsState.findIndex(
                    (step) => step.id === currentStep
                  );
                  if (currentIndex > 0) {
                    setCurrentStep(stepsState[currentIndex - 1].id);
                  }
                }}
              >
                {activeStepperItem?.buttonPrevious?.text || "Previous Step"}
              </ButtonLink>
            )}
            {activeStepperItem?.showNextButton && (
              <ButtonLink
                className={`btn-primary ${isFirstStep() ? "w-100" : ""}`}
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  if (typeof activeStepperItem?.onNextClick === "function") {
                    const response = await activeStepperItem.onNextClick(
                      e,
                      functionProps
                    );
                    if (response === false) {
                      return; // Prevent going to next step if the callback returns false
                    }
                  }
                  const currentIndex = stepsState.findIndex(
                    (step) => step.id === currentStep
                  );
                  if (currentIndex < stepsState.length - 1) {
                    setCurrentStep(stepsState[currentIndex + 1].id);
                  }
                }}
              >
                {activeStepperItem?.buttonNext?.text || "Next Step"}
              </ButtonLink>
            )}
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
