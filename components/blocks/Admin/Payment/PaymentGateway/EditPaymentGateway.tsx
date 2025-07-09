import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_PAYMENT_GATEWAY_ID } from "./ManagePaymentGateway";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditPaymentGatewayFields from "./EditPaymentGatewayFields";
import { ModalService } from "@/library/services/modal/ModalService";
import {
  PaymentGateway,
  CreatePaymentGateway,
  UpdatePaymentGateway,
} from "@/types/PaymentGateway";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export type EditPaymentGatewayProps = {
  data?: PaymentGateway;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
};
function EditPaymentGateway({
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
}: EditPaymentGatewayProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const initialValues: PaymentGateway = {
    id: data?.id || 0,
    label: data?.label || "",
    name: data?.name || "",
    description: data?.description || "",
    is_active: data?.is_active || false,
    is_default: data?.is_default || false,
    required_fields: data?.required_fields || [],
    settings: data?.settings || {},
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
  };

  function buildCreateData(values: PaymentGateway) {
    const requestData: CreatePaymentGateway = {
      name: values?.name || "",
      label: values?.label || "",
      description: values?.description || "",
      icon: values?.icon || "",
      is_active: values?.is_active || false,
      is_default: values?.is_default || false,
      settings: values?.settings || {},
      required_fields: values?.required_fields || [],
    };

    return requestData;
  }

  function buildUpdateData(values: PaymentGateway) {
    const requestData: UpdatePaymentGateway = {
      id: values?.id || 0,
    };
    if (values?.name) {
      requestData.name = values?.name || "";
    }
    if (values?.label) {
      requestData.label = values?.label || "";
    }
    if (values?.description) {
      requestData.description = values?.description || "";
    }
    if (values?.icon) {
      requestData.icon = values?.icon || "";
    }
    if (values.hasOwnProperty("is_active")) {
      requestData.is_active = values?.is_active || false;
    }
    if (values.hasOwnProperty("is_default")) {
      requestData.is_default = values?.is_default || false;
    }
    if (values?.settings) {
      requestData.settings = values?.settings || {};
    }
    if (Array.isArray(values?.required_fields)) {
      requestData.required_fields = values?.required_fields || [];
    }
    return requestData;
  }
  async function handleSubmit(values: PaymentGateway) {
    if (["edit", "update"].includes(operation) && isObjectEmpty(values)) {
      console.log("No data to update");
      return false;
    }

    let response = null;
    let requestData: CreatePaymentGateway | UpdatePaymentGateway;
    switch (operation) {
      case "edit":
      case "update":
        requestData = buildUpdateData(values);

        if (!values?.id) {
          throw new Error("PaymentGateway ID is required");
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.paymentGateway,
            values.id,
            "update",
          ]),
          method: ApiMiddleware.METHOD.PATCH,
          protectedReq: true,
          data: requestData,
        });
        break;
      case "add":
      case "create":
        requestData = buildCreateData(values);
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.paymentGateway,
            "store",
          ]),
          method: ApiMiddleware.METHOD.POST,
          protectedReq: true,
          data: requestData,
        });
        break;
      default:
        console.log("Invalid operation");
        return false;
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
      DataManagerService.getId(MANAGE_PAYMENT_GATEWAY_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_PAYMENT_GATEWAY_ID, "create")
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
          ) && <EditPaymentGatewayFields operation={operation} />}
        {!inModal && (
          <Form
            operation={operation}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {() => {
              return <EditPaymentGatewayFields operation={operation} />;
            }}
          </Form>
        )}
      </div>
    </div>
  );
}
export default EditPaymentGateway;
