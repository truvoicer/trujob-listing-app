import Loader from "@/components/Loader";
import OrderSummary from "@/components/Theme/Admin/Order/OrderSummary";
import { useContext, useEffect, useState } from "react";
import { CheckoutContext } from "../Checkout/context/CheckoutContext";

function Summary() {
 const [show, setShow] = useState(false);
    const checkoutContext = useContext(CheckoutContext);
    const order = checkoutContext.order;


    useEffect(() => {
        if (!order) {
            return;
        }
        if (!show) {
            setShow(true);
        }
    }, [order]);

    useEffect(() => {
        if (!checkoutContext.order?.id) {
            return;
        }
        checkoutContext.refresh(
            checkoutContext.order?.id,
            'orderSummary'
        );
    }, [checkoutContext.order]);
    useEffect(() => {
        if (!checkoutContext.order?.id) {
            return;
        }
        checkoutContext.refresh(
            checkoutContext.order?.id,
            'orderSummary'
        );
    }, []);
    // console.log('Order Summary', checkoutContext);
    return (
        <div className="whocares">
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
                                            editable={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                : (
                    <Loader />
                )}
        </div>
    );
}
export default Summary;