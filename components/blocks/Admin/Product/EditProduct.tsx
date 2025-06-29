import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_PRODUCT_ID } from "./ManageProduct";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import {
  CreateProduct,
  Product,
  ProductRequest,
  UpdateProduct,
} from "@/types/Product";
import EditProductFields from "./EditProductFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export type EditProductProps = {
  data?: Product;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
};
function EditProduct({
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
}: EditProductProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const initialValues: Product = {
    id: data?.id || 0,
    name: data?.name || "",
    title: data?.title || "",
    description: data?.description || "",
    active: data?.active || false,
    allow_offers: data?.allow_offers || false,
    quantity: data?.quantity || 0,
    type: data?.type || null,
    has_weight: data?.has_weight || false,
    has_height: data?.has_height || false,
    has_length: data?.has_length || false,
    has_width: data?.has_width || false,
    weight_unit: data?.weight_unit || "kg",
    height_unit: data?.height_unit || "cm",
    length_unit: data?.length_unit || "cm",
    width_unit: data?.width_unit || "cm",
    weight: data?.weight || 0,
    height: data?.height || 0,
    length: data?.length || 0,
    width: data?.width || 0,
    user: data?.user || {
      id: data?.user?.id || 0,
      first_name: data?.user?.first_name || "",
      last_name: data?.user?.last_name || "",
      username: data?.user?.username || "",
      email: data?.user?.email || "",
      created_at: data?.user?.created_at || "",
      updated_at: data?.user?.updated_at || "",
    },
    follows: data?.follows || [],
    features: data?.features || [],
    reviews: data?.reviews || [],
    categories: data?.categories || [],
    brands: data?.brands || [],
    colors: data?.colors || [],
    product_categories: data?.product_categories || [],
    prices: data?.prices || [],
    media: data?.media || [],
    created_at: data?.created_at || "",
    updated_at: data?.updated_at || "",
  };

  function buildRequestData(values: Product) {
    let requestData: ProductRequest = {
      name: values.name,
      title: values.title,
    };
    if (values.hasOwnProperty("active")) {
      requestData.active = values.active;
    }
    if (values.hasOwnProperty("description")) {
      requestData.description = values.description;
    }
    if (values.hasOwnProperty("allow_offers")) {
      requestData.allow_offers = values.allow_offers;
    }
    if (values.hasOwnProperty("quantity")) {
      requestData.quantity = values.quantity;
    }
    if (values.hasOwnProperty("type")) {
      requestData.type = values.type;
    }

    if (values?.has_weight) {
      requestData.has_weight = values?.has_weight || false;
      requestData.weight_unit = values?.weight_unit || "kg";
      requestData.weight = values?.weight
        ? parseFloat(values?.weight.toString())
        : 0;
    }
    if (values?.has_height) {
      requestData.has_height = values?.has_height || false;
      requestData.height_unit = values?.height_unit || "cm";
      requestData.height = values?.height
        ? parseFloat(values?.height.toString())
        : 0;
    }
    if (values?.has_length) {
      requestData.has_length = values?.has_length || false;
      requestData.length_unit = values?.length_unit || "cm";
      requestData.length = values?.length
        ? parseFloat(values?.length.toString())
        : 0;
    }
    if (values?.has_width) {
      requestData.has_width = values?.has_width || false;
      requestData.width_unit = values?.width_unit || "cm";
      requestData.width = values?.width
        ? parseFloat(values?.width.toString())
        : 0;
    }

    if (values?.currency?.id) {
      requestData.currency_id = values?.currency?.id;
    }
    if (values.hasOwnProperty("user")) {
      requestData.user = values.user.id;
    }
    if (Array.isArray(values?.follows)) {
      requestData.follows = RequestHelpers.extractIdsFromArray(values.follows);
    }
    if (Array.isArray(values?.features)) {
      requestData.features = RequestHelpers.extractIdsFromArray(
        values.features
      );
    }
    if (Array.isArray(values?.reviews)) {
      requestData.reviews = values.reviews;
    }
    if (Array.isArray(values?.categories)) {
      requestData.categories = RequestHelpers.extractIdsFromArray(
        values.categories
      );
    }
    if (Array.isArray(values?.brands)) {
      requestData.brands = RequestHelpers.extractIdsFromArray(values.brands);
    }
    if (Array.isArray(values?.colors)) {
      requestData.colors = RequestHelpers.extractIdsFromArray(values.colors);
    }
    if (Array.isArray(values?.product_categories)) {
      requestData.product_categories = RequestHelpers.extractIdsFromArray(
        values.product_categories
      );
    }
    if (Array.isArray(values?.media)) {
      requestData.media = [];
    }
    return requestData;
  }

  function buildCreateData(values: Product) {
    console.log("buildCreateData", { values });
    if (!values?.type) {
      console.warn("Product type is required");
      return;
    }
    let requestData: CreateProduct = {
      name: values.name,
      title: values.title,
      active: values?.active || false,
      type: values.type,
    };
    requestData = {
      ...requestData,
      ...buildRequestData(values),
    };

    return requestData;
  }

  function buildUpdateData(values: Product) {
    let requestData: UpdateProduct = {
      id: data?.id || 0,
    };
    requestData = {
      ...requestData,
      ...buildRequestData(values),
    };

    return requestData;
  }

  async function handleSubmit(values: Product) {
    if (["edit", "update"].includes(operation) && isObjectEmpty(values)) {
      console.warn("No data to update");
      return false;
    }

    let response = null;
    let requestData: CreateProduct | UpdateProduct;
    switch (operation) {
      case "edit":
      case "update":
        requestData = buildUpdateData(values);
        console.log("edit requestData", { requestData, values });
        if (!data?.id) {
          throw new Error("Product ID is required");
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: `${truJobApiConfig.endpoints.product}/${data.id}/update`,
          method: ApiMiddleware.METHOD.PATCH,
          protectedReq: true,
          data: requestData,
        });
        break;
      case "add":
      case "create":
        requestData = buildCreateData(values);
        console.log("create requestData", { requestData, values });
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: `${truJobApiConfig.endpoints.product}/create`,
          method: ApiMiddleware.METHOD.POST,
          protectedReq: true,
          data: requestData,
        });
        break;
      default:
        console.log("Invalid operation");
        break;
    }
    console.log("response", { response });
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
      DataManagerService.getId(MANAGE_PRODUCT_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_PRODUCT_ID, "create")
    );
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
          ) && <EditProductFields operation={operation} />}
        {!inModal && (
          <Form
            operation={operation}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {() => {
              return <EditProductFields operation={operation} />;
            }}
          </Form>
        )}
      </div>
    </div>
  );
}
export default EditProduct;
