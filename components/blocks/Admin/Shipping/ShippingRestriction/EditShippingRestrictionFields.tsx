import { FormikValues, useFormikContext } from "formik";
import SelectShippingRestrictionAction from "./SelectShippingRestrictionAction";
import { ModalService } from "@/library/services/modal/ModalService";
import { useState } from "react";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import EntityBrowser from "@/components/EntityBrowser/EntityBrowser";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import SelectedListDisplay from "@/components/Elements/SelectedListDisplay";

type EditShippingRestrictionFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditShippingRestrictionFields() {
  const { values, setFieldValue } = useFormikContext<FormikValues>() || {};

  const modalService = new ModalService();
  modalService.setUseStateHook(useState);

  modalService.setConfig([
    {
      id: "entityBrowser",
      title: "Select Shipping Restriction Entity",
      footer: true,
      size: "md",
      fullscreen: true,
      component: (
        <AccessControlComponent>
          <EntityBrowser
            entityListRequest={async () => {
              return await TruJobApiMiddleware.getInstance().resourceRequest({
                endpoint: UrlHelpers.urlFromArray([
                  truJobApiConfig.endpoints.shipping,
                  "restriction",
                  "type",
                ]),
                method: ApiMiddleware.METHOD.GET,
                protectedReq: true,
              });
            }}
            onChange={(entity: string, value: Record<string, unknown>[]) => {
              console.log("Entity Browser onChange", entity, value);
              const existingRestrictions = Array.isArray(values?.restrictions)
                ? [...values.restrictions]
                : [];
              const findEntityIndex = existingRestrictions.findIndex(
                (restriction: Record<string, unknown>) =>
                  restriction?.entity === entity
              );
              if (findEntityIndex > -1) {
                if (
                  !Array.isArray(existingRestrictions[findEntityIndex]?.ids)
                ) {
                  existingRestrictions[findEntityIndex].ids = [];
                }
                const newValues = value
                  .filter(
                    (item: Record<string, unknown>) =>
                      !existingRestrictions[findEntityIndex].ids.includes(
                        item.id
                      )
                  )
                  .map((item: Record<string, unknown>) => item.id);
                  
                existingRestrictions[findEntityIndex].ids = [
                  ...existingRestrictions[findEntityIndex].ids,
                  ...newValues,
                ];
              } else {
                existingRestrictions.push({
                  entity,
                  ids: value.map((item: Record<string, unknown>) => item.id),
                });
              }
              setFieldValue("restrictions", existingRestrictions);
            }}
          />
        </AccessControlComponent>
      ),
      onOk: () => {
        console.log("Entity Browser OK clicked");
        return true;
      },
    },
  ]);
  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          {/* restrictionable_type: data?.restrictionable_type || '',
        restrictionable_id: data?.restrictionable_id || 0, */}
          <div className="col-12 col-lg-6">
            <div className="floating-input">
              <SelectedListDisplay
                label="Restrictions"
                direction="vertical"
                data={values?.restrictions}
                render={(restriction: Record<string, unknown>) => (
                  <>{[`Action: ${restriction?.action || "N/A"}`].join(" | ")}</>
                )}
              />
              {modalService.renderLocalTriggerButton(
                "entityBrowser",
                "Select Restriction Entity"
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 mt-4">
            <SelectShippingRestrictionAction
              name="action"
              value={values.action}
            />
          </div>
        </div>
        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default EditShippingRestrictionFields;
