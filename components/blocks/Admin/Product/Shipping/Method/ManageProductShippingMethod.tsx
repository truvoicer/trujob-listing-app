import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditProductShippingMethod from "./EditProductShippingMethod";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ShippingMethod } from "@/types/Shipping";
import Loader from "@/components/Loader";

export interface ManageProductShippingMethodProps extends DataManageComponentProps {
  data?: Array<ShippingMethod>;
  productId?: number;
}
export const EDIT_PRODUCT_SHIPPING_METHOD_MODAL_ID = "edit-shippingMethod-product-modal";
export const CREATE_PRODUCT_SHIPPING_METHOD_MODAL_ID = "create-shippingMethod-product-modal";
export const DELETE_PRODUCT_SHIPPING_METHOD_MODAL_ID = "delete-shippingMethod-product-modal";
export const MANAGE_PRODUCT_SHIPPING_METHOD_ID = "manage-shippingMethod-product-modal";

function ManageProductShippingMethod({
  columnHandler,
  isChild = false,
  
  mode = "selector",
  data,
  operation,
  productId,
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
  enableDelete = true,
}: ManageProductShippingMethodProps) {

  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productShippingMethod.replace(
                ":productId",
                productId.toString()
              ),
              "bulk",
              "destroy",
            ]),
            method: ApiMiddleware.METHOD.DELETE,
            protectedReq: true,
            data: {
              ids: ids,
            },
          });
        }}
        deleteItemRequest={async ({ item }: { item: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productShippingMethod.replace(
                ":productId",
                productId.toString()
              ),
              item.id,
              "destroy",
            ]),
            method: ApiMiddleware.METHOD.DELETE,
            protectedReq: true,
          });
        }}
        fetchItemsRequest={async ({
          post,
          query,
        }: {
          post?: Record<string, any>;
          query?: Record<string, any>;
        }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productShippingMethod.replace(
                ":productId",
                productId.toString()
              ),
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_PRODUCT_SHIPPING_METHOD_ID}
        editFormComponent={{
          component: EditProductShippingMethod,
          props: {
            productId: productId,
          },
        }}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        enableDelete={enableDelete}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Products Shipping Methods"}
        columns={[
          { label: "Carrier", key: "name" },
          { label: "Description", key: "description" },
          { label: "Processing Time (Days)", key: "processing_time_days" },
          { label: "Display Order", key: "display_order" },
          { label: "Is Active", key: "is_active", type: "boolean" },
          { label: "Created At", key: "created_at", type: "date", date_format: "Do MMMM YYYY h:mm:ss a" },
          { label: "Updated At", key: "updated_at", type: "date", date_format: "Do MMMM YYYY h:mm:ss a" },
        ]}
      />
    </Suspense>
  );
}
export default ManageProductShippingMethod;
