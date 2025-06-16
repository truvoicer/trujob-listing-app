import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditProductCategory from "./EditProductCategory";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { Category } from "@/types/Category";
import Loader from "@/components/Loader";

export interface ManageProductCategoryProps extends DataManageComponentProps {
  data?: Array<Category>;
  productId?: number;
}
export const EDIT_PRODUCT_CATEGORY_MODAL_ID = "edit-product-category-modal";
export const CREATE_PRODUCT_CATEGORY_MODAL_ID = "create-product-category-modal";
export const DELETE_PRODUCT_CATEGORY_MODAL_ID = "delete-product-category-modal";
export const MANAGE_PRODUCT_CATEGORY_ID = "manage-product-category-modal";

function ManageProductCategory({
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
}: ManageProductCategoryProps) {

  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productCategory.replace(
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
              truJobApiConfig.endpoints.productCategory.replace(
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
              truJobApiConfig.endpoints.productCategory.replace(
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
        id={MANAGE_PRODUCT_CATEGORY_ID}
        editFormComponent={{
          component: EditProductCategory,
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
        title={"Manage Products Categories"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Label", key: "label" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManageProductCategory;
