import { Dispatch, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import {
  LocalModal,
  ModalService,
} from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import CurrencyPriceInput from "@/components/blocks/Locale/Currency/CurrencyPriceInput";
import ManagePriceType from "../../PriceType/ManagePriceType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import DateTimePicker from "@/components/Date/DateTimePicker";
import { SITE_STATE } from "@/library/redux/constants/site-constants";
import { connect } from "react-redux";
import {
  getSiteCountryAction,
  getSiteCurrencyAction,
} from "@/library/redux/actions/site-actions";
import moment from "moment";
import ManageUser from "../../User/ManageUser";
import { PriceType } from "@/types/Price";
import { User } from "@/types/User";
import Checkbox from "@/components/Elements/Checkbox";
import ManageTaxRate from "../../Tax/TaxRate/ManageTaxRate";
import { TaxRate } from "@/types/Tax";
import SelectedDisplay from "@/components/Elements/SelectedDisplay";
import SelectedListDisplay from "@/components/Elements/SelectedListDisplay";
import { Discount } from "@/types/Discount";
import ManageDiscount from "../../Discount/ManageDiscount";
import { Button } from "react-bootstrap";
import { findInObject, replaceInObject } from "@/helpers/utils";
import SelectSubscriptionIntervalUnit from "./SelectSubscriptionIntervalUnit";
import SelectSubscriptionTenureType from "./SelectSubscriptionTenureType";
import { LocaleService } from "@/library/services/locale/LocaleService";

export type EditProductPriceFields = {
  operation: "edit" | "update" | "add" | "create";
  site: any;
};
function EditProductPriceFields({ operation, site }: EditProductPriceFields) {
  const modalService = new ModalService();

  const { values, handleChange, setFieldValue } =
    useFormikContext<FormikValues>() || {};

  const country = getSiteCountryAction();
  function getProductComponentProps() {
    let componentProps: any = {
      operation: "create",
      mode: "selector",
      isChild: true,
    };
    if (values?.id) {
      componentProps.productId = values.id;
      componentProps.operation = "edit";
    }
    return componentProps;
  }

  modalService.setUseStateHook(useState);
  modalService.setConfig([
    {
      id: "user",
      title: "Select User",
      size: "lg",
      fullscreen: true,
      component: (
        <AccessControlComponent
          id="edit-product-price-fields-user"
          roles={[{ name: "admin" }, { name: "superuser" }]}
        >
          <ManageUser
            {...getProductComponentProps()}
            fixSessionUser={true}
            values={values?.created_by_user ? [values?.created_by_user] : []}
            rowSelection={true}
            multiRowSelection={false}
            enableEdit={false}
            paginationMode="state"
            onChange={(users: Array<any>) => {
              if (!Array.isArray(users)) {
                console.warn(
                  "Invalid values received from ManageUser component"
                );
                return;
              }

              if (users.length === 0) {
                console.warn("Users is empty");
                return true;
              }
              const checked = users.filter((item) => item?.checked);
              if (checked.length === 0) {
                console.warn("No user selected");
                return true;
              }
              const selectedUser = checked[0];

              setFieldValue("created_by_user", selectedUser);
            }}
          />
        </AccessControlComponent>
      ),
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
        return true;
      },
      onCancel: () => {
        return true;
      },
    },
    {
      id: "Type",
      title: "Select Type",
      size: "lg",
      fullscreen: true,
      component: (
        <AccessControlComponent
          id="edit-product-price-fields-type"
          roles={[{ name: "admin" }, { name: "superuser" }]}
        >
          <ManagePriceType
            {...getProductComponentProps()}
            values={values?.price_type ? [values?.price_type] : []}
            rowSelection={true}
            multiRowSelection={false}
            enableEdit={false}
            paginationMode="state"
            onChange={(priceTypes: Array<any>) => {
              if (!Array.isArray(priceTypes)) {
                console.warn(
                  "Invalid values received from ManagePriceType component"
                );
                return;
              }

              if (priceTypes.length === 0) {
                console.warn("Price type is empty");
                return true;
              }
              const checked = priceTypes.filter((item) => item?.checked);
              if (checked.length === 0) {
                console.warn("No price type selected");
                return true;
              }

              const selected = checked[0];

              if (values?.id) {
                return;
              }
              setFieldValue("price_type", selected);
            }}
          />
        </AccessControlComponent>
      ),
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
        return true;
      },
      onCancel: () => {
        return true;
      },
    },
    {
      id: "tax-rates",
      title: "Select Tax Rates",
      size: "lg",
      fullscreen: true,
      component: (
        <AccessControlComponent
          id="edit-product-price-fields-tax-rates"
          roles={[{ name: "admin" }, { name: "superuser" }]}
        >
          <ManageTaxRate
            {...getProductComponentProps()}
            values={values?.tax_rates ? [values?.tax_rates] : []}
            rowSelection={true}
            multiRowSelection={true}
            enableEdit={true}
            paginationMode="state"
            onChange={(taxRates: Array<any>) => {
              if (!Array.isArray(taxRates)) {
                console.warn(
                  "Invalid values received from ManageTaxRate component"
                );
                return;
              }

              if (taxRates.length === 0) {
                console.warn("Tax rates are empty");
                return true;
              }
              const checked = taxRates.filter((item) => item?.checked);
              if (checked.length === 0) {
                console.warn("No tax rate selected");
                return true;
              }

              const existingTaxRates = values?.tax_rates || [];

              // Merge existing products with new prices not already included
              const mergedProducts = [
                ...existingTaxRates,
                ...checked.filter((taxRate: TaxRate) => {
                  return !existingTaxRates.some(
                    (existingTaxRate: { id: number }) =>
                      existingTaxRate.id === taxRate.id
                  );
                }),
              ];
              setFieldValue("tax_rates", mergedProducts);
            }}
          />
        </AccessControlComponent>
      ),
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
        return true;
      },
      onCancel: () => {
        return true;
      },
    },
    {
      id: "discounts",
      title: "Select Discounts",
      size: "lg",
      fullscreen: true,
      component: (
        <AccessControlComponent
          id="edit-product-price-fields-discounts"
          roles={[{ name: "admin" }, { name: "superuser" }]}
        >
          <ManageDiscount
            {...getProductComponentProps()}
            values={values?.discounts ? [values?.discounts] : []}
            rowSelection={true}
            multiRowSelection={true}
            enableEdit={true}
            paginationMode="state"
            onChange={(discounts: Array<any>) => {
              if (!Array.isArray(discounts)) {
                console.warn(
                  "Invalid values received from ManageDiscount component"
                );
                return;
              }

              if (discounts.length === 0) {
                console.warn("Discounts are empty");
                return true;
              }
              const checked = discounts.filter((item) => item?.checked);
              if (checked.length === 0) {
                console.warn("No discount selected");
                return true;
              }

              const existingDiscounts = values?.discounts || [];

              // Merge existing products with new prices not already included
              const mergedDiscounts = [
                ...existingDiscounts,
                ...checked.filter((discount: Discount) => {
                  return !existingDiscounts.some(
                    (existingDiscount: { id: number }) =>
                      existingDiscount.id === discount.id
                  );
                }),
              ];
              setFieldValue("discounts", mergedDiscounts);
            }}
          />
        </AccessControlComponent>
      ),
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
        return true;
      },
      onCancel: () => {
        return true;
      },
    },
  ]);

  function getCountrySelectValue() {
    if (!values?.country) {
      return {
        value: country?.id,
        label: country?.name,
      };
    }
    return {
      value: values?.country?.id,
      label: values?.country?.name,
    };
  }
  function updateItem(index: number, key: string, value: string | number) {
    const items = [...(values?.items || [])];
    if (index < 0 || index >= items.length) {
      console.warn("Index out of bounds for items array");
      return;
    }
    if (key.includes(".")) {
        const currentItem = items[index];
        const replace  = replaceInObject(currentItem, key, value);
        if (!replace) {
          console.warn("Failed to replace value in item", currentItem);
          return;
        }
        items[index] = replace;
        setFieldValue("items", items);
      return;
    }
    items[index] = {
      ...items[index],
      [key]: value,
    };
    setFieldValue("items", items);
  }

  function addSubscriptionItem(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const items = [...(values?.items || [])];
    items.push({
      frequency: {
        interval_unit: "",
        interval_count: 0,
      },
      tenure_type: "",
      sequence: 0,
      total_cycles: 0,
      price: {
        value: "",
        currency: values?.currency || getSiteCurrencyAction(),
      },
    });
    setFieldValue("items", items);
  }
  const countrySelectValue = getCountrySelectValue();
  const defaultCurrency = LocaleService.getCurrency();

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
            <div className="col-12">
              <h2 className="h5 mt-5">Price Details</h2>
            </div>
          <div className="col-12 col-md-6 mt-3">
            <div className="floating-input">
              <SelectedDisplay
                label="Price Type"
                data={values?.price_type}
                render={(priceType: Record<string, any>) => (
                  <>{priceType?.label}</>
                )}
              />
              {modalService.renderLocalTriggerButton("Type", "Select Type")}
            </div>
          </div>

          <AccessControlComponent
            id="edit-product-price-fields-user"
            roles={[{ name: "admin" }, { name: "superuser" }]}
          >
            <div className="col-12 col-md-6 mt-3">
              <div className="floating-input">
                <SelectedDisplay
                  label="Created By"
                  data={values?.created_by_user}
                  render={(createdByUser: Record<string, any>) => (
                    <>
                      {createdByUser?.first_name} {createdByUser?.last_name} (
                      {createdByUser?.email})
                    </>
                  )}
                />
                {modalService.renderLocalTriggerButton("user", "Select User")}
              </div>
            </div>
          </AccessControlComponent>

          <div className="col-12 col-md-6 mt-3">
            <div className="floating-input">
              <SelectedListDisplay
                label="Tax Rates"
                data={values?.tax_rates || []}
                render={(taxRate: Record<string, any>) =>
                  taxRate.name || "No Tax Rates Selected"
                }
              />

              {modalService.renderLocalTriggerButton(
                "tax-rates",
                "Select Tax Rates"
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <div className="floating-input">
              <SelectedListDisplay
                label="Discounts"
                data={values?.discounts || []}
                render={(discount: Record<string, any>) =>
                  discount.name || "No Discounts Selected"
                }
              />

              {modalService.renderLocalTriggerButton(
                "discounts",
                "Select Discounts"
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <div className="floating-input form-group">
              <DateTimePicker
                label="Valid From"
                value={
                  moment(values?.valid_from).isValid()
                    ? moment(values?.valid_from).toDate()
                    : ""
                }
                onChange={(value) => {
                  setFieldValue("valid_from", value);
                }}
                onSelect={(value) => {
                  setFieldValue("valid_from", value);
                }}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <div className="floating-input form-group">
              <DateTimePicker
                label="Valid To"
                value={
                  moment(values?.valid_to).isValid()
                    ? moment(values?.valid_to).toDate()
                    : ""
                }
                onChange={(value) => {
                  setFieldValue("valid_to", value);
                }}
                onSelect={(value) => {
                  setFieldValue("valid_to", value);
                }}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <Checkbox
              name={"is_active"}
              placeholder="Is Active?"
              label="Is Active?"
              onChange={handleChange}
              value={values?.is_active || false}
            />
          </div>

          {values?.price_type?.name === "one_time" && (
            <div className="col-12 col-md-6">
              <div className="floating-input">
                <label className="fw-bold" htmlFor="amount">
                  Amount
                </label>
                <CurrencyPriceInput
                  amountValue={values?.amount || ""}
                  currencyValue={
                    values?.currency
                      ? values?.currency
                      : defaultCurrency
                  }
                  onAmountChange={(value) => {
                    setFieldValue("amount", value);
                  }}
                  onCurrencyChange={(value) => {
                    setFieldValue("currency", value);
                  }}
                />
              </div>
            </div>
          )}

          <div className="col-12 col-md-6 mt-2">
            <div className="floating-input">
              <label className="fw-bold" htmlFor="country">
                Country
              </label>
              <CountrySelect
                value={countrySelectValue}
                isMulti={false}
                showLoadingSpinner={true}
                onChange={(value) => {
                  setFieldValue("country", value);
                }}
                loadingMore={true}
                loadMoreLimit={10}
              />
            </div>
          </div>
        </div>

        {values?.price_type?.name === "subscription" && (
          <div className="row">
            <div className="col-12">
              <h2 className="h5 mt-5">Subscription Details</h2>
            </div>
            <div className="col-12 col-md-6 mt-3">
              <div className="floating-input">
                <label className="fw-bold" htmlFor="label">
                  Subscription Label
                </label>
                <input
                  type="text"
                    id="label"
                    name="label"
                  className="form-control"
                  value={values?.label || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mt-3">
              <div className="floating-input">
                <label className="fw-bold" htmlFor="description">
                  Subscription Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                  value={values?.description || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mt-3">
              <div className="floating-input">
                <label className="fw-bold" htmlFor="setup_fee">
                  Setup Fee
                </label>
                <CurrencyPriceInput
                  amountValue={values?.setup_fee?.value || ""}
                  currencyValue={values?.currency || defaultCurrency}
                  onAmountChange={(value) => {
                    setFieldValue("setup_fee.value", value);
                  }}
                  onCurrencyChange={(value) => {
                    setFieldValue("setup_fee.currency", value);
                  }}
                />
              </div>
            </div>
            <div className="col-12 mt-3">
              <h3 className="h3">Subscription Items</h3>
            </div>
            <div className="col-12">
              <Button variant="primary" onClick={addSubscriptionItem}>
                Add Item
              </Button>
            </div>
            <div className="col-12 mt-3">
              {Array.isArray(values?.items) &&
                values?.items?.map(
                  (item: Record<string, unknown>, index: number) => (
                    <div key={index} className="mb-3 border p-3 rounded">
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <SelectSubscriptionIntervalUnit
                            value={item?.frequency?.interval_unit || null}
                            onChange={(value) => {
                              updateItem(index, "frequency.interval_unit", value);
                            }}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="fw-bold">Interval Count</label>
                          <input
                            type="number"
                            className="form-control"
                            value={item?.frequency?.interval_count || ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              updateItem(
                                index,
                                "frequency.interval_count",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 col-md-6">
                         <SelectSubscriptionTenureType
                            value={item?.tenure_type || null}
                            onChange={(value) => {
                              updateItem(index, "tenure_type", value);
                            }}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="fw-bold">Sequence</label>
                          <input
                            type="number"
                            className="form-control"
                            value={item?.sequence || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              updateItem(index, "sequence", e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 col-md-6">
                          <label className="fw-bold">Total Cycles</label>
                          <input
                            type="number"
                            className="form-control"
                            value={item?.total_cycles || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              updateItem(index, "total_cycles", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="fw-bold">Price</label>
                          <CurrencyPriceInput
                            amountValue={
                              item?.price?.value ? item.price.value : ""
                            }
                            currencyValue={
                              item?.price?.currency
                                ? item.price.currency
                                : defaultCurrency
                            }
                            onAmountChange={(value) => {
                              updateItem(index, "price.value", value);
                            }}
                            onCurrencyChange={(value) => {
                              updateItem(index, "price.currency", value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        )}
        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default connect((state: any) => ({
  site: state[SITE_STATE],
}))(EditProductPriceFields);
