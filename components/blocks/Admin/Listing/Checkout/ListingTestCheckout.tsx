import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import Checkout from "@/components/blocks/Payment/Checkout/Checkout";
import { Dispatch, useContext, useEffect, useState } from "react";
import ManagePriceType from "../../PriceType/ManagePriceType";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { Price, PriceType } from "@/types/Price";
import Stepper, { StepActions } from "@/components/Stepper/Stepper";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { create } from "underscore";
import { title } from "process";
import ManageListingPrice from "../Price/ManageListingPrice";
import PaymentMethods from "@/components/blocks/Payment/PaymentMethods";
import { PaymentGateway } from "@/types/PaymentGateway";
import { Listing } from "@/types/Listing";
import { PaymentMethod } from "@/types/PaymentMethod";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import CheckoutProvider from "@/components/blocks/Payment/Checkout/CheckoutProvider";
import Loader from "@/components/Loader";

export type ListingTestCheckoutProps = {
  listingId: number;
  modalId?: string;
}
function ListingTestCheckout({
  listingId,
  modalId,
}: ListingTestCheckoutProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [order, setOrder] = useState<any>(null);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);
  const [orderIsBeingCreated, setOrderIsBeingCreated] = useState<boolean>(false);

  const modalService = new ModalService();
  const notificationContext = useContext(AppNotificationContext);
  const dataTableContext = useContext(DataTableContext);


  async function fetchOrder() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.order,
        order?.id
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response) {
      notificationContext.show({
        variant: 'danger',
        message: 'Failed to create order',
        title: 'Error',
      }, 'order-create-error-notification');
      return false;
    }
    return response?.data;
  }

  async function updateOrder() {
    const response = await fetchOrder();
    if (response) {
      setOrder(response);
    }
  }

  async function fetchPaymentMethod() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.paymentGateway,
        1
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response) {
      notificationContext.show({
        variant: 'danger',
        message: 'Failed to fetch payment gateways',
        title: 'Error',
      }, 'payment-gateway-fetch-error-notification');
      return;
    }
    return response?.data;
  }

  async function updatePaymentMethod() {
    const response = await fetchPaymentMethod();
    if (response) {
      setPaymentGateway(response);
    }
  }

  async function fetchListingPrice() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.listingPrice.replace(':listingId', listingId.toString()),
        1
      ]),
      method: ApiMiddleware.METHOD.GET,
      protectedReq: true,
    });

    if (!response) {
      notificationContext.show({
        variant: 'danger',
        message: 'Failed to fetch listing price',
        title: 'Error',
      }, 'listing-price-fetch-error-notification');
      return;
    }
    return response?.data;
  }

  async function updateListingPrice() {
    const response = await fetchListingPrice();
    if (response) {
      setPrice(response);
    }
  }

  async function fetchListing() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.listing,
        listingId
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response) {
      notificationContext.show({
        variant: 'danger',
        message: 'Failed to fetch listing',
        title: 'Error',
      }, 'listing-fetch-error-notification');
      return;
    }

    if (response?.data) {
      setListing(response.data);
    }

  }


  function getListingComponentProps() {
    let componentProps: any = {
      operation: 'create',
      mode: 'selector'
    };
    return componentProps;
  }

  function validateListing() {
    if (!listing) {
      notificationContext.show({
        variant: 'danger',
        message: 'Listing not found',
        title: 'Error',
      }, 'listing-not-found-notification');
      return false;
    }
    return true;
  }

  function validatePrice() {
    if (!price) {
      notificationContext.show({
        variant: 'danger',
        message: 'Please select a price type first',
        title: 'Error',
      }, 'price-type-not-selected-notification');
      return false;
    }
    return true;
  }

  function validatePaymentGateway() {
    if (!paymentGateway) {
      notificationContext.show({
        variant: 'danger',
        message: 'Please select a payment method',
        title: 'Error',
      }, 'payment-method-not-selected-notification');
      return false;
    }
    return true;
  }

  function validateQuantity() {
    if (isNaN(quantity) || quantity <= 0) {
      notificationContext.show({
        variant: 'danger',
        message: 'Quantity must be greater than 0',
        title: 'Error',
      }, 'quantity-invalid-notification');
      return false;
    }
    return true;
  }

  modalService.setUseStateHook(useState);
  modalService.setConfig([
    {
      id: 'priceType',
      title: 'Select Price Type',
      size: 'lg',
      fullscreen: true,
      component: ({
        state,
        setState,
        configItem,
      }: {
        state: LocalModal & StepActions,
        setState: Dispatch<React.SetStateAction<LocalModal>>,
        configItem: any,
      }
      ) => {

        return (
          <AccessControlComponent
          id="manage-listing-price"
            roles={[
              { name: 'admin' },
              { name: 'superuser' },
            ]}
          >
            <ManageListingPrice
              {...getListingComponentProps()}
              listingId={listingId}
              rowSelection={true}
              multiRowSelection={false}
              enableEdit={false}
              paginationMode="state"
              onChange={(priceTypes: Array<any>) => {
                if (!Array.isArray(priceTypes)) {
                  console.warn('Invalid values received from ManageUser component');
                  return;
                }

                if (priceTypes.length === 0) {
                  console.warn('Price types is empty');
                  return true;
                }
                const checked = priceTypes.filter((item) => item?.checked);
                if (checked.length === 0) {
                  console.warn('No price type selected');
                  return true;
                }
                const selected = checked[0];
                setPrice(selected);

                // if (typeof state?.props?.showNext === 'function') {
                //   state.props.showNext();
                // }
              }}
            />
          </AccessControlComponent>
        );
      },
      onOk: ({ state }: {
        state: LocalModal,
        setState: Dispatch<React.SetStateAction<LocalModal>>,
        configItem: any,
      },
        e?: React.MouseEvent | null
      ) => {
        console.log('onOk', price);
        return true;
      },
      onCancel: () => {
        return true;
      }
    },
  ]);

  async function createOrder() {
    setOrderIsBeingCreated(true);
    if (!validateListing()) {
      return false;
    }
    if (!validatePrice()) {
      return false;
    }
    if (!validatePaymentGateway()) {
      return false;
    }
    if (!validateQuantity()) {
      return false;
    }
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.order,
        'store'
      ]),
      method: TruJobApiMiddleware.METHOD.POST,
      protectedReq: true,
      data: {
        items: [
          {
            entity_type: 'listing',
            entity_id: listingId,
            price_id: price?.id,
            payment_gateway_id: paymentGateway?.id,
            quantity: quantity,
          }
        ]
      }
    });
    if (!response) {
      notificationContext.show({
        variant: 'danger',
        message: 'Failed to create order',
        title: 'Error',
      }, 'order-create-error-notification');
      return false;
    }
    setOrder(response.data);
    setOrderCreated(true);
    setOrderIsBeingCreated(false);
    return true;
  }

  useEffect(() => {
    fetchListing();
    updateListingPrice();
    updatePaymentMethod();
  }, [listingId]);

  useEffect(() => {
    if (!listing || !price || !paymentGateway || (isNaN(quantity) || quantity <= 0) || orderCreated || orderIsBeingCreated) {
      return;
    }
    createOrder();
  }, [listing, price, paymentGateway, quantity]);
  return (
    <>
      {listing &&
        price &&
       paymentGateway &&
        quantity && order
        ?
        <CheckoutProvider
          fetchOrder={async () => await fetchOrder()}
          fetchPaymentMethod={async () => await fetchPaymentMethod()}
          fetchPrice={async () => await fetchListingPrice()}
        >
          <Checkout />
        </CheckoutProvider>
        : (
          <Loader />

        )}
      {/* <Stepper
        title="Listing Test Checkout"
        config={[
          {
            default: true,
            id: 'priceType',
            label: 'Price Type',
            beforeNext: async () => {
              if (!validateListing()) {
                return false;
              }
              if (!validatePrice()) {
                return false;
              }
              if (!validateQuantity()) {
                return false;
              }
              return true;
            },
            component: ({
              nextStep,
              previousStep,
              showNext,
              showPrevious,
              showCancel,
              showFinish,
            }: StepActions) => {

              return (
                <div className="row justify-content-center align-items-center">
                  <div className="col-md-12 col-sm-12 col-12 align-self-center">
                    <div className="row">

                      <div className="col-12 col-lg-6">
                        <div className="floating-input">
                          <label className="d-block">
                            Price
                          </label>
                          {modalService.renderLocalTriggerButton('priceType', 'Select Price', {
                            showNext
                          })}

                          {price && (
                            <div className="mt-3">
                              <label className="d-block">
                                Price selected
                              </label>
                              <div className="border p-3 rounded bg-light">
                                <ul style={{ columns: 2 }} className="list-unstyled">
                                  <li><strong>Currency:</strong> {price?.currency?.name}</li>
                                  <li><strong>Price Type:</strong> {price?.price_type?.name}</li>
                                  <li><strong>Price:</strong> {price?.amount}</li>
                                  <li><strong>Valid From:</strong> {price?.valid_from}</li>
                                  <li><strong>Valid To:</strong> {price?.valid_to}</li>
                                  <li><strong>Is Default:</strong> {price?.is_default ? 'Yes' : 'No'}</li>
                                  <li><strong>Is Active:</strong> {price?.is_active ? 'Yes' : 'No'}</li>
                                  <li><strong>Created At:</strong> {price?.created_at}</li>
                                  <li><strong>Updated At:</strong> {price?.updated_at}</li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-lg-6 mt-4">
                        <div className="floating-input form-group">
                          <input
                            className="form-control"
                            type="number"
                            name="quantity"
                            id="quantity"
                            onChange={(e) => {
                              setQuantity(Number(e.target.value));
                            }}
                            value={quantity} />
                          <label className="form-label" htmlFor="quantity">
                            Quantity
                          </label>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )
            },
          },
          {
            id: 'paymentGateway',
            label: 'Select Payment Method',
            beforeNext: async () => {
              const response = await createOrder();
              if (!response) {
                return false;
              }
              return true;
            },
            component: ({
              nextStep,
              previousStep,
              showNext,
              showPrevious,
              showCancel,
              showFinish,
            }: StepActions) => {

              return (
                <div>
                  <h3>Select a payment method to proceed</h3>
                  <PaymentMethods
                    onSelect={(paymentMethod: PaymentMethod) => {
                      setPaymentGateway(paymentMethod);
                    }}
                  />
                </div>
              )
            },
          },
          {
            id: 'checkout',
            label: 'Checkout',
            component: ({
              nextStep,
              previousStep,
              showNext,
              showPrevious,
              showCancel,
              showFinish,
            }: StepActions) => {
              if (!paymentGateway) {
                return null;
              }
              if (!price) {
                return null;
              }
              return (
                <Checkout
                  order={order}
                  paymentMethod={paymentGateway}
                  price={price}
                />
              )
            },
          },
        ]}
      /> */}

      {modalService.renderLocalModals()}
    </>
  );
}

export default ListingTestCheckout;