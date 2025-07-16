import { useContext } from "react";
import { CheckoutContext } from "../../../Checkout/context/CheckoutContext";

function PayPalConfirmation() {
  
  const checkoutContext = useContext(CheckoutContext);

  return (
    <div className="row">
      <div className="col">
        <h2>Order Confirmation</h2>
        <p>Your PayPal payment was successful!</p>
      </div>
    </div>
  );
}

export default PayPalConfirmation;
