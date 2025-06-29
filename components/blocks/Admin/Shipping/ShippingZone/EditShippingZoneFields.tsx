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
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditShippingZoneFields({
    operation
}: EditShippingZoneFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};


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
          id: "zoneBrowser",
          title: "Manage Shipping Zones",
          footer: true,
          size: "md",
          fullscreen: true,
          component: () => {
            if (!Array.isArray(values?.zones)) {
              console.warn("Zones should be an array");
              return null;
            }
            const buildValue = values.zones
              .filter(
                (zone: Record<string, unknown>) =>
                  zone?.zoneable_id && zone?.zoneable_type
              )
              .map((zone: Record<string, unknown>) => ({
                id: zone.zoneable_id,
                type: zone.zoneable_type,
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
                    let existingRestrictions = values?.restrictions || [];
                    if (!Array.isArray(existingRestrictions)) {
                      console.warn("Existing restrictions should be an array");
                      return;
                    }
    
                    // Filter existing restrictions to keep only those that exist in value
                    existingRestrictions = existingRestrictions.filter(
                      (restriction: Record<string, unknown>) => {
                        if (restriction?.type !== entity) {
                          return true; // Keep existing restrictions that don't match the entity
                        }
                        return value.some(
                          (item: Record<string, unknown>) =>
                            item.id === restriction?.restriction_id
                        );
                    });
    
                    const newRestrictions = [
                      ...existingRestrictions,
                      ...value
                        .filter(
                          (item: Record<string, unknown>) =>
                            !existingRestrictions.some(
                              (existing: Record<string, unknown>) =>
                                existing?.[entity]?.id === item.id
                            )
                        )
                        .map((item: Record<string, unknown>) => ({
                          [entity]: item,
                          restriction_id: item.id,
                          type: entity,
                          action: "allow", // Default action, can be changed later
                        })),
                    ];
                    setFieldValue("restrictions", newRestrictions);
                  }}
                  columnHandler={(columns: string[]) => {
                    return [
                      {
                        label: "Restriction Action",
                        render: (
                          column: DataTableColumn,
                          item: Record<string, unknown>
                        ) => {
                          const findInFilteredValue = buildValue.find(
                            (value) => value.id === item.id
                          );
                          if (!findInFilteredValue) {
                            return null;
                          }
                          return (
                            <SelectShippingRestrictionAction
                              value={findInFilteredValue?.action || "allow"}
                              hideLabel={true}
                              onChange={(action: string | null) => {
                                const findIndexInRestrictions =
                                  values?.restrictions?.findIndex(
                                    (restriction: Record<string, unknown>) =>
                                      restriction?.restriction_id === item.id &&
                                      restriction?.type === findInFilteredValue.type
                                  );
                                if (findIndexInRestrictions !== -1) {
                                  const updatedRestrictions = [
                                    ...values.restrictions,
                                  ];
                                  updatedRestrictions[findIndexInRestrictions] = {
                                    ...updatedRestrictions[findIndexInRestrictions],
                                    action: action,
                                  };
                                  setFieldValue(
                                    "restrictions",
                                    updatedRestrictions
                                  );
                                }
                              }}
                            />
                          );
                        },
                      },
                      ...columns,
                    ];
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
                        <TextInput
                            value={values?.name || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                            name="name"
                            type="text"
                            label="Name"
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
                            name={'is_active'}
                            placeholder="Is Active?"
                            label="Is Active?"
                            onChange={handleChange}
                            value={values?.is_active || false}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'all'}
                            placeholder="All Countries?"
                            label="All Countries?"
                            onChange={handleChange}
                            value={values?.all || false}
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
export default EditShippingZoneFields;