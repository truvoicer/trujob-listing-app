import Loader from "@/components/Loader";
import { LocaleHelpers } from "@/helpers/LocaleHelpers";
import { SESSION_STATE, SESSION_USER } from "@/library/redux/constants/session-constants";
import { PaymentGateway } from "@/types/PaymentGateway";
import { Price } from "@/types/Price";
import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import ManageAddress, { Address } from "../../Admin/User/Address/ManageAddress";
import { AppModalContext } from "@/contexts/AppModalContext";
import { initial } from "underscore";
import { FormikProps, FormikValues } from "formik";
import OrderSummary from "@/components/Theme/Admin/Order/OrderSummary";
import { CheckoutContext } from "./context/CheckoutContext";

export const MANAGE_ADDRESS_MODAL_ID = 'manage-address-modal';
export type Checkout = {
    order: any;
    price: Price;
    paymentMethod: PaymentGateway;
    session: any;
}
function Checkout({
    order,
    price,
    paymentMethod,
    session,
}: Checkout) {
    const [show, setShow] = useState(false);
    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

    const checkoutContext = useContext(CheckoutContext);

    useEffect(() => {
        checkoutContext.update({
            order,
            price,
            paymentMethod,
        });
    }, [order, price, paymentMethod]);
    // console.log('Checkout component rendered with:', {
    //     order,
    //     price,
    //     paymentMethod,
    //     user: session[SESSION_USER]
    // });
    const modalContext = useContext(AppModalContext);

    const user = session[SESSION_USER];

    function renderManageAddressModal(type: 'billing' | 'shipping') {
        return (
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                    modalContext.show({
                        title: 'Add Address',
                        component: ({
                            formHelpers
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
                                    case 'billing':
                                        setBillingAddress(values);
                                        break;
                                    case 'shipping':
                                        setShippingAddress(values);
                                        break;
                                    default:
                                        console.warn('Unknown address type:', type);
                                        break;
                                }
                            }
                        },
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: false,
                        showFooter: true,
                        fullscreen: true,
                        onOk: async ({ formHelpers }: { formHelpers: FormikProps<FormikValues> }) => {
                            return await formHelpers.submitForm();
                        }
                    }, MANAGE_ADDRESS_MODAL_ID);
                }}>
                Add Address
            </button>
        );
    }
    function renderAddress(address: Address | null, type: 'billing' | 'shipping') {
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
                <h5 className="mb-0">
                    {address.label}
                </h5>
                <p className="card-description">
                    {address.address_line_1}, {address.address_line_2}, {address.city}, {address.state}, {address.postal_code}
                </p>
                <p className="card-description">
                    {address.phone}
                </p>
                <p className="card-description">
                    {address.country?.name}
                </p>
                {renderManageAddressModal(type)}
            </div>
        );
    }
    useEffect(() => {
        if (!order || !price || !paymentMethod) {
            return;
        }
        if (!show) {
            setShow(true);
        }
    }, [order, price, paymentMethod]);

    useEffect(() => {
        if (!user || !user.addresses || user.addresses.length === 0) {
            return;
        }
        const billing = LocaleHelpers.getDefaultAddress(user.addresses, 'billing');
        const shipping = LocaleHelpers.getDefaultAddress(user.addresses, 'shipping');
        if (billing) {
            setBillingAddress(billing);
        }
        if (shipping) {
            setShippingAddress(shipping);
        }
    }, [user]);

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
                                                                    {renderAddress(billingAddress, 'billing')}
                                                                </td>
                                                                <td>
                                                                    {renderAddress(shippingAddress, 'shipping')}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <OrderSummary 
                                            order={order}
                                            editable={true}
                                        />

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <b className="text-danger">Notes:</b>
                                                <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content of a page
                                                    when looking
                                                    at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,
                                                    as opposed to using 'Content here, content here', making it look like readable English.</p>
                                            </div>
                                        </div>
                                        <div className="row mt-4 mb-3">
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
                                        </div>
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
    (state: any) => ({
        session: state[SESSION_STATE],
    }),
)(Checkout);