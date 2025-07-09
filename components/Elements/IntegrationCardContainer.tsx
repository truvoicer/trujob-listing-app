import { Variant } from "react-bootstrap/esm/types";

export type IntegrationCardContainerProps = {
  isSelected?: boolean;
  variant?: Variant;
  children?: React.ReactNode;
};
function IntegrationCardContainer({
  isSelected = false,
  variant = "primary",
  children,
}: IntegrationCardContainerProps) {
  return (
    <div className="card card-block card-stretch card-height">
      <div
        className={`card-body rounded work-detail ${variant ? `work-detail-${variant}` : "work-detail-primary"} ${
          isSelected ? "work-detail-info--hover" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
export default IntegrationCardContainer;
