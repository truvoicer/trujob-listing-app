import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_PRODUCT_PRICE_ID } from "./ManageProductPrice";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditProductPriceFields from "./EditProductPriceFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { CreatePrice, Price, PriceRequest, UpdatePrice } from "@/types/Price";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import {
  getSiteCountryAction,
  getSiteCurrencyAction,
} from "@/library/redux/actions/site-actions";
import { DataTableContextType } from "@/components/Table/DataManager";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";
import { LocaleService } from "@/library/services/locale/LocaleService";
import moment from "moment";

export type EditProductPriceProps = {
  productId?: number;
  data?: Price;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
};
function EditProductPrice({
  productId,
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
}: EditProductPriceProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const dataTableContext = useContext(DataTableContext);
  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

  const country = LocaleService.getCountry();
  const currency = LocaleService.getCurrency();

  const initialValues: Price = {
    id: data?.id || 0,
    created_by_user: data?.created_by_user,
    country: data?.country || country || null,
    currency: data?.currency || currency || null,
    price_type: data?.price_type,
    valid_from: data?.valid_from || "",
    valid_to: data?.valid_to || "",
    valid_from_timestamp: data?.valid_from_timestamp || 0,
    valid_to_timestamp: data?.valid_to_timestamp || 0,
    is_active: data?.is_active || false,
    tax_rates: data?.tax_rates || [],
    discounts: data?.discounts || [],
    amount: data?.amount || 0,
    start_time: data?.start_time || moment().toISOString(),
    has_setup_fee: data?.has_setup_fee || false,
    setup_fee_value: data?.setup_fee_value || 0,
    setup_fee_currency: data?.setup_fee_currency || currency || null,
    auto_bill_outstanding: data?.auto_bill_outstanding || true,
    setup_fee_failure_action: data?.setup_fee_failure_action || "CANCEL",
    payment_failure_threshold: data?.payment_failure_threshold || 0,
    items: data?.items || [],
    label: data?.label || "",
    description: data?.description || "",
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
  };

  function buildRequestData(values: Price) {
    let requestData: PriceRequest = {};

    if (values?.country) {
      requestData.country_id = values?.country?.id;
    }
    if (values?.currency) {
      requestData.currency_id = values?.currency?.id;
    }
    if (values?.price_type) {
      requestData.price_type = values?.price_type?.name;
    }
    if (values?.created_by_user) {
      requestData.created_by_user_id = values?.created_by_user?.id;
    }
    if (values?.valid_from) {
      requestData.valid_from = values?.valid_from;
    }
    if (values?.valid_to) {
      requestData.valid_to = values?.valid_to;
    }
    if (values.hasOwnProperty("is_active")) {
      requestData.is_active = values?.is_active;
    }
    if (values.hasOwnProperty("amount")) {
      requestData.amount = values?.amount;
    }
    if (Array.isArray(values?.tax_rates) && values?.tax_rates.length > 0) {
      requestData.tax_rate_ids = RequestHelpers.extractIdsFromArray(
        values.tax_rates
      );
    }
    if (Array.isArray(values?.discounts) && values?.discounts.length > 0) {
      requestData.discount_ids = RequestHelpers.extractIdsFromArray(
        values.discounts
      );
    }
    if (values?.label) {
      requestData.label = values?.label;
    }
    if (values?.description) {
      requestData.description = values?.description;
    }

    if (values.hasOwnProperty("setup_fee_value")) {
      requestData.setup_fee_value = values?.setup_fee_value || 0;
    }
    if (values?.setup_fee_currency) {
      requestData.setup_fee_currency_id =
        values?.setup_fee_currency?.id || currency?.id;
    }
    if (values?.start_time) {
      requestData.start_time = moment(values?.start_time).toISOString();
    }
    if (values.hasOwnProperty("has_setup_fee")) {
      requestData.has_setup_fee = values?.has_setup_fee || false;
    }

    if (values.hasOwnProperty("auto_bill_outstanding")) {
      requestData.auto_bill_outstanding = values?.auto_bill_outstanding;
    }
    if (values?.setup_fee_failure_action) {
      requestData.setup_fee_failure_action = values?.setup_fee_failure_action;
    }
    if (values.hasOwnProperty("payment_failure_threshold")) {
      requestData.payment_failure_threshold = values?.payment_failure_threshold;
    }
    if (Array.isArray(values?.items) && values?.items.length > 0) {
      requestData.items = values.items.map((item) => {
        const cloneItem: Record<string, unknown> = {};
        if (item?.id) {
          cloneItem.id = item.id;
        }
        if (item?.price?.currency?.id) {
          cloneItem.price = {
            value: item.price.value || 0,
            currency_id: item.price.currency.id,
          };
        }
        if (item?.frequency) {
          cloneItem.frequency = item.frequency;
        }
        if (item?.tenure_type) {
          cloneItem.tenure_type = item.tenure_type;
        }
        if (item.hasOwnProperty("sequence")) {
          cloneItem.sequence = parseInt(item.sequence);
        }
        if (item.hasOwnProperty("total_cycles")) {
          cloneItem.total_cycles = parseInt(item.total_cycles);
        }
        return cloneItem;
      });
    }
    return requestData;
  }

  function buildCreateData(values: Price) {
    let requestData: CreatePrice = {};
    requestData = {
      ...requestData,
      ...buildRequestData(values),
    };
    return requestData;
  }
  function buildUpdateData(values: Price) {
    let requestData: UpdatePrice = {
      id: values?.id || 0,
    };

    if (values?.created_by_user) {
      requestData.created_by_user_id = values?.created_by_user?.id;
    }
    requestData = {
      ...requestData,
      ...buildRequestData(values),
    };
    console.log("Update Request Data", requestData, values);
    return requestData;
  }

  async function handleSubmit(values: Price) {
    console.log("handleSubmit", { values });
    if (["edit", "update"].includes(operation) && isObjectEmpty(values)) {
      console.warn("No data to update");
      return false;
    }

    if (!productId) {
      console.warn("Product ID is required");
      return false;
    }

    let response = null;

    switch (operation) {
      case "edit":
      case "update":
        if (!values?.id) {
          console.warn("Product review ID is required");
          return false;
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: UrlHelpers.urlFromArray([
            truJobApiConfig.endpoints.productPrice.replace(
              ":productId",
              productId.toString()
            ),
            values?.id,
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
            truJobApiConfig.endpoints.productPrice.replace(
              ":productId",
              productId.toString()
            ),
            "store",
          ]),
          method: ApiMiddleware.METHOD.POST,
          protectedReq: true,
          data: buildCreateData(values),
        });
        break;
      default:
        console.warn("Invalid operation");
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
      DataManagerService.getId(MANAGE_PRODUCT_PRICE_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_PRODUCT_PRICE_ID, "create")
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

    dataTableContext.modal.update(
      {
        formProps: {
          operation: operation,
          initialValues: initialValues,
          requiredFields: getRequiredFields(),
          onSubmit: handleSubmit,
        },
      },
      modalId
    );
  }, [inModal, modalId]);

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
          ) && <EditProductPriceFields operation={operation} />}
        {!inModal && (
          <Form
            operation={operation}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            requiredFields={getRequiredFields()}
          >
            {() => {
              return <EditProductPriceFields operation={operation} />;
            }}
          </Form>
        )}
      </div>
    </div>
  );
}
export default EditProductPrice;
