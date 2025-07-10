import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { connect } from "react-redux";
import { RootState } from "@/library/redux/store";
import CheckoutProvider from "./CheckoutProvider";
import PaymentProcess, { STEP_BASKET } from "../PaymentProcess";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { Order } from "@/types/Order";
import { Price } from "@/types/Price";
import { PaymentGateway } from "@/types/PaymentGateway";

export const MANAGE_ADDRESS_MODAL_ID = "manage-address-modal";
export type Checkout = {
  session: SessionState;
  orderId?: number;
};
function Checkout({
  session,
  orderId,
}: Checkout) {
  return (
    <CheckoutProvider
      initialStep={STEP_BASKET}
      orderId={orderId}
    >
      <PaymentProcess />
    </CheckoutProvider>
  );
}

export default connect((state: RootState) => ({
  session: state[SESSION_STATE],
}))(Checkout);
