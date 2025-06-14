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
} from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { min } from "underscore";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

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
    carrier: data?.carrier || "",
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
    if (values?.carrier) {
      requestData.carrier = values?.carrier || "";
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

    return requestData;
  }

  function buildShippingRates(rates: any[]) {
    return rates.map((rate) => {
      let shippingRate: CreateShippingRate = {};
      if (rate?.shipping_method_id) {
        shippingRate.shipping_method_id = rate?.shipping_method_id || "";
      }
      if (rate?.shipping_zone_id) {
        shippingRate.shipping_zone_id = rate?.shipping_zone_id || "";
      }
      if (rate?.type) {
        shippingRate.type = rate?.type || "";
      }
      if (rate?.amount) {
        shippingRate.amount = parseFloat(rate?.amount) || 0;
      }
      if (rate?.weight_limit) {
        shippingRate.weight_limit = rate?.weight_limit || false;
        if (rate?.min_weight) {
          shippingRate.min_weight = parseFloat(rate?.min_weight) || 0;
        }
        if (rate?.max_weight) {
          shippingRate.max_weight = parseFloat(rate?.max_weight) || 0;
        }
      }
      if (rate?.height_limit) {
        shippingRate.height_limit = rate?.height_limit || false;
        if (rate?.min_height) {
          shippingRate.min_height = parseFloat(rate?.min_height) || 0;
        }
        if (rate?.max_height) {
          shippingRate.max_height = parseFloat(rate?.max_height) || 0;
        }
      }
      if (rate?.length_limit) {
        shippingRate.length_limit = rate?.length_limit || false;
        if (rate?.min_length) {
          shippingRate.min_length = parseFloat(rate?.min_length) || 0;
        }
        if (rate?.max_length) {
          shippingRate.max_length = parseFloat(rate?.max_length) || 0;
        }
      }
      if (rate?.width_limit) {
        shippingRate.width_limit = rate?.width_limit || false;
        if (rate?.min_width) {
          shippingRate.min_width = parseFloat(rate?.min_width) || 0;
        }
        if (rate?.max_width) {
          shippingRate.max_width = parseFloat(rate?.max_width) || 0;
        }
      }

      if (rate?.currency?.id) {
        shippingRate.currency_id = rate?.currency?.id || "";
      }
      if (rate.hasOwnProperty("is_free_shipping_possible")) {
        shippingRate.is_free_shipping_possible =
          rate?.is_free_shipping_possible || false;
      }
      if (rate?.shipping_zone?.id) {
        shippingRate.shipping_zone_id = rate?.shipping_zone?.id || "";
      }
      return shippingRate;
    });
  }

  function buildCreateData(values: ShippingMethod) {
    let requestData: CreateShippingMethod = {
      carrier: values?.carrier || "",
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
  );
}
export default EditShippingMethod;
