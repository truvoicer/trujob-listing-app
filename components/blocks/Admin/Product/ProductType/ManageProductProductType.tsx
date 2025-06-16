import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditProductProductType from "./EditProductProductType";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ProductType } from "@/types/Product";
import Loader from "@/components/Loader";

export interface ManageProductProductTypeProps
  extends DataManageComponentProps {
  data?: Array<ProductType>;
  productId?: number;
}
export const EDIT_PRODUCT_PRODUCT_TYPE_MODAL_ID =
  "edit-product-product-type-modal";
export const DELETE_PRODUCT_PRODUCT_TYPE_MODAL_ID =
  "delete-product-product-type-modal";
export const CREATE_PRODUCT_PRODUCT_TYPE_MODAL_ID =
  "create-product-product-type-modal";
export const MANAGE_PRODUCT_PRODUCT_TYPE_ID =
  "manage-product-product-type-modal";

function ManageProductProductType({
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
}: ManageProductProductTypeProps) {

  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productProductType.replace(
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
              truJobApiConfig.endpoints.productProductType.replace(
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
              truJobApiConfig.endpoints.productProductType.replace(
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
        id={MANAGE_PRODUCT_PRODUCT_TYPE_ID}
        editFormComponent={{
          component: EditProductProductType,
          props: {
            productId: productId,
          },
        }}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Product Types"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Label", key: "label" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManageProductProductType;
