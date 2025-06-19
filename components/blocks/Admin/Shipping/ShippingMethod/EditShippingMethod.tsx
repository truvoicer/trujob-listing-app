import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_SHIPPING_METHOD_ID } from "./ManageShippingMethod";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditShippingMethodFields from "./EditShippingMethodFields";
import { ModalService } from "@/library/services/modal/ModalService";
import {
  ShippingMethod,
  CreateShippingMethod,
  UpdateShippingMethod,
  CreateShippingRate,
  ShippingRateRequest,
} from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { min } from "underscore";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";
import {
  buildShippingRate,
  buildShippingRates,
} from "../ShippingRate/EditShippingRate";
import { buildBulkRestrictionRequestData } from "../ShippingRestriction/EditShippingRestriction";
import ShippingProvider from "@/components/Provider/Shipping/ShippingProvider";

export type EditShippingMethodProps = {
  data?: ShippingMethod;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
};
function EditShippingMethod({
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
}: EditShippingMethodProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const initialValues: ShippingMethod = {
    id: data?.id || 0,
    name: data?.name || "",
    description: data?.description || "",
    processing_time_days: data?.processing_time_days || 0,
    display_order: data?.display_order || 0,
    is_active: data?.is_active || false,
    rates: data?.rates || [],
    restrictions: data?.restrictions || [],
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
  };

  function buildRequestData(values: ShippingMethod) {
    let requestData: CreateShippingMethod | UpdateShippingMethod = {};
    if (values?.name) {
      requestData.name = values?.name || "";
    }
    if (values?.description) {
      requestData.description = values?.description || "";
    }
    if (values.hasOwnProperty("processing_time_days")) {
      requestData.processing_time_days = values?.processing_time_days || 0;
    }
    if (values.hasOwnProperty("is_active")) {
      requestData.is_active = values?.is_active || false;
    }
    if (Array.isArray(values?.rates)) {
      requestData.rates = buildShippingRates(values?.rates || []);
    }
    if (Array.isArray(values?.restrictions)) {
      requestData.restrictions = buildBulkRestrictionRequestData(
        values.restrictions || []
      );
    }
    console.log("Request Data:", {requestData, values});

    return requestData;
  }

  function buildCreateData(values: ShippingMethod) {
    const requestData: CreateShippingMethod = {
      name: values?.name || "",
      description: values?.description || "",
      processing_time_days: values?.processing_time_days || 0,
      is_active: values?.is_active || false,
      rates: buildShippingRates(values?.rates || []),
    };

    return requestData;
  }

  function buildUpdateData(values: ShippingMethod) {
    let requestData: UpdateShippingMethod = {
      id: values?.id || 0,
    };
    requestData = {
      ...requestData,
      ...buildRequestData(values),
    };
    return requestData;
  }
  async function handleSubmit(values: ShippingMethod) {
    console.log("Submitting values:", values);
    if (["edit", "update"].includes(operation) && isObjectEmpty(values)) {
      console.log("No data to update");
      return false;
    }

    let response = null;

    switch (operation) {
      case "edit":
        if (!values?.id) {
          throw new Error("ShippingMethod ID is required");
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.shippingMethod,
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
        if (Array.isArray(values?.shippingMethods)) {
          return;
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.shippingMethod,
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
      DataManagerService.getId(MANAGE_SHIPPING_METHOD_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_SHIPPING_METHOD_ID, "create")
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
            ) && <EditShippingMethodFields operation={operation} />}
          {!inModal && (
            <Form
              operation={operation}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {() => {
                return <EditShippingMethodFields operation={operation} />;
              }}
            </Form>
          )}
        </div>
      </div>
    </ShippingProvider>
  );
}
export default EditShippingMethod;
