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
  if (rate?.amount) {
    shippingRate.amount = parseFloat(rate?.amount.toString()) || 0;
  }
  if (rate?.weight_limit) {
    shippingRate.weight_limit = rate?.weight_limit || false;
    shippingRate.weight_unit = rate?.weight_unit || "kg";
    shippingRate.min_weight = rate?.min_weight
      ? parseFloat(rate?.min_weight.toString())
      : 0;
    shippingRate.max_weight = rate?.max_weight
      ? parseFloat(rate?.max_weight.toString())
      : 0;
  }
  if (rate?.height_limit) {
    shippingRate.height_limit = rate?.height_limit || false;
    shippingRate.height_unit = rate?.height_unit || "cm";
    shippingRate.min_height = rate?.min_height
      ? parseFloat(rate?.min_height.toString())
      : 0;
    shippingRate.max_height = rate?.max_height
      ? parseFloat(rate?.max_height.toString())
      : 0;
  }
  if (rate?.length_limit) {
    shippingRate.length_limit = rate?.length_limit || false;
    shippingRate.length_unit = rate?.length_unit || "cm";
    shippingRate.min_length = rate?.min_length
      ? parseFloat(rate?.min_length.toString())
      : 0;
    shippingRate.max_length = rate?.max_length
      ? parseFloat(rate?.max_length.toString())
      : 0;
  }
  if (rate?.width_limit) {
    shippingRate.width_limit = rate?.width_limit || false;
    shippingRate.width_unit = rate?.width_unit || "cm";
    shippingRate.min_width = rate?.min_width
      ? parseFloat(rate?.min_width.toString())
      : 0;
    shippingRate.max_width = rate?.max_width
      ? parseFloat(rate?.max_width.toString())
      : 0;
  }

  if (rate?.currency?.id) {
    shippingRate.currency_id = rate?.currency?.id;
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
    weight_limit: data?.weight_limit || false,
    height_limit: data?.height_limit || false,
    length_limit: data?.length_limit || false,
    width_limit: data?.width_limit || false,
    weight_unit: data?.weight_unit || "kg",
    height_unit: data?.height_unit || "cm",
    length_unit: data?.length_unit || "cm",
    width_unit: data?.width_unit || "cm",
    min_weight: data?.min_weight || 0,
    max_weight: data?.max_weight || 0,
    min_height: data?.min_height || 0,
    max_height: data?.max_height || 0,
    min_length: data?.min_length || 0,
    max_length: data?.max_length || 0,
    min_width: data?.min_width || 0,
    max_width: data?.max_width || 0,
    amount: data?.amount || 0,
    currency: data?.currency || null,
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
  };


  function buildCreateData(values: ShippingRate) {
    let requestData: CreateShippingRate = {
      name: values?.name || "",
      country_ids: RequestHelpers.extractIdsFromArray(values?.countries || []),
      is_active: values?.is_active || false,
    };
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
    if (values?.name) {
      requestData.name = values?.name || "";
    }
    if (Array.isArray(values?.countries) && values?.countries.length > 0) {
      requestData.country_ids = RequestHelpers.extractIdsFromArray(
        values?.countries || []
      );
    }
    if (values?.hasOwnProperty("is_active")) {
      requestData.is_active = values?.is_active || false;
    }

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
