import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import Checkout from "@/components/Theme/Admin/Order/Payment/Checkout/Checkout";
import { Dispatch, useContext, useEffect, useState } from "react";
import ManagePriceType from "../../PriceType/ManagePriceType";
import {
  LocalModal,
  ModalService,
} from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { Price, PriceType } from "@/types/Price";
import Stepper, { StepActions } from "@/components/Stepper/Stepper";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { create } from "underscore";
import { title } from "process";
import ManageProductPrice from "../Price/ManageProductPrice";
import PaymentMethods from "@/components/blocks/Payment/PaymentMethods";
import { PaymentGateway } from "@/types/PaymentGateway";
import { Product } from "@/types/Product";
import { PaymentMethod } from "@/types/PaymentMethod";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import CheckoutProvider from "@/components/Theme/Admin/Order/Payment/Checkout/CheckoutProvider";
import Loader from "@/components/Loader";
import PaymentProcess from "@/components/Theme/Admin/Order/Payment/PaymentProcess";

export type ProductTestCheckoutProps = {
  productId: number;
  modalId?: string;
};
function ProductTestCheckout({ productId, modalId }: ProductTestCheckoutProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [order, setOrder] = useState<any>(null);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);
  const [orderIsBeingCreated, setOrderIsBeingCreated] =
    useState<boolean>(false);

  const modalService = new ModalService();
  const notificationContext = useContext(AppNotificationContext);
  const dataTableContext = useContext(DataTableContext);

  async function fetchOrder() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.order,
        order?.id,
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Failed to create order",
          title: "Error",
        },
        "order-create-error-notification"
      );
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

  async function fetchAvailablePaymentGateways() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.sitePaymentGateway,
        'available',
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Failed to fetch payment gateways",
          title: "Error",
        },
        "payment-gateway-fetch-error-notification"
      );
      return;
    }
    return response?.data;
  }

  async function updatePaymentMethod() {
    const response = await fetchAvailablePaymentGateways();
    if (response) {
      setPaymentGateway(response);
    }
  }

  async function fetchProductPrice() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.productPrice.replace(
          ":productId",
          productId.toString()
        ),
        1,
      ]),
      method: ApiMiddleware.METHOD.GET,
      protectedReq: true,
    });

    if (!response) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Failed to fetch product price",
          title: "Error",
        },
        "product-price-fetch-error-notification"
      );
      return;
    }
    return response?.data;
  }

  async function updateProductPrice() {
    const response = await fetchProductPrice();
    if (response) {
      setPrice(response);
    }
  }

  async function fetchProduct() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        truJobApiConfig.endpoints.product,
        productId,
      ]),
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    if (!response) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Failed to fetch product",
          title: "Error",
        },
        "product-fetch-error-notification"
      );
      return;
    }

    if (response?.data) {
      setProduct(response.data);
    }
  }

  function getProductComponentProps() {
    let componentProps: any = {
      operation: "create",
      mode: "selector",
    };
    return componentProps;
  }

  function validateProduct() {
    if (!product) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Product not found",
          title: "Error",
        },
        "product-not-found-notification"
      );
      return false;
    }
    return true;
  }

  function validatePrice() {
    if (!price) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Please select a price type first",
          title: "Error",
        },
        "price-type-not-selected-notification"
      );
      return false;
    }
    return true;
  }

  function validatePaymentGateway() {
    if (!paymentGateway) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Please select a payment method",
          title: "Error",
        },
        "payment-method-not-selected-notification"
      );
      return false;
    }
    return true;
  }

  function validateQuantity() {
    if (isNaN(quantity) || quantity <= 0) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Quantity must be greater than 0",
          title: "Error",
        },
        "quantity-invalid-notification"
      );
      return false;
    }
    return true;
  }

  modalService.setUseStateHook(useState);
  modalService.setConfig([
    {
      id: "priceType",
      title: "Select Price Type",
      size: "lg",
      fullscreen: true,
      component: ({
        state,
        setState,
        configItem,
      }: {
        state: LocalModal & StepActions;
        setState: Dispatch<React.SetStateAction<LocalModal>>;
        configItem: any;
      }) => {
        return (
          <AccessControlComponent
            id="manage-product-price"
            roles={[{ name: "admin" }, { name: "superuser" }]}
          >
            <ManageProductPrice
              {...getProductComponentProps()}
              productId={productId}
              rowSelection={true}
              multiRowSelection={false}
              enableEdit={false}
              paginationMode="state"
              onChange={(priceTypes: Array<any>) => {
                if (!Array.isArray(priceTypes)) {
                  console.warn(
                    "Invalid values received from ManageUser component"
                  );
                  return;
                }

                if (priceTypes.length === 0) {
                  console.warn("Price types is empty");
                  return true;
                }
                const checked = priceTypes.filter((item) => item?.checked);
                if (checked.length === 0) {
                  console.warn("No price type selected");
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
      onOk: (
        {
          state,
        }: {
          state: LocalModal;
          setState: Dispatch<React.SetStateAction<LocalModal>>;
          configItem: any;
        },
        e?: React.MouseEvent | null
      ) => {
        console.log("onOk", price);
        return true;
      },
      onCancel: () => {
        return true;
      },
    },
  ]);

  async function createOrder() {
    setOrderIsBeingCreated(true);
    if (!validateProduct()) {
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
        "store",
      ]),
      method: TruJobApiMiddleware.METHOD.POST,
      protectedReq: true,
      data: {
        items: [
          {
            entity_type: "product",
            entity_id: productId,
            price_id: price?.id,
            payment_gateway_id: paymentGateway?.id,
            quantity: quantity,
          },
        ],
      },
    });
    if (!response) {
      notificationContext.show(
        {
          variant: "danger",
          message: "Failed to create order",
          title: "Error",
        },
        "order-create-error-notification"
      );
      return false;
    }
    setOrder(response.data);
    setOrderCreated(true);
    setOrderIsBeingCreated(false);
    return true;
  }

  useEffect(() => {
    fetchProduct();
    updateProductPrice();
    updatePaymentMethod();
  }, [productId]);

  useEffect(() => {
    if (
      !product ||
      !price ||
      !paymentGateway ||
      isNaN(quantity) ||
      quantity <= 0 ||
      orderCreated ||
      orderIsBeingCreated
    ) {
      return;
    }
    createOrder();
  }, [product, price, paymentGateway, quantity]);
  return (
    <>
      {product && price && paymentGateway && quantity && order ? (
        <Checkout 
          fetchOrder={async () => await fetchOrder()}
          fetchAvailablePaymentGateways={async () => await fetchAvailablePaymentGateways()}
          fetchPrice={async () => await fetchProductPrice()}
        >
          <PaymentProcess />
          </Checkout>
      ) : (
        <Loader />
      )}
      {/* <Stepper
        title="Product Test Checkout"
        config={[
          {
            default: true,
            id: 'priceType',
            label: 'Price Type',
            beforeNext: async () => {
              if (!validateProduct()) {
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
                        <TextInput
                            value={values?.quantity || 0}
                            onChange={(e) => {
                              setQuantity(Number(e.target.value));
                            }}
                            placeholder="Enter quantity"
                            type="number"
                            name="quantity"
                            label="Quantity"
                        />
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

export default ProductTestCheckout;
