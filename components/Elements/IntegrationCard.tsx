import { Button } from "react-bootstrap";
import IntegrationCardContainer from "./IntegrationCardContainer";

export type IntegrationCardProps = {
  isSelected?: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};
function IntegrationCard({
  isSelected = false,
  title,
  description,
  buttonText,
  onButtonClick = () => {},
}: IntegrationCardProps) {
  return (
    <IntegrationCardContainer isSelected={isSelected}>
      {title && <h5 className="mb-2">{title}</h5>}
      {description && <p className="card-description">{description}</p>}
      {buttonText && (
        <div className="pt-3">
          <Button
              variant="danger"
              className="mr-3 px-4 btn-calendify"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </div>
        )}
    </IntegrationCardContainer>
  );
}
export default IntegrationCard;
