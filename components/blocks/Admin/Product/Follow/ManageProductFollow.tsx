import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditProductFollow from "./EditProductFollow";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { User } from "@/types/User";
import Loader from "@/components/Loader";

export interface ManageProductFollowProps extends DataManageComponentProps {
  data?: Array<User>;
  productId?: number;
}
export const EDIT_PRODUCT_FOLLOW_MODAL_ID = "edit-product-follow-modal";
export const CREATE_PRODUCT_FOLLOW_MODAL_ID = "create-product-follow-modal";
export const DELETE_PRODUCT_FOLLOW_MODAL_ID = "delete-product-follow-modal";
export const MANAGE_PRODUCT_FOLLOW_ID = "manage-product-follow-modal";

function ManageProductFollow({
  columnHandler,
  isChild = false,
  
  data,
  mode = "selector",
  operation,
  productId,
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageProductFollowProps) {

  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productFollow.replace(
                ":productId",
                productId.toString()
              ),
              "bulk",
              "destroy",
            ]),
            method: ApiMiddleware.METHOD.DELETE,
            protectedReq: true,
            data: {
              user_ids: ids,
            },
          });
        }}
        deleteItemRequest={async ({ item }: { item: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productFollow.replace(
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
              truJobApiConfig.endpoints.productFollow.replace(
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
        id={MANAGE_PRODUCT_FOLLOW_ID}
        editFormComponent={{
          component: EditProductFollow,
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
        title={"Manage Products Followers"}
        columns={[
          { label: "ID", key: "id" },
          { label: "First name", key: "first_name" },
          { label: "Last name", key: "last_name" },
          { label: "Email", key: "email" },
        ]}
      />
    </Suspense>
  );
}
export default ManageProductFollow;
