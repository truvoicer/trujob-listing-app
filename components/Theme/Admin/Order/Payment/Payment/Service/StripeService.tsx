import StripeDetails from "../Provider/Stripe/StripeDetails";
import { PaymentService } from "./PaymentService";

export class StripeService extends PaymentService {
  public showDetails(): null | React.ReactNode {
    return <StripeDetails />;
  }
}
