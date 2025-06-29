
export type IntegrationCardContainerProps = {
  isSelected?: boolean;
  children?: React.ReactNode;
};
function IntegrationCardContainer({
  isSelected = false,
  children,
}: IntegrationCardContainerProps) {
  return (
    <div className="card card-block card-stretch card-height">
      <div
        className={`card-body rounded work-detail work-detail-info ${
          isSelected ? "work-detail-info--hover" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
export default IntegrationCardContainer;
