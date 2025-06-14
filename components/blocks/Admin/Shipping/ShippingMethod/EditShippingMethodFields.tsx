import { Dispatch, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import {
  LocalModal,
  ModalService,
} from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import QuantityInput from "@/components/QuantityInput";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageShippingRate from "../ShippingRate/ManageShippingRate";
import SelectedDisplay from "@/components/Elements/SelectedDisplay";
import SelectedListDisplay from "@/components/Elements/SelectedListDisplay";
import { ShippingRate, ShippingRestriction } from "@/types/Shipping";
import ManageShippingRestriction from "../ShippingRestriction/ManageShippingRestriction";

type EditShippingMethodFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditShippingMethodFields({ operation }: EditShippingMethodFields) {
  const modalService = new ModalService();

  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>() || {};

  function getComponentProps() {
    let componentProps: any = {
      operation: "create",
      isChild: true,
      // mode: 'selector'
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
      id: "rates",
      title: "Select Rates",
      size: "lg",
      fullscreen: true,
      component: () => {
        const extraProps: Record<string, unknown> = {};
        if (operation === "create" || operation === "add") {
          extraProps.data = values?.rates || [];
        }

        return (
          <AccessControlComponent
            id="edit-shipping-method-rates"
            roles={[{ name: "admin" }, { name: "superuser" }]}
          >
            <ManageShippingRate
              {...getComponentProps()}
              {...extraProps}
              values={values?.rates ? values?.rates : []}
              rowSelection={false}
              mode={"edit"}
              multiRowSelection={false}
              enableEdit={true}
              paginationMode="state"
              onChange={(rates: Array<any>) => {
                if (!Array.isArray(rates)) {
                  console.warn(
                    "Invalid values received from ManageShippingRate component"
                  );
                  return;
                }

                setFieldValue("rates", rates);
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
        return true;
      },
      onCancel: () => {
        return true;
      },
    },
    {
      id: "restrictions",
      title: "Select Restrictions",
      size: "lg",
      fullscreen: true,
      component: () => {
        const extraProps: Record<string, unknown> = {};
        if (operation === "create" || operation === "add") {
          extraProps.data = values?.restrictions || [];
        }

        return (
          <AccessControlComponent
            id="edit-shipping-method-restrictions"
            roles={[{ name: "admin" }, { name: "superuser" }]}
          >
            <ManageShippingRestriction
              {...getComponentProps()}
              {...extraProps}
              values={values?.restrictions ? values?.restrictions : []}
              rowSelection={false}
              mode={"edit"}
              multiRowSelection={false}
              enableEdit={true}
              paginationMode="state"
              onChange={(restrictions: Array<any>) => {
                if (!Array.isArray(restrictions)) {
                  console.warn(
                    "Invalid values received from ManageShippingRestriction component"
                  );
                  return;
                }

                setFieldValue("restrictions", restrictions);
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
            <TextInput
              value={values?.carrier || ""}
              onChange={handleChange}
              placeholder="Enter carrier"
              name="carrier"
              type="text"
              label="Carrier"
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
            />
          </div>

          <div className="col-12 col-lg-6">
            <div className="">
              <label className="form-label" htmlFor="icon">
                Procesing Time (Days)
              </label>
              <QuantityInput
                value={values?.processing_time_days || 1}
                min={1}
                max={365}
                onChange={(val) => setFieldValue("processing_time_days", val)}
              />
            </div>
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
            <div className="floating-input">
              <SelectedListDisplay
                label="Rates"
                direction="vertical"
                data={values?.rates}
                render={(rate: Record<string, any>) => (
                  <>
                    {[
                      `Amount: ${rate?.amount || 0}`,
                      `Currency: ${rate?.currency?.name || "N/A"}`,
                      `Min Weight: ${rate?.min_weight || 0} ${
                        rate?.weight_unit || "kg"
                      }`,
                      `Max Weight: ${rate?.max_weight || 0} ${
                        rate?.weight_unit || "kg"
                      }`,
                      `Min Height: ${rate?.min_height || 0} ${
                        rate?.height_unit || "cm"
                      }`,
                      `Max Height: ${rate?.max_height || 0} ${
                        rate?.height_unit || "cm"
                      }`,
                      `Shipping Zone: ${rate?.shipping_zone?.name || "N/A"}`,
                      `Type: ${rate?.type || "N/A"}`,
                      `Is Active: ${rate?.is_active ? "Yes" : "No"}`,
                    ].join(" | ")}
                  </>
                )}
              />
              {modalService.renderLocalTriggerButton("rates", "Select Rates")}
            </div>
          </div>

          <div className="col-12 col-lg-6 mt-4">
            <div className="floating-input">
              <SelectedListDisplay
                label="Restrictions"
                direction="vertical"
                data={values?.restrictions}
                render={(restriction: Record<string, any>) => (
                  <>{[`Action: ${restriction?.action || "N/A"}`].join(" | ")}</>
                )}
              />
              {modalService.renderLocalTriggerButton(
                "restrictions",
                "Select Restrictions"
              )}
            </div>
          </div>
        </div>
        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default EditShippingMethodFields;
