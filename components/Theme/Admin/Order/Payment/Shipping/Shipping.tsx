import { SessionState, SessionUserState } from "@/library/redux/reducers/session-reducer";
import ManageAddress, {
  Address,
  AddressItem,
} from "../../../../../blocks/Admin/User/Address/ManageAddress";
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
import { Order } from "@/types/Order";

export type ShippingProps = {
  session: SessionState;
};
function Shipping({ session, showNext, showPrevious }: ShippingProps) {
  const modalContext = useContext(AppModalContext);
  const checkoutContext = useContext(CheckoutContext);
  const order: Order | null = checkoutContext.order;
  const user: SessionUserState = session[SESSION_USER];

  function renderManageAddressModal() {
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
                    onSelect={(values: AddressItem) => {
                      console.log("Selected address:", values);
                      formHelpers.setFieldValue(values.type, values.address);
                    }}
                  />
                );
              },
              formProps: {
                initialValues: {
                  billing: order?.billing_address || null,
                  shipping: order?.shipping_address || null,
                },
                onSubmit: (values: FormikValues) => {
                  if (!order?.id) {
                    console.error("Order ID is not available");
                    return false;
                  }
                  if (values.billing) {
                    checkoutContext.updateOrder(order.id, {
                      billing_address_id: values.billing.id,
                    });
                  }
                  if (values.shipping) {
                    checkoutContext.updateOrder(order.id, {
                      shipping_address_id: values.shipping.id,
                    });
                  }
                  return true;
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
                console.log("Form submitted with values:", formHelpers.values);
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

  function getDefaultAddressByType(type: "billing" | "shipping") {
    if (!user || !user?.addresses || !Array.isArray(user.addresses)) {
      return null;
    }
    const userAddresses: Address[] = user.addresses;
    const defaultAddress: Address | undefined = userAddresses.find(
      (address: Address) => address?.type === type && address.is_default
    );
    return defaultAddress || null;
  }


  useEffect(() => {
    if (!order) {
      return;
    }
    // Check if both shipping and billing addresses are set
    if (!order?.shipping_address || !order?.billing_address) {
      return;
    }
    // If both addresses are set, we can enable the next button
    showNext();
  }, [order?.billing_address, order?.shipping_address]);

  useEffect(() => {
    if (!order) {
      return;
    }

    if (!order?.shipping_address) {
      checkoutContext.updateOrder(order.id, {
        shipping_address_id: getDefaultAddressByType("shipping")?.id,
      });
    }
    if (!order?.billing_address) {
      checkoutContext.updateOrder(order.id, {
        billing_address_id: getDefaultAddressByType("billing")?.id,
      });
    }
  }, []);

  return (
    <>
      {order ? (
        <div className="shipping-details">
          <h3 className="text-2xl font-bold mb-4">Shipping Details</h3>
          <p className="mb-4">
            Please enter your shipping address to ensure the products are
            delivered to the correct location.
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
                        {renderAddress(order?.billing_address, "billing")}
                      </td>
                      <td>
                        {renderAddress(order?.shipping_address, "shipping")}
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
      ) : (
        <div className="text-center">
          <p className="text-muted">No order details available.</p>
        </div>
      )}
    </>
  );
}

export default connect(
  (state: RootState) => ({
    session: state[SESSION_STATE],
  }),
  null
)(Shipping);
