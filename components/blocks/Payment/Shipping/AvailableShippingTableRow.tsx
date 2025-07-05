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

export type AvailableShippingTableRowProps = {
  session: SessionState;
  shippingMethod: ShippingMethod;
};
function AvailableShippingTableRow({
  session,
  shippingMethod,
}: AvailableShippingTableRowProps) {
  const checkoutContext = useContext(CheckoutContext);
  const order = checkoutContext.order;
  const user = session[SESSION_USER];

  function showExpandedRow() {
    return true;
  }

  return (
    <>
      <tr>
        <td>{shippingMethod.label}</td>
        <td>{shippingMethod.description}</td>
      </tr>
      {showExpandedRow() && (
        <tr>
          <td colSpan={2} className="expanded-row">
            {Array.isArray(shippingMethod.rates) &&
              shippingMethod.rates.length > 0 && (
                <table className="table">
                  <tbody>
                    {shippingMethod.rates.map((rate, rateIndex) => (
                      <tr key={rateIndex}>
                        <td>
                          <input
                            type="radio"
                            value={rate.id}
                            name='shipping_rate'
                            // checked={
                            //   false
                            // }
                            onChange={() => {
                              console.log("Selected rate:", rate.id);
                              // Handle rate selection logic here
                              checkoutContext.update({
                                selectedShippingRate: rate,
                              });
                            }}
                          />
                        </td>
                        <td colSpan={3}>
                          <div className="fw-bold">
                            {rate.label}
                          </div>
                          <div className="text-muted">
                            {rate.description || "No description available"}
                          </div>
                          <div>
                            Base Amount:{" "}
                            {rate?.currency
                              ? `${rate.currency.symbol} `
                              : ""}
                            {rate?.amount
                              ? `${rate.amount}`
                              : "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </td>
        </tr>
      )}
    </>
  );
}

export default connect(
  (state: RootState) => ({
    session: state[SESSION_STATE],
  }),
  null
)(AvailableShippingTableRow);
