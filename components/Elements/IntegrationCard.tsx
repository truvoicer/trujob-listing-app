import { Button } from "react-bootstrap";
import IntegrationCardContainer from "./IntegrationCardContainer";
import { Variant } from "react-bootstrap/esm/types";

export type IntegrationCardProps = {
  isSelected?: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  icon?: string;
  variant?: Variant;
  onButtonClick?: () => void;
};
function IntegrationCard({
  variant = 'primary',
  isSelected = false,
  icon = '',
  title,
  description,
  buttonText,
  onButtonClick = () => {},
}: IntegrationCardProps) {
  return (
    <IntegrationCardContainer variant={variant} isSelected={isSelected}>
      <div className="icon iq-icon-box-2 mb-4 rounded">
        <i className={`fab ${icon}`}></i>
      </div>
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
