import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import { Country } from "@/types/Country";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import EntityBrowser from "@/components/EntityBrowser/EntityBrowser";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";

type EditShippingZoneFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditShippingZoneFields({ operation }: EditShippingZoneFields) {
  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>() || {};

  const modalService = new ModalService();
  modalService.setUseStateHook(useState);
  modalService.setConfig([
    {
      id: "zoneBrowser",
      title: "Manage Shipping Zones",
      footer: true,
      size: "md",
      fullscreen: true,
      component: () => {
        if (!Array.isArray(values?.shipping_zoneables)) {
          console.warn("Zones should be an array");
          return null;
        }
        const buildValue = values.shipping_zoneables
          .filter(
            (zone: Record<string, unknown>) =>
              zone?.shipping_zoneable_id && zone?.shipping_zoneable_type
          )
          .map((zone: Record<string, unknown>) => ({
            id: zone.shipping_zoneable_id,
            type: zone.shipping_zoneable_type,
          }));
        return (
          <AccessControlComponent>
            <EntityBrowser
              value={buildValue}
              multiple={true}
              entityListRequest={async () => {
                return await TruJobApiMiddleware.getInstance().resourceRequest({
                  endpoint: UrlHelpers.urlFromArray([
                    TruJobApiMiddleware.getConfig().endpoints.shipping,
                    "zone",
                    "type",
                  ]),
                  method: ApiMiddleware.METHOD.GET,
                  protectedReq: true,
                });
              }}
              onChange={(entity: string, value: Record<string, unknown>[]) => {
                let existing = values?.shipping_zoneables || [];
                if (!Array.isArray(existing)) {
                  console.warn(
                    "Existing shipping zoneables should be an array"
                  );
                  return;
                }
                if (value.length === 0) {
                    // If no value is selected, clear the existing zoneables    
                    setFieldValue("shipping_zoneables", existing.filter(
                      (item: Record<string, unknown>) =>
                        item.shipping_zoneable_type !== entity
                    ));
                    return;
                }
                const newZoneables = [
                  ...existing,
                  ...value
                    .filter(
                      (item: Record<string, unknown>) =>
                        !existing.some(
                          (existing: Record<string, unknown>) =>
                            existing?.[entity]?.id === item.id
                        )
                    )
                    .map((item: Record<string, unknown>) => ({
                      [entity]: item,
                      shipping_zoneable_id: item.id,
                      shipping_zoneable_type: entity,
                    })),
                ];
                setFieldValue("shipping_zoneables", newZoneables);
              }}
            />
          </AccessControlComponent>
        );
      },
      onOk: () => {
        return true;
      },
    },
  ]);
  
  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12 col-lg-6">
            {modalService.renderLocalTriggerButton(
              "zoneBrowser",
              "Manage Shipping Zones"
            )}
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.label || ""}
              onChange={handleChange}
              placeholder="Enter label"
              name="label"
              type="text"
              label="Label"
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
              name={"all"}
              placeholder="All?"
              label="All?"
              onChange={handleChange}
              value={values?.all || false}
            />
          </div>
        </div>
        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default EditShippingZoneFields;
