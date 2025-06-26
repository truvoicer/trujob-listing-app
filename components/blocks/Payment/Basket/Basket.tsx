import Loader from "@/components/Loader";
import { LocaleHelpers } from "@/helpers/LocaleHelpers";
import { SESSION_STATE, SESSION_USER } from "@/library/redux/constants/session-constants";
import { PaymentGateway } from "@/types/PaymentGateway";
import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import ManageAddress, { Address } from "../../Admin/User/Address/ManageAddress";
import { AppModalContext } from "@/contexts/AppModalContext";
import { FormikProps, FormikValues } from "formik";
import OrderSummary from "@/components/Theme/Admin/Order/OrderSummary";
import { CheckoutContext } from "../Checkout/context/CheckoutContext";
import { RootState } from "@/library/redux/store";
import { SessionState } from "@/library/redux/reducers/session-reducer";

export const MANAGE_ADDRESS_MODAL_ID = 'manage-address-modal';
export type Checkout = {
    session: SessionState;
}
function Basket({
    session,
}: Checkout) {
    const [show, setShow] = useState(false);
    const checkoutContext = useContext(CheckoutContext);
    const order = checkoutContext.order;
    const price = checkoutContext.price;
    const paymentMethod = checkoutContext.paymentMethod as PaymentGateway | null;
    

    // console.log('Checkout component rendered with:', {
    //     order,
    //     price,
    //     paymentMethod,
    //     user: session[SESSION_USER]
    // });
    const modalContext = useContext(AppModalContext);

    const user = session[SESSION_USER];

    useEffect(() => {
        if (!order || !price || !paymentMethod) {
            return;
        }
        if (!show) {
            setShow(true);
        }
    }, [order, price, paymentMethod]);


    // console.log('Billing Address:', billingAddress);
    // console.log('Shipping Address:', shippingAddress);
    // console.log('Checkout component rendered with:', show);
    return (
        <>
            {show
                ? (
                    <div className="container-fluid container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card card-block card-stretch card-height print rounded">
                                    <div className="card-header d-flex justify-content-between bg-primary header-invoice">
                                        <div className="iq-header-title">
                                            <h4 className="card-title mb-0">Order #{order.id}</h4>
                                        </div>
                                        <div className="invoice-btn">
                                            <button
                                                type="button"
                                                className="btn btn-primary-dark mr-2">
                                                <i className="las la-print"></i>
                                                Print
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary-dark">
                                                <i className="las la-file-download"></i>
                                                PDF
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        

                                        <OrderSummary 
                                            order={order}
                                            editable={true}
                                        />

                                        {/* <div className="row">
                                            <div className="col-sm-12">
                                                <b className="text-danger">Notes:</b>
                                                <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content of a page
                                                    when looking
                                                    at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,
                                                    as opposed to using 'Content here, content here', making it look like readable English.</p>
                                            </div>
                                        </div> */}
                                        {/* <div className="row mt-4 mb-3">
                                            <div className="offset-lg-8 col-lg-4">
                                                <div className="or-detail rounded">
                                                    <div className="p-3">
                                                        <h5 className="mb-3">Order Details</h5>
                                                        <div className="mb-2">
                                                            <h6>Bank</h6>
                                                            <p>Threadneedle St</p>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6>Acc. No</h6>
                                                            <p>12333456789</p>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6>Due Date</h6>
                                                            <p>12 August 2020</p>
                                                        </div>
                                                        <div className="mb-2">
                                                            <h6>Sub Total</h6>
                                                            <p>$4597.50</p>
                                                        </div>
                                                        <div>
                                                            <h6>Discount</h6>
                                                            <p>10%</p>
                                                        </div>
                                                    </div>
                                                    <div className="ttl-amt py-2 px-3 d-flex justify-content-between align-items-center">
                                                        <h6>Total</h6>
                                                        <h3 className="text-primary font-weight-700">$4137.75</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                : (
                    <Loader />
                )}
        </>
    );
}

export default connect(
    (state: RootState) => ({
        session: state[SESSION_STATE],
    }),
)(Basket);