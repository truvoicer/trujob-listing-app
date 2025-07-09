import { SessionState } from "@/library/redux/reducers/session-reducer";
import ManageAddress, { Address } from "../../../../../blocks/Admin/User/Address/ManageAddress";
import React, { useContext, useEffect } from "react";
import { LocaleHelpers } from "@/helpers/LocaleHelpers";
import { MANAGE_ADDRESS_MODAL_ID } from "../Checkout/Checkout";
import { FormikProps, FormikValues } from "formik";
import { connect } from "react-redux";
import { RootState } from "@/library/redux/store";
import {
  SESSION_STATE,
  SESSION_USER,
} from "@/library/redux/constants/session-constants";
import { AppModalContext } from "@/contexts/AppModalContext";
import { CheckoutContext } from "../Checkout/context/CheckoutContext";
import AvailableShippingTable from "./AvailableShippingTable";
import OrderShippingSummary from "./OrderShippingSummary";

export type ShippingProps = {
  session: SessionState;
};
function Shipping({ session }: ShippingProps) {
  const modalContext = useContext(AppModalContext);
  const checkoutContext = useContext(CheckoutContext);
  const order = checkoutContext.order;
  const user = session[SESSION_USER];

  useEffect(() => {
    if (!user || !user.addresses || user.addresses.length === 0) {
      return;
    }
    const billing = LocaleHelpers.getDefaultAddress(user.addresses, "billing");
    const shipping = LocaleHelpers.getDefaultAddress(
      user.addresses,
      "shipping"
    );
    if (billing) {
      checkoutContext.update({ billingAddress: billing });
    }
    if (shipping) {
      checkoutContext.update({ shippingAddress: shipping });
    }
  }, [user]);

  function renderManageAddressModal(type: "billing" | "shipping") {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          modalContext.show(
            {
              title: "Add Address",
              component: ({
                formHelpers,
              }: {
                onClose: () => void;
                formHelpers: FormikProps<FormikValues>;
              }) => {
                return (
                  <ManageAddress
                    onSelect={(values: Address) => {
                      formHelpers.setValues(values);
                    }}
                  />
                );
              },
              formProps: {
                initialValues: {},
                onSubmit: (values: Address) => {
                  switch (type) {
                    case "billing":
                      checkoutContext.update({
                        billingAddress: values,
                      });
                      break;
                    case "shipping":
                      checkoutContext.update({
                        shippingAddress: values,
                      });
                      break;
                    default:
                      console.warn("Unknown address type:", type);
                      break;
                  }
                },
              },
              size: "lg",
              backdrop: "static",
              keyboard: false,
              showFooter: true,
              fullscreen: true,
              onOk: async ({
                formHelpers,
              }: {
                formHelpers: FormikProps<FormikValues>;
              }) => {
                return await formHelpers.submitForm();
              },
            },
            MANAGE_ADDRESS_MODAL_ID
          );
        }}
      >
        Add Address
      </button>
    );
  }
  function renderAddress(
    address: Address | null,
    type: "billing" | "shipping"
  ) {
    if (!address) {
      return (
        <>
          <p className="mb-0">No address provided</p>
          {renderManageAddressModal(type)}
        </>
      );
    }
    return (
      <div className="">
        <h5 className="mb-0">{address.label}</h5>
        <p className="card-description">
          {address.address_line_1}, {address.address_line_2}, {address.city},{" "}
          {address.state}, {address.postal_code}
        </p>
        <p className="card-description">{address.phone}</p>
        <p className="card-description">{address.country?.name}</p>
        {renderManageAddressModal(type)}
      </div>
    );
  }
  
  return (
    <div className="shipping-details">
      <h3 className="text-2xl font-bold mb-4">Shipping Details</h3>
      <p className="mb-4">
        Please enter your shipping address to ensure the products are delivered
        to the correct location.
      </p>
      <div className="row">
        <div className="col-lg-12">
          <div className="table-responsive-sm">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Order Date</th>
                  <th scope="col">Order ID</th>
                  <th scope="col">Billing Address</th>
                  <th scope="col">Shipping Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.created_at}</td>
                  <td>{order.id}</td>
                  <td>
                    {renderAddress(checkoutContext.billingAddress, "billing")}
                  </td>
                  <td>
                    {renderAddress(checkoutContext.shippingAddress, "shipping")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <h3 className="text-2xl font-bold mt-4">Available Shipping Methods</h3>
      <p className="mb-4">
        Please enter your shipping address to ensure the products are delivered
        to the correct location.
      </p> */}
      {/* <AvailableShippingTable /> */}
      {/* <OrderShippingSummary /> */}
    </div>
  );
}

export default connect(
  (state: RootState) => ({
    session: state[SESSION_STATE],
  }),
  null
)(Shipping);
