import { useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import SelectDiscountType from "./SelectDiscountType";
import CurrencySelect from "../../Locale/Currency/CurrencySelect";
import DateTimePicker from "@/components/Date/DateTimePicker";
import moment from "moment";
import SelectDiscountScope from "./SelectDiscountScope";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import SelectDiscountAmountType from "./SelectDiscountAmountType";

type EditDiscountFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditDiscountFields({ operation }: EditDiscountFields) {
  const modalService = new ModalService();

  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>() || {};

  modalService.setUseStateHook(useState);
//   modalService.setConfig([
//     {
//       id: "entityBrowser",
//       title: "Manage Discountable Entities",
//       footer: true,
//       size: "md",
//       fullscreen: true,
//       component: () => {
//         if (!Array.isArray(values?.discountables)) {
//           console.warn("Restrictions should be an array");
//           return null;
//         }
//         const buildValue = values.discountables
//           .filter(
//             (discountable: Record<string, unknown>) =>
//               discountable?.discountable_type && discountable?.discountable_id
//           )
//           .map((discountable: Record<string, unknown>) => ({
//             id: discountable.discountable_id,
//             type: discountable.discountable_type,
//           }));
//         return (
//           <AccessControlComponent>
//             <EntityBrowser
//               value={buildValue}
//               multiple={true}
//               entityListRequest={async () => {
//                 return await TruJobApiMiddleware.getInstance().resourceRequest({
//                   endpoint: UrlHelpers.urlFromArray([
//                     truJobApiConfig.endpoints.discount,
//                     "discountable",
//                     "type",
//                   ]),
//                   method: ApiMiddleware.METHOD.GET,
//                   protectedReq: true,
//                 });
//               }}
//               onChange={(entity: string, value: Record<string, unknown>[]) => {
//                 let existingDiscountables = values?.discountables || [];
//                 if (!Array.isArray(existingDiscountables)) {
//                   console.warn("Existing discountables should be an array");
//                   return;
//                 }

//                 // Filter existing discountables to keep only those that exist in value
//                 existingDiscountables = existingDiscountables.filter(
//                   (discountable: Record<string, unknown>) => {
//                     if (discountable?.type !== entity) {
//                       return true; // Keep existing discountables that don't match the entity
//                     }
//                     return value.some(
//                       (item: Record<string, unknown>) =>
//                         item.id === discountable?.discountable_id
//                     );
//                   }
//                 );

//                 const newDiscountables = [
//                   ...existingDiscountables,
//                   ...value
//                     .filter(
//                       (item: Record<string, unknown>) =>
//                         !existingDiscountables.some(
//                           (existing: Record<string, unknown>) =>
//                             existing?.[entity]?.id === item.id
//                         )
//                     )
//                     .map((item: Record<string, unknown>) => ({
//                       [entity]: item,
//                       discountable_id: item.id,
//                       type: entity,
//                     })),
//                 ];
//                 setFieldValue("discountables", newDiscountables);
//               }}
//             />
//           </AccessControlComponent>
//         );
//       },
//       onOk: () => {
//         return true;
//       },
//     },
//   ]);

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12 col-lg-6">
            <Checkbox
              name={"is_active"}
              placeholder="Is Active"
              label="Is Active"
              onChange={handleChange}
              value={values?.is_active || false}
            />
          </div>

          <div className="col-12 col-lg-6">
            <Checkbox
              name={"is_code_required"}
              placeholder="Is Code Required"
              label="Is Code Required"
              onChange={handleChange}
              value={values?.is_code_required || false}
            />
          </div>
          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.name || ""}
              onChange={handleChange}
              placeholder="Enter name"
              type="text"
              name="name"
              label="Name"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.description || ""}
              onChange={handleChange}
              placeholder="Enter description"
              type="text"
              name="description"
              label="Description"
            />
          </div>

          <div className="col-12 col-lg-6">
            <SelectDiscountType name="type" value={values?.type} />
          </div>

          <div className="col-12 col-lg-6">
            <SelectDiscountAmountType
              name="amount_type"
              value={values?.amount_type}
            />
          </div>

          {values?.type === "fixed" && (
            <div className="col-12 col-lg-6">
              <TextInput
                value={values?.amount || 0}
                onChange={handleChange}
                placeholder="Enter amount"
                type="number"
                name="amount"
                label="Amount"
              />
            </div>
          )}
          {values?.type === "percentage" && (
            <div className="col-12 col-lg-6">
              <TextInput
                value={values?.rate || 0}
                onChange={handleChange}
                placeholder="Enter rate"
                type="number"
                name="rate"
                label="Rate"
              />
            </div>
          )}

          <div className="col-12 col-lg-6">
            <label className="title">Select Currency</label>
            <CurrencySelect
              value={
                values?.currency
                  ? {
                      value: values?.currency?.id,
                      label: values?.currency?.name,
                    }
                  : null
              }
              isMulti={false}
              showLoadingSpinner={true}
              onChange={(value) => {
                setFieldValue("currency", value);
              }}
              loadingMore={true}
              loadMoreLimit={10}
            />
          </div>

          <div className="col-12 col-lg-6 mt-3">
            <div className="floating-input form-group">
              <DateTimePicker
                label="Starts At"
                value={
                  moment(values?.starts_at).isValid()
                    ? moment(values?.starts_at).toDate()
                    : ""
                }
                onChange={(value) => {
                  console.log("starts_at", value);
                  setFieldValue("starts_at", value);
                }}
                onSelect={(value) => {
                  console.log("starts_at", value);
                  setFieldValue("starts_at", value);
                }}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6 mt-3">
            <div className="floating-input form-group">
              <DateTimePicker
                label="Ends At"
                value={
                  moment(values?.ends_at).isValid()
                    ? moment(values?.ends_at).toDate()
                    : ""
                }
                onChange={(value) => {
                  console.log("ends_at", value);
                  setFieldValue("ends_at", value);
                }}
                onSelect={(value) => {
                  console.log("ends_at", value);
                  setFieldValue("ends_at", value);
                }}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.usage_limit || 0}
              onChange={handleChange}
              placeholder="Enter usage limit"
              type="number"
              name="usage_limit"
              label="Usage Limit"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.per_user_limit || 0}
              onChange={handleChange}
              placeholder="Enter per user limit"
              type="number"
              name="per_user_limit"
              label="Per User Limit"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.min_order_amount || 0}
              onChange={handleChange}
              placeholder="Enter min order amount"
              type="number"
              name="min_order_amount"
              label="Min Order Amount"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.min_items_quantity || 0}
              onChange={handleChange}
              placeholder="Enter min items quantity"
              type="number"
              name="min_items_quantity"
              label="Min Items Quantity"
            />
          </div>

          <div className="col-12 col-lg-6">
            <SelectDiscountScope name="scope" />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.code || ""}
              onChange={handleChange}
              placeholder="Enter code"
              type="text"
              name="code"
              label="Code"
            />
          </div>

          {/* <div className="col-12 col-lg-6">
            {modalService.renderLocalTriggerButton(
              "entityBrowser",
              "Select Discountable Entities",
            )}
          </div> */}
        </div>
        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default EditDiscountFields;
