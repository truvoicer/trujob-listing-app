import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_SHIPPING_METHOD_TIER_ID } from "./ManageShippingMethodTier";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditShippingMethodTierFields from "./EditShippingMethodTierFields";
import { ModalService } from "@/library/services/modal/ModalService";
import {
  ShippingMethodTier,
  CreateShippingMethodTier,
  UpdateShippingMethodTier,
  ShippingMethodTierRequest,
} from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";
import ShippingProvider from "@/components/Provider/Shipping/ShippingProvider";

export type EditShippingMethodTierProps = {
  data?: ShippingMethodTier;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
  shippingMethodId?: number;
};
function EditShippingMethodTier({
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
  shippingMethodId,
}: EditShippingMethodTierProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const initialValues: ShippingMethodTier = {
    id: data?.id || 0,
    name: data?.name || "",
    label: data?.label || "",
    description: data?.description || "",
    is_active: data?.is_active || false,
    has_weight: data?.has_weight || false,
    has_height: data?.has_height || false,
    has_length: data?.has_length || false,
    has_width: data?.has_width || false,
    has_max_dimension: data?.has_max_dimension || false,
    max_dimension: data?.max_dimension || 0,
    max_dimension_unit: data?.max_dimension_unit || "cm",
    max_weight: data?.max_weight || 0,
    max_height: data?.max_height || 0,
    max_length: data?.max_length || 0,
    max_width: data?.max_width || 0,
    weight_unit: data?.weight_unit || "kg",
    height_unit: data?.height_unit || "cm",
    length_unit: data?.length_unit || "cm",
    width_unit: data?.width_unit || "cm",
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
    base_amount: data?.base_amount || 0,
    dimensional_weight_divisor: data?.dimensional_weight_divisor || 0,
    currency: data?.currency || null
  };

  function buildRequestData(values: ShippingMethodTier) {
    const requestData: ShippingMethodTierRequest = {};
    if (values?.label) {
      requestData.label = values?.label || "";
    }
    if (values?.description) {
      requestData.description = values?.description || "";
    }
    if (values?.name) {
      requestData.name = values?.name || "";
    }
    if (values.hasOwnProperty("max_dimension_unit")) {
      requestData.max_dimension_unit =
        values?.max_dimension_unit || "cm"; // Default to cm if not provided
    }
    if (values.hasOwnProperty("max_dimension")) {
      requestData.max_dimension = values?.max_dimension || 0;
    }
    if (values.hasOwnProperty("has_max_dimension")) {
      requestData.has_max_dimension = values?.has_max_dimension || false;
    }

    if (values.hasOwnProperty("weight_unit")) {
      requestData.weight_unit = values?.weight_unit || "kg";
    }
    if (values.hasOwnProperty("max_weight")) {
      requestData.max_weight = values?.max_weight || 0;
    }
    if (values.hasOwnProperty("has_weight")) {
      requestData.has_weight = values?.has_weight || false;
    }

    if (values.hasOwnProperty("height_unit")) {
      requestData.height_unit = values?.height_unit || "cm";
    }
    if (values.hasOwnProperty("max_height")) {
      requestData.max_height = values?.max_height || 0;
    }
    if (values.hasOwnProperty("has_height")) {
      requestData.has_height = values?.has_height || false;
    }
    if (values.hasOwnProperty("length_unit")) {
      requestData.length_unit = values?.length_unit || "cm";
    }
    if (values.hasOwnProperty("max_length")) {
      requestData.max_length = values?.max_length || 0;
    }
    if (values.hasOwnProperty("has_length")) {
      requestData.has_length = values?.has_length || false;
    }
    if (values.hasOwnProperty("has_max_dimension")) {
      requestData.has_max_dimension = values?.has_max_dimension || false;
    }
    if (values.hasOwnProperty("max_width")) {
      requestData.max_width = values?.max_width || 0;
    }
    if (values.hasOwnProperty("width_unit")) {
      requestData.width_unit = values?.width_unit || "cm";
    }
    if (values.hasOwnProperty("has_width")) {
      requestData.has_width = values?.has_width || false;
    }
    
    if (values.hasOwnProperty("is_active")) {
      requestData.is_active = values?.is_active || false;
    }
    if (values.hasOwnProperty("base_amount")) {
      requestData.base_amount = values?.base_amount || 0;
    }
    
    if (values.hasOwnProperty("dimensional_weight_divisor")) {
      requestData.dimensional_weight_divisor =
        values?.dimensional_weight_divisor || 0;
    }
    if (values?.currency?.id) {
      requestData.currency_id = values?.currency?.id || 0;
    }

    return requestData;
  }

  function buildCreateData(values: ShippingMethodTier) {
    let requestData: CreateShippingMethodTier = {
    };

    requestData = {
      ...requestData,
      ...buildRequestData(values),
    };
    return requestData;
  }

  function buildUpdateData(values: ShippingMethodTier) {
    let requestData: UpdateShippingMethodTier = {
      id: values?.id || 0,
    };
    requestData = {
      ...requestData,
      ...buildRequestData(values),
    };
    return requestData;
  }
  async function handleSubmit(values: ShippingMethodTier) {
    console.log("Submitting values:", values);
    if (["edit", "update"].includes(operation) && isObjectEmpty(values)) {
      console.log("No data to update");
      return false;
    }

    if (Array.isArray(values?.items)) {
      return false;
    }
    if (!shippingMethodId) {
      console.log("Shipping method ID is required", {values});
      return false;
    }

    let response = null;

    switch (operation) {
      case "edit":
      case "update":
        if (!values?.id) {
          throw new Error("ShippingMethodTier ID is required");
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.shippingMethodTier.replace(
              ":shippingMethodId",
              shippingMethodId.toString()
            ),
            values.id,
            "update",
          ]),
          method: ApiMiddleware.METHOD.PATCH,
          protectedReq: true,
          data: buildUpdateData(values),
        });
        break;
      case "add":
      case "create":
        if (Array.isArray(values?.items)) {
          return;
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.shippingMethodTier.replace(
              ":shippingMethodId",
              shippingMethodId.toString()
            ),
            "store",
          ]),
          method: ApiMiddleware.METHOD.POST,
          protectedReq: true,
          data: buildCreateData(values),
        });
        break;
      default:
        console.log("Invalid operation");
        break;
    }

    if (!response) {
      setAlert({
        show: true,
        message: (
          <div>
            <strong>Error:</strong>
            {truJobApiMiddleware
              .getErrors()
              .map((error: ErrorItem, index: number) => {
                return <div key={index}>{error.message}</div>;
              })}
          </div>
        ),
        type: "danger",
      });
      return false;
    }
    if (dataTable) {
      dataTable.refresh();
    }
    dataTableContext.refresh();
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_SHIPPING_METHOD_TIER_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_SHIPPING_METHOD_TIER_ID, "create")
    );
    return true;
  }

  function getRequiredFields() {
    let requiredFields: any = {};
    if (operation === "edit" || operation === "update") {
      requiredFields = {
        id: true,
        restrictions: {
          action: true,
          type: true,
          restriction_id: true,
        },
      };
    }
    return requiredFields;
  }
  useEffect(() => {
    if (!inModal) {
      return;
    }
    if (!modalId) {
      return;
    }
    ModalService.initializeModalWithForm({
      modalState: dataTableContext?.modal,
      id: modalId,
      operation: operation,
      initialValues: initialValues,
      requiredFields: getRequiredFields(),
      handleSubmit: handleSubmit,
    });
  }, [inModal, modalId]);

  const dataTableContext = useContext(DataTableContext);
  return (
    <ShippingProvider>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-12 col-sm-12 col-12 align-self-center">
          {alert && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}
          {inModal &&
            ModalService.modalItemHasFormProps(
              dataTableContext?.modal,
              modalId
            ) && <EditShippingMethodTierFields operation={operation} />}
          {!inModal && (
            <Form
              operation={operation}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {() => {
                return <EditShippingMethodTierFields operation={operation} />;
              }}
            </Form>
          )}
        </div>
      </div>
    </ShippingProvider>
  );
}
export default EditShippingMethodTier;
