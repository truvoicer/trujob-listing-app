import truJobApiConfig from "@/config/api/truJobApiConfig";
import { AppModalContext } from "@/contexts/AppModalContext";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { isObjectEmpty, uCaseFirst } from "@/helpers/utils";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Country } from "@/types/Country";
import { User } from "@/types/User";
import { useContext, useEffect, useState } from "react";
import EditAddress from "./EditAddress";
import { FormikProps, FormikValues, isObject } from "formik";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ModalItem } from "@/library/services/modal/ModalService";
import IntegrationCardContainer from "@/components/Elements/IntegrationCardContainer";

export const ADDRESS_FETCH_ERROR_NOTIFICATION_ID =
  "address-fetch-error-notification";
export const ADDRESS_CREATE_ERROR_NOTIFICATION_ID =
  "address-create-error-notification";
export const ADDRESS_UPDATE_ERROR_NOTIFICATION_ID =
  "address-update-error-notification";
export const ADDRESS_DELETE_ERROR_NOTIFICATION_ID =
  "address-delete-error-notification";
export const ADDRESS_CREATE_SUCCESS_NOTIFICATION_ID =
  "address-create-success-notification";
export const ADDRESS_UPDATE_SUCCESS_NOTIFICATION_ID =
  "address-update-success-notification";
export const ADDRESS_DELETE_SUCCESS_NOTIFICATION_ID =
  "address-delete-success-notification";
export const CREATE_ADDRESS_MODAL_ID = "create-address-modal";
export const UPDATE_ADDRESS_MODAL_ID = "update-address-modal";
export const DELETE_ADDRESS_MODAL_ID = "delete-address-modal";
export const MANAGE_ADDRESS_MODAL_ID = "manage-address-modal";

export type AddressItem = {
  address: Address;
  type: AddressType;
};
export type AddressType = "billing" | "shipping";
export type Address = {
  id: number;
  label: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  country: Country;
  user: User;
  type: AddressType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};
export type AddressRequestData = {
  label?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  country_id?: number;
  type?: AddressType;
  is_default?: boolean;
};
export interface CreateAddress extends AddressRequestData {
  label: string;
  address_line_1: string;
  city: string;
  postal_code: string;
  phone: string;
  country_id: number;
  type: AddressType;
}
export interface UpdateAddress extends AddressRequestData {}

