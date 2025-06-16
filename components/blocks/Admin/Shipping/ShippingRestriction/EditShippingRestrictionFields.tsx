import { FormikValues, useFormikContext } from "formik";
import SelectShippingRestrictionAction from "./SelectShippingRestrictionAction";
import { ModalService } from "@/library/services/modal/ModalService";
import { useState } from "react";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import EntityBrowser, { EntityBrowserItem } from "@/components/EntityBrowser/EntityBrowser";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import SelectedDisplay from "@/components/Elements/SelectedDisplay";

type EditShippingRestrictionFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditShippingRestrictionFields() {
  const [selectedRestrictions, setSelectedRestrictions] = useState<
    Record<string, unknown>[]>([]);
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
      component: () => {
        let entityValue: EntityBrowserItem[] = [];
        if (values?.restriction_id && values?.type) {
          entityValue = [{
            id: values.restriction_id,
            type: values.type,
          }];
        }
        return (
          <AccessControlComponent>
            <EntityBrowser
              value={entityValue}
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
                setSelectedRestrictions(value);
                const firstItem = value?.[0] || {};
                if (!firstItem?.id) {
                  console.warn("No item selected in Entity Browser");
                  return;
                }
                setFieldValue("restriction_id", firstItem.id);
                setFieldValue("type", entity);
              }}
            />
          </AccessControlComponent>
        );
      },
      onOk: () => {
        console.log("Entity Browser OK clicked", { selectedRestrictions });
        return true;
      },
    },
  ]);

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="floating-input">
              <SelectedDisplay
                label="Restriction"
                data={values}
                render={(restriction: Record<string, unknown>) => (
                  <>
                    {[
                      `Type: ${restriction?.type || "N/A"}`,
                      `restriction_id: ${restriction?.restriction_id || "N/A"}`,
                      `Action: ${restriction?.action || "N/A"}`,
                    ].join(" | ")}
                  </>
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
