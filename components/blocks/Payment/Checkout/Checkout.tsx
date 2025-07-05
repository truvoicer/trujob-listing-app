import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { connect } from "react-redux";
import { RootState } from "@/library/redux/store";
import CheckoutProvider from "./CheckoutProvider";
import PaymentProcess from "../PaymentProcess";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { Order } from "@/types/Cashier";
import { Price } from "@/types/Price";
import { PaymentGateway } from "@/types/PaymentGateway";

export const MANAGE_ADDRESS_MODAL_ID = "manage-address-modal";

export type Checkout = {
  session: SessionState;
  fetchOrder: () => Promise<Order | null>;
  fetchAvailablePaymentGateways: () => Promise<PaymentGateway | null>;
  fetchPrice: () => Promise<Price | null>;
};

function Checkout({ 
    session, 
    fetchOrder, 
    fetchAvailablePaymentGateways, 
    fetchPrice: fetchProductPrice
 }: Checkout) {
  return (
    <CheckoutProvider
      fetchOrder={async () => await fetchOrder()}
      fetchAvailablePaymentGateways={async () =>
        await fetchAvailablePaymentGateways()
      }
      fetchPrice={async () => await fetchProductPrice()}
    >
      <PaymentProcess />
    </CheckoutProvider>
  );
}

export default connect((state: RootState) => ({
  session: state[SESSION_STATE],
}))(Checkout);