export type ManageAddress = {
  mode?: "selector" | "manager";
  onSelect?: (address: Address) => void;
};
function ManageAddress({ mode = "selector", onSelect }: ManageAddress) {
  const [billingAddresses, setBillingAddresses] = useState<Address[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(null);

  const notificationContext = useContext(AppNotificationContext);
  const modalContext = useContext(AppModalContext);

  async function addressRequest(type: string) {
    if (!type) {
      console.error("Address type is required");
      return;
    }
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: truJobApiConfig.endpoints.address,
      method: TruJobApiMiddleware.METHOD.GET,
      protectedReq: true,
      query: {
        type,
      },
    });

    if (!response) {
      notificationContext.show(
        {
          title: "Error",
          message: "Error fetching addresses",
          variant: "error",
        },
        ADDRESS_FETCH_ERROR_NOTIFICATION_ID
      );
      return;
    }
    if (!Array.isArray(response?.data)) {
      notificationContext.show(
        {
          title: "Error",
          message: "Error fetching addresses",
          variant: "error",
        },
        ADDRESS_FETCH_ERROR_NOTIFICATION_ID
      );
      return;
    }
    return response?.data;
  }

  async function fetchAddresses() {
    const billingAddressesRequest = await addressRequest("billing");
    const shippingAddressesRequest = await addressRequest("shipping");
    if (billingAddressesRequest) {
      setBillingAddresses(billingAddressesRequest);
    }
    if (shippingAddressesRequest) {
      setShippingAddresses(shippingAddressesRequest);
    }
  }

  function handleEditAddress(
    e: React.MouseEvent,
    item: Address,
    type: "billing" | "shipping"
  ) {
    e.preventDefault();
    modalContext.show(
      {
        title: "Edit Address",
        component: (
          <EditAddress
            type={type}
            data={item}
            operation={"edit"}
            inModal={true}
            modalId={UPDATE_ADDRESS_MODAL_ID}
            fetchAddresses={fetchAddresses}
          />
        ),
        size: "lg",
        formProps: {
          initialValues: { ...item },
        },
        onClose: () => {
          fetchAddresses();
        },
        onOk: async ({
          formHelpers,
        }: {
          formHelpers?: FormikProps<FormikValues>;
        }) => {
          if (!formHelpers) {
            return;
          }

          return await formHelpers.submitForm();
        },
      },
      UPDATE_ADDRESS_MODAL_ID
    );
  }
  function handleCreateAddress(
    e: React.MouseEvent,
    type: "billing" | "shipping"
  ) {
    e.preventDefault();
    modalContext.show(
      {
        title: "Create Address",
        component: (
          <EditAddress
            type={type}
            operation={"create"}
            inModal={true}
            modalId={CREATE_ADDRESS_MODAL_ID}
            fetchAddresses={fetchAddresses}
          />
        ),
        size: "lg",
        formProps: {
          initialValues: {},
        },
        onClose: () => {
          fetchAddresses();
        },
        onOk: async ({
          formHelpers,
        }: {
          formHelpers?: FormikProps<FormikValues>;
        }) => {
          if (!formHelpers) {
            return;
          }

          return await formHelpers.submitForm();
        },
      },
      CREATE_ADDRESS_MODAL_ID
    );
  }
  function handleUpdateAddress({
    e,
    message = "Are you sure you want to update this address?",
    modalProps = {},
    item,
    data,
  }: {
    e: React.MouseEvent;
    modalProps: ModalItem;
    message: string;
    item: Address;
    data: UpdateAddress;
  }) {
    e.preventDefault();
    if (!isObject(data) || isObjectEmpty(data)) {
      console.error("Address data is required for update");
      return;
    }

    modalContext.show(
      {
        component: (
          <div>
            <h5>{message || ""}</h5>
            <p>{item.label}</p>
          </div>
        ),
        onOk: async () => {
          const response =
            await TruJobApiMiddleware.getInstance().resourceRequest({
              endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.address,
                item.id,
                "update",
              ]),
              method: TruJobApiMiddleware.METHOD.PATCH,
              protectedReq: true,
              data,
            });
          if (!response) {
            notificationContext.show(
              {
                title: "Error",
                message: "Error setting address as default",
                variant: "error",
              },
              ADDRESS_UPDATE_ERROR_NOTIFICATION_ID
            );
            return;
          }
          notificationContext.show(
            {
              title: "Success",
              message: "Address set as default successfully",
              variant: "success",
            },
            ADDRESS_UPDATE_SUCCESS_NOTIFICATION_ID
          );
          fetchAddresses();
        },
        ...modalProps,
      },
      DELETE_ADDRESS_MODAL_ID
    );
  }
  function handleDeleteAddress(
    e: React.MouseEvent,
    item: Address,
    type: "billing" | "shipping"
  ) {
    e.preventDefault();
    modalContext.show(
      {
        title: "Delete Address",
        component: (
          <div>
            <h5>Are you sure you want to delete this address?</h5>
            <p>{item.label}</p>
          </div>
        ),
        size: "sm",
        onOk: async () => {
          const response =
            await TruJobApiMiddleware.getInstance().resourceRequest({
              endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.address,
                item.id,
                "delete",
              ]),
              method: TruJobApiMiddleware.METHOD.DELETE,
              protectedReq: true,
            });
          if (!response) {
            notificationContext.show(
              {
                title: "Error",
                message: "Error deleting address",
                variant: "error",
              },
              ADDRESS_DELETE_ERROR_NOTIFICATION_ID
            );
            return;
          }
          notificationContext.show(
            {
              title: "Success",
              message: "Address deleted successfully",
              variant: "success",
            },
            ADDRESS_DELETE_SUCCESS_NOTIFICATION_ID
          );
          fetchAddresses();
        },
      },
      DELETE_ADDRESS_MODAL_ID
    );
  }
  function handleSelectAddress(
    e: React.MouseEvent,
    item: Address,
    type: "billing" | "shipping"
  ) {
    e.preventDefault();
    if (mode !== "selector") {
      return;
    }
    setSelectedAddress({
      address: item,
      type,
    });
    if (!item?.is_default) {
      handleUpdateAddress({
        e,
        modalProps: {
          title: "Set Default Address",
          size: "lg",
          fullscreen: undefined,
          showFooter: true,
        },
        message: "Do you want to set this address as default?",
        item,
        data: {
          is_default: true,
        },
      });
    }
  }
  function renderAddressGroup(
    addresses: Address[],
    type: "billing" | "shipping"
  ) {
    return (
      <>
        <div className="col-lg-12">
          <div className="card card-block card-stretch">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <h6 className="mb-3 mb-md-0">{uCaseFirst(type)} Addresses</h6>
              </div>
            </div>
          </div>
        </div>
        {addresses.map((address, index) => {
          const isSelected = selectedAddress?.address?.id === address.id;
          return (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div
                className="card card-block card-stretch card-height cursor-pointer"
                onClick={(e) => handleSelectAddress(e, address, type)}
              >
                <IntegrationCardContainer isSelected={isSelected}>
                  <h5 className="mb-2">{address.label}</h5>
                  <p className="card-description">
                    {address.address_line_1}, {address.address_line_2},{" "}
                    {address.city}, {address.state}, {address.postal_code}
                  </p>
                  <p className="card-description">{address.phone}</p>
                  <p className="card-description">{address.country?.name}</p>
                  <div className="pt-3 d-flex justify-content-between">
                    {!address.is_default && (
                      <button
                        className="btn btn-info mr-3 px-4 btn-calendify"
                        onClick={(e) =>
                          handleUpdateAddress({
                            e,
                            modalProps: {
                              title: "Set Default Address",
                              size: "lg",
                              fullscreen: undefined,
                              showFooter: true,
                            },
                            message:
                              "Are you sure you want to set this address as default?",
                            item: address,
                            data: {
                              is_default: true,
                            },
                          })
                        }
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      className="btn btn-info mr-3 px-4 btn-calendify"
                      onClick={(e) => handleEditAddress(e, address, type)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger px-4 btn-calendify"
                      onClick={(e) => handleDeleteAddress(e, address, type)}
                    >
                      Delete
                    </button>
                  </div>
                </IntegrationCardContainer>
              </div>
            </div>
          );
        })}
        <div className="col-xl-3 col-lg-4 col-md-6">
          <div className="card card-block card-stretch card-height cursor-pointer">
            <div
              className="card-body rounded work-detail work-detail-info d-flex flex-column justify-content-center align-items-center"
              onClick={(e) => handleCreateAddress(e, type)}
            >
              <div className="icon iq-icon-box-2 mb-4 rounded">
                <i className="fab fa-chrome"></i>
              </div>
              <h5 className="mb-2">Add New {uCaseFirst(type)} Address</h5>
            </div>
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    fetchAddresses();
  }, []);
  useEffect(() => {
    if (mode === "selector" && selectedAddress && selectedAddress?.address) {
      if (typeof onSelect === "function") {
        onSelect(selectedAddress);
      }
    }
  }, [selectedAddress, mode]);
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="py-4 border-bottom">
            <div className="form-title text-center">
              <h3>Manage Addresses</h3>
            </div>
          </div>
        </div>

        {renderAddressGroup(billingAddresses, "billing")}
        {renderAddressGroup(shippingAddresses, "shipping")}
      </div>
    </div>
  );
}
export default ManageAddress;
