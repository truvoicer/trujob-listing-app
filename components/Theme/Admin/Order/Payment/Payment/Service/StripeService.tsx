import StripeConfirmation from "../Provider/Stripe/StripeConfirmation";
import StripeDetails from "../Provider/Stripe/StripeDetails";
import { PaymentDetailsProps, PaymentService } from "./PaymentService";

export class StripeService extends PaymentService {
  public showDetails(props: PaymentDetailsProps): null | React.ReactNode {
    return <StripeDetails {...props} />;
  }

  public renderConfirmation(): null | React.ReactNode {
    return <StripeConfirmation />;
  }
}
