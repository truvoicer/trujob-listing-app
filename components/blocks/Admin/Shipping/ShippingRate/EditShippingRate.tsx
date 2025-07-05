import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_SHIPPING_RATE_ID } from "./ManageShippingRate";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditShippingRateFields from "./EditShippingRateFields";
import { ModalService } from "@/library/services/modal/ModalService";
import {
  ShippingRate,
  CreateShippingRate,
  UpdateShippingRate,
  ShippingRateRequest,
} from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export type EditShippingRateProps = {
  data?: ShippingRate;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
  shippingMethodId?: number;
};

export function buildShippingRates(rates: ShippingRate[]): ShippingRateRequest[] {
  return rates.map((rate) => {
    return buildShippingRate(rate);
  });
}
export function buildShippingRate(rate: ShippingRate) {
  const shippingRate: ShippingRateRequest = {};
  if (rate?.shipping_zone?.id) {
    shippingRate.shipping_zone_id = rate?.shipping_zone?.id;
  }
  if (rate?.type) {
    shippingRate.type = rate?.type || "";
  }
  
  if (rate?.label) {
      shippingRate.label = rate?.label || "";
    }
    if (rate?.description) {
      shippingRate.description = rate?.description || "";
    }
    if (rate?.name) {
      shippingRate.name = rate?.name || "";
    }
    if (rate.hasOwnProperty("max_dimension_unit")) {
      shippingRate.max_dimension_unit =
        rate?.max_dimension_unit || "cm"; // Default to cm if not provided
    }
    if (rate.hasOwnProperty("max_dimension")) {
      shippingRate.max_dimension = rate?.max_dimension || 0;
    }
    if (rate.hasOwnProperty("has_max_dimension")) {
      shippingRate.has_max_dimension = rate?.has_max_dimension || false;
    }

    if (rate.hasOwnProperty("weight_unit")) {
      shippingRate.weight_unit = rate?.weight_unit || "kg";
    }
    if (rate.hasOwnProperty("max_weight")) {
      shippingRate.max_weight = rate?.max_weight || 0;
    }
    if (rate.hasOwnProperty("has_weight")) {
      shippingRate.has_weight = rate?.has_weight || false;
    }

    if (rate.hasOwnProperty("height_unit")) {
      shippingRate.height_unit = rate?.height_unit || "cm";
    }
    if (rate.hasOwnProperty("max_height")) {
      shippingRate.max_height = rate?.max_height || 0;
    }
    if (rate.hasOwnProperty("has_height")) {
      shippingRate.has_height = rate?.has_height || false;
    }
    if (rate.hasOwnProperty("depth_unit")) {
      shippingRate.depth_unit = rate?.depth_unit || "cm";
    }
    if (rate.hasOwnProperty("max_depth")) {
      shippingRate.max_depth = rate?.max_depth || 0;
    }
    if (rate.hasOwnProperty("has_depth")) {
      shippingRate.has_depth = rate?.has_depth || false;
    }
    if (rate.hasOwnProperty("has_max_dimension")) {
      shippingRate.has_max_dimension = rate?.has_max_dimension || false;
    }
    if (rate.hasOwnProperty("max_width")) {
      shippingRate.max_width = rate?.max_width || 0;
    }
    if (rate.hasOwnProperty("width_unit")) {
      shippingRate.width_unit = rate?.width_unit || "cm";
    }
    if (rate.hasOwnProperty("has_width")) {
      shippingRate.has_width = rate?.has_width || false;
    }
    
    if (rate.hasOwnProperty("is_active")) {
      shippingRate.is_active = rate?.is_active || false;
    }
    if (rate.hasOwnProperty("amount")) {
      shippingRate.amount = rate?.amount || 0;
    }
    
    if (rate.hasOwnProperty("dimensional_weight_divisor")) {
      shippingRate.dimensional_weight_divisor =
        rate?.dimensional_weight_divisor || 0;
    }
    if (rate?.currency?.id) {
      shippingRate.currency_id = rate?.currency?.id || 0;
    }

  return shippingRate;
}
function EditShippingRate({
  shippingMethodId,
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
}: EditShippingRateProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const initialValues: ShippingRate = {
    id: data?.id || 0,
    shipping_method: data?.shipping_method || "",
    shipping_zone: data?.shipping_zone || "",
    type: data?.type || "",
    name: data?.name || "",
    label: data?.label || "",
    description: data?.description || "",
    is_active: data?.is_active || false,
    has_weight: data?.has_weight || false,
    has_height: data?.has_height || false,
    has_depth: data?.has_depth || false,
    has_width: data?.has_width || false,
    has_max_dimension: data?.has_max_dimension || false,
    max_dimension: data?.max_dimension || 0,
    max_dimension_unit: data?.max_dimension_unit || "cm",
    max_weight: data?.max_weight || 0,
    max_height: data?.max_height || 0,
    max_depth: data?.max_depth || 0,
    max_width: data?.max_width || 0,
    weight_unit: data?.weight_unit || "kg",
    height_unit: data?.height_unit || "cm",
    depth_unit: data?.depth_unit || "cm",
    width_unit: data?.width_unit || "cm",
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
    amount: data?.amount || 0,
    dimensional_weight_divisor: data?.dimensional_weight_divisor || 0,
    currency: data?.currency || null,
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
  };


  function buildCreateData(values: ShippingRate) {
    let requestData: CreateShippingRate = {};
    requestData = {
      ...requestData,
      ...buildShippingRate(values),
    };

    return requestData;
  }

  function buildUpdateData(values: ShippingRate) {
    let requestData: UpdateShippingRate = {
      id: values?.id || 0,
    };

    requestData = {
      ...requestData,
      ...buildShippingRate(values),
    };
    return requestData;
  }
  async function handleSubmit(values: ShippingRate) {
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
          throw new Error("Shipping rate ID is required");
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.shippingMethodRate.replace(
              ":shippingMethodId",
              shippingMethodId?.toString()
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
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.shippingMethodRate.replace(
              ":shippingMethodId",
              shippingMethodId?.toString()
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
      DataManagerService.getId(MANAGE_SHIPPING_RATE_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_SHIPPING_RATE_ID, "create")
    );
    return true;
  }

  function getRequiredFields() {
    let requiredFields: any = {};
    if (operation === "edit" || operation === "update") {
      requiredFields = {
        id: true,
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
          ) && <EditShippingRateFields operation={operation} />}
        {!inModal && (
          <Form
            operation={operation}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {() => {
              return <EditShippingRateFields operation={operation} />;
            }}
          </Form>
        )}
      </div>
    </div>
  );
}
export default EditShippingRate;
