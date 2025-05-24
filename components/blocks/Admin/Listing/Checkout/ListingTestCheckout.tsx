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

export type ListingTestCheckoutProps = {
  listingId: number;
  modalId?: string;
}
function ListingTestCheckout({
  listingId,
  modalId,
}: ListingTestCheckoutProps) {
  const [listing, setListing] = useState<any>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const modalService = new ModalService();
  const notificationContext = useContext(AppNotificationContext);
  const dataTableContext = useContext(DataTableContext);

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

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  return (
    <>
      <Stepper
        title="Listing Test Checkout"
        config={[
          {
            default: true,
            id: 'priceType',
            label: 'Price Type',
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
                  <h3>Select a price type to proceed</h3>
                  {modalService.renderLocalTriggerButton('priceType', 'Select Price', {
                    showNext
                  })}

                  {price && (
                    <div className="mt-3">
                      <h4>Price Selected:</h4>
                      <div>
                        <p><strong>Currency:</strong> {price?.currency?.name}</p>
                        <p><strong>Price Type:</strong> {price?.price_type?.name}</p>
                        <p><strong>Price:</strong> {price?.amount}</p>
                        <p><strong>Valid From:</strong> {price?.valid_from}</p>
                        <p><strong>Valid To:</strong> {price?.valid_to}</p>
                        <p><strong>Is Default:</strong> {price?.is_default ? 'Yes' : 'No'}</p>
                        <p><strong>Is Active:</strong> {price?.is_active ? 'Yes' : 'No'}</p>
                        <p><strong>Created At:</strong> {price?.created_at}</p>
                        <p><strong>Updated At:</strong> {price?.updated_at}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            },
          },
          {
            id: 'paymentGateway',
            label: 'Select Payment Method',
            beforeNext: async () => {
              const response  = await TruJobApiMiddleware.getInstance().resourceRequest({
                endpoint: UrlHelpers.urlFromArray([
                  truJobApiConfig.endpoints.order,
                  'create'
                ]),
                method: TruJobApiMiddleware.METHOD.POST,
                protectedReq: true,
                data: {
                  items: [
                    {
                      listing_id: listingId,
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
                    onSelect={(paymentMethod: any) => {
                      console.log('Payment method selected', paymentMethod);
                      // if (typeof showNext === 'function') {
                      //   showNext();
                      // }
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

              return (
                <Checkout

                />
              )
            },
          },
        ]}
      />

      {modalService.renderLocalModals()}
    </>
  );
}

export default ListingTestCheckout;