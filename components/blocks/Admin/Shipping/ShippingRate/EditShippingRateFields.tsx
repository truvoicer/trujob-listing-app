import { Dispatch, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import {
  LocalModal,
  ModalService,
} from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import { Country } from "@/types/Country";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import CurrencyPriceInput from "@/components/blocks/Locale/Currency/CurrencyPriceInput";
import { getSiteCurrencyAction } from "@/library/redux/actions/site-actions";
import SelectShippingRateType from "./SelectShippingRateType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageShippingZone from "../ShippingZone/ManageShippingZone";
import SelectedDisplay from "@/components/Elements/SelectedDisplay";
import SelectShippingUnit from "../SelectShippingUnit";
import SelectShippingWeightUnit from "../SelectShippingWeightUnit";

type EditShippingRateFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditShippingRateFields({ operation }: EditShippingRateFields) {
  const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

  const modalService = new ModalService();
  const notificationContext = useContext(AppNotificationContext);
  const dataTableContext = useContext(DataTableContext);

  const { values, errors, setFieldValue, handleChange } =
    useFormikContext<FormikValues>() || {};

  function getComponentProps() {
    let componentProps: any = {
      operation: "create",
      mode: "selector",
      isChild: true,
    };
    if (values?.id) {
      componentProps.shippingMethodId = values.id;
      componentProps.operation = "edit";
    }
    return componentProps;
  }
  modalService.setUseStateHook(useState);
  modalService.setConfig([
    {
      id: "zones",
      title: "Select Zone",
      size: "lg",
      fullscreen: true,
      component: (
        <AccessControlComponent
          id="select-shipping-rate-zone"
          roles={[{ name: "admin" }, { name: "superuser" }]}
        >
          <ManageShippingZone
            {...getComponentProps()}
            values={values?.zone ? [values?.zone] : []}
            rowSelection={true}
            multiRowSelection={false}
            enableEdit={true}
            paginationMode="state"
            onChange={(zones: Array<any>) => {
              if (!Array.isArray(zones)) {
                console.warn(
                  "Invalid values received from ManageShippingZone component"
                );
                return;
              }

              if (zones.length === 0) {
                console.warn("Zones is empty");
                return true;
              }
              const checked = zones.filter((item) => item?.checked);
              if (checked.length === 0) {
                console.warn("No zones selected");
                return true;
              }
              console.log("Selected zones", checked);
              setFieldValue("shipping_zone", checked[0]);
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

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12 col-lg-6">
            <SelectShippingRateType name="type" value={values?.type || ""} />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.label || ""}
              onChange={handleChange}
              placeholder="Enter label"
              name="label"
              type="text"
              label="Label"
              error={errors?.label}
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.description || ""}
              onChange={handleChange}
              placeholder="Enter description"
              name="description"
              type="text"
              label="Description"
              error={errors?.description}
            />
          </div>

          <div className="col-12 col-lg-6">
            <Checkbox
              name={"is_active"}
              placeholder="Is Active?"
              label="Is Active?"
              onChange={handleChange}
              value={values?.is_active || false}
            />
          </div>

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_max_dimension"
              value={values?.has_max_dimension || false}
              onChange={handleChange}
              label="Has Max Dimension?"
              placeholder="Has Max Dimension?"
            />
          </div>
          {values?.has_max_dimension && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_dimension || 0}
                  onChange={handleChange}
                  placeholder="Enter max overall dimension"
                  name="max_dimension"
                  type="number"
                  label="Max Dimension"
                  error={errors?.max_dimension}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="max_dimension_unit"
                  value={values?.max_dimension_unit || "cm"}
                />
                {errors?.max_dimension_unit && (
                  <span className="text-danger">
                    {errors.max_dimension_unit}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_weight"
              value={values?.has_weight || false}
              onChange={handleChange}
              label="Has Weight?"
              placeholder="Has Weight?"
            />
          </div>
          {values?.has_weight && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_weight || 0}
                  onChange={handleChange}
                  placeholder="Enter max weight"
                  name="max_weight"
                  type="number"
                  label="Max Weight"
                  error={errors?.max_weight}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingWeightUnit
                  name="weight_unit"
                  value={values?.weight_unit || ""}
                />
                {errors?.weight_unit && (
                  <span className="text-danger">{errors.weight_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_height"
              value={values?.has_height || false}
              onChange={handleChange}
              label="Has Height?"
              placeholder="Has Height?"
            />
          </div>
          {values?.has_height && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_height || 0}
                  onChange={handleChange}
                  placeholder="Enter max height"
                  name="max_height"
                  type="number"
                  label="Max Height"
                  error={errors?.max_height}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="height_unit"
                  value={values?.height_unit || ""}
                />
                {errors?.height_unit && (
                  <span className="text-danger">{errors.height_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_depth"
              value={values?.has_depth || false}
              onChange={handleChange}
              label="Has Depth?"
              placeholder="Has Depth?"
            />
          </div>
          {values?.has_depth && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_depth || 0}
                  onChange={handleChange}
                  placeholder="Enter max length"
                  name="max_depth"
                  type="number"
                  label="Max Depth"
                  error={errors?.max_depth}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="depth_unit"
                  value={values?.depth_unit || ""}
                />
                {errors?.depth_unit && (
                  <span className="text-danger">{errors.depth_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-lg-6">
            <Checkbox
              name="has_width"
              value={values?.has_width || false}
              onChange={handleChange}
              label="Has Width?"
              placeholder="Has Width?"
            />
          </div>
          {values?.has_width && (
            <>
              <div className="col-12 col-md-4">
                <TextInput
                  value={values?.max_width || 0}
                  onChange={handleChange}
                  placeholder="Enter max width"
                  name="max_width"
                  type="number"
                  label="Max Width"
                  error={errors?.max_width}
                />
              </div>
              <div className="col-12 col-md-4">
                <SelectShippingUnit
                  name="width_unit"
                  value={values?.width_unit || ""}
                />
                {errors?.width_unit && (
                  <span className="text-danger">{errors.width_unit}</span>
                )}
              </div>
            </>
          )}

          <div className="col-12 col-md-6">
            <TextInput
              value={values?.dimensional_weight_divisor || 0}
              onChange={handleChange}
              placeholder="Enter dimensional weight divisor"
              name="dimensional_weight_divisor"
              type="number"
              label="Dimensional Weight Divisor"
              error={errors?.dimensional_weight_divisor}
            />
          </div>

          <div className="col-12">
            <div className="floating-input">
              <label className="fw-bold" htmlFor="amount">
                Base amount
              </label>
              <CurrencyPriceInput
                amountValue={values?.amount || ""}
                currencyValue={values?.currency || null}
                onAmountChange={(value) => {
                  setFieldValue("amount", value);
                }}
                onCurrencyChange={(value) => {
                  setFieldValue("currency", value);
                }}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="floating-input">
              <SelectedDisplay
                label="Zone"
                data={values?.shipping_zone}
                render={(zone: Record<string, any>) => (
                  <>{zone?.name || "No Zone Selected"}</>
                )}
              />
              {modalService.renderLocalTriggerButton("zones", "Select Zone")}
            </div>
          </div>
        </div>
        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default EditShippingRateFields;
