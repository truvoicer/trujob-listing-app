import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_SHIPPING_RESTRICTION_ID } from "./ManageShippingRestriction";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditShippingRestrictionFields from "./EditShippingRestrictionFields";
import { ModalService } from "@/library/services/modal/ModalService";
import {
  ShippingRestriction,
  CreateShippingRestriction,
  UpdateShippingRestriction,
  ShippingRestrictionRequest,
  BulkShippingRestriction,
} from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";
import ShippingProvider from "@/components/Provider/Shipping/ShippingProvider";

export function buildBulkRestrictionRequestData(values: ShippingRestriction[]) {
  if (!Array.isArray(values)) {
    return [];
  }
  return values
    .filter((value) => {
      return value?.restriction_id && value?.type;
    })
    .map((value) => {
      return {
        action: value?.action || "allow",
        type: value?.type || "",
        restriction_id: value?.restriction_id || 0,
      };
    });
}

export type EditShippingRestrictionProps = {
  data?: ShippingRestriction;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
  shippingMethodId?: number;
};
function EditShippingRestriction({
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
  shippingMethodId,
}: EditShippingRestrictionProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

  const initialValues: ShippingRestriction & BulkShippingRestriction = {
    id: data?.id || 0,
    type: data?.type || "",
    restriction_id: data?.restriction_id || 0,
    action: data?.action || "allow",
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
  };

  if (data?.category) {
    initialValues.category = data?.category;
  }
  if (data?.product) {
    initialValues.product = data?.product;
  }
  if (data?.country) {
    initialValues.country = data?.country;
  }
  if (data?.region) {
    initialValues.region = data?.region;
  }
  if (data?.currency) {
    initialValues.currency = data?.currency;
  }

  function buildRequestData(values: ShippingRestriction) {
    const requestData: ShippingRestrictionRequest = {
      action: values?.action || "allow",
    };
    return requestData;
  }

  function buildCreateData(values: ShippingRestriction) {
    const requestData: CreateShippingRestriction = {
      type: values?.type,
      restriction_id: values?.restriction_id || 0,
      ...buildRequestData(values),
    };

    return requestData;
  }

  function buildUpdateData(values: ShippingRestriction) {
    const requestData: UpdateShippingRestriction = {
      id: values?.id || 0,
      ...buildRequestData(values),
    };

    return requestData;
  }
  async function handleSubmit(values: ShippingRestriction) {
    if (["edit", "update"].includes(operation) && isObjectEmpty(values)) {
      console.log("No data to update");
      return false;
    }

    if (Array.isArray(values?.items)) {
      return false;
    }

    if (!shippingMethodId) {
      throw new Error("Shipping method ID is required");
    }

    let response = null;

    switch (operation) {
      case "edit":
      case "update":
        if (!values?.id) {
          throw new Error("Shipping restriction ID is required");
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.shippingRestriction.replace(
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
            truJobApiConfig.endpoints.shippingRestriction.replace(
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
      DataManagerService.getId(MANAGE_SHIPPING_RESTRICTION_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_SHIPPING_RESTRICTION_ID, "create")
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
            ) && <EditShippingRestrictionFields operation={operation} />}
          {!inModal && (
            <Form
              operation={operation}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {() => {
                return <EditShippingRestrictionFields operation={operation} />;
              }}
            </Form>
          )}
        </div>
      </div>
    </ShippingProvider>
  );
}
export default EditShippingRestriction;
