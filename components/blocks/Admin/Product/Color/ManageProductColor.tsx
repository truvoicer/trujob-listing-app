import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditProductColor from "./EditProductColor";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { Color } from "react-bootstrap/esm/types";
import Loader from "@/components/Loader";

export interface ManageProductColorProps extends DataManageComponentProps {
  data?: Array<Color>;
  productId?: number;
}
export const EDIT_PRODUCT_COLOR_MODAL_ID = "edit-product-color-modal";
export const CREATE_PRODUCT_COLOR_MODAL_ID = "create-product-color-modal";
export const DELETE_PRODUCT_COLOR_MODAL_ID = "delete-product-color-modal";
export const MANAGE_PRODUCT_COLOR_ID = "manage-product-color-modal";

function ManageProductColor({
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
}: ManageProductColorProps) {

  return (
    <Suspense fallback={<Loader/>}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productColor.replace(
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
              truJobApiConfig.endpoints.productColor.replace(
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
              truJobApiConfig.endpoints.productColor.replace(
                ":productId",
                productId.toString()
              ),
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_PRODUCT_COLOR_ID}
        editFormComponent={{
          component: EditProductColor,
          props: {
            productId: productId,
          }
        }}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Product Colors"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Label", key: "label" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManageProductColor;
