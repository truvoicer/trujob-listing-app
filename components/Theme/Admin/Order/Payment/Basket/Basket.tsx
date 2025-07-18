import Loader from "@/components/Loader";
import { SESSION_STATE, SESSION_USER } from "@/library/redux/constants/session-constants";
import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppModalContext } from "@/contexts/AppModalContext";
import OrderSummary from "@/components/Theme/Admin/Order/Summary/OrderSummary";
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


    useEffect(() => {
        if (!order) {
            return;
        }
        if (!show) {
            setShow(true);
        }
    }, [order]);

    return (
        <div className="whatever">
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

export default connect(
    (state: RootState) => ({
        session: state[SESSION_STATE],
    }),
)(Basket);