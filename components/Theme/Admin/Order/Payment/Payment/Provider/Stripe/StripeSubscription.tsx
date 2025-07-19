import { PaymentDetailsProps } from "../../Service/PaymentService";

function StripeSubscription({
  onSuccess,
  onError,
  onCancel,
}: PaymentDetailsProps) {
  

  return (
    <div>
      {/* Stripe payment details implementation goes here */}
      <h2>Stripe subscription Details</h2>
      {/* Add your Stripe payment components here */}
    </div>
  );

}

export default StripeSubscription;
