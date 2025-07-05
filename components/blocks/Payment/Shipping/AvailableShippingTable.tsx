import { SessionState } from "@/library/redux/reducers/session-reducer";
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "@/library/redux/store";
import {
  SESSION_STATE,
  SESSION_USER,
} from "@/library/redux/constants/session-constants";
import { CheckoutContext } from "../Checkout/context/CheckoutContext";
import { ShippingMethod } from "@/types/Shipping";
import AvailableShippingTableRow from "./AvailableShippingTableRow";

export type AvailableShippingTableProps = {
  session: SessionState;
};
function AvailableShippingTable({ session }: AvailableShippingTableProps) {
  const checkoutContext = useContext(CheckoutContext);
  const order = checkoutContext.order;
  const user = session[SESSION_USER];

  useEffect(() => {
    checkoutContext.refresh("availableShippingMethods", checkoutContext);
  }, [order]);

  console.log("Shipping Component Rendered", {
    context: checkoutContext,
  });
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="table-responsive-sm">
          <table className="table">
            <tbody>
              {Array.isArray(checkoutContext.availableShippingMethods) &&
                checkoutContext.availableShippingMethods.length > 0 &&
                checkoutContext.availableShippingMethods.map(
                  (shippingMethod: ShippingMethod, index: number) => {
                    return (
                      <AvailableShippingTableRow
                        shippingMethod={shippingMethod}
                        key={index}
                      />
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default connect(
  (state: RootState) => ({
    session: state[SESSION_STATE],
  }),
  null
)(AvailableShippingTable);
