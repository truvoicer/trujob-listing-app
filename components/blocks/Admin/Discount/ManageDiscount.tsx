import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditDiscount from "./EditDiscount";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Discount } from "@/types/Discount";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const CREATE_DISCOUNT_MODAL_ID = "create-discount-modal";
export const EDIT_DISCOUNT_MODAL_ID = "edit-discount-modal";
export const DELETE_DISCOUNT_MODAL_ID = "delete-discount-modal";
export const MANAGE_DISCOUNT_ID = "manage-discount-modal";

export interface ManageDiscountProps extends DataManageComponentProps {
  data?: Array<Discount>;
}

function ManageDiscount({
  isChild = false,
  mode = "selector",
  data,
  operation = "create",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageDiscountProps) {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        isChild={isChild}
        data={data}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.discount}/bulk/destroy`,
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
              truJobApiConfig.endpoints.discount,
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
              truJobApiConfig.endpoints.discount,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_DISCOUNT_ID}
        editFormComponent={EditDiscount}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Discounts"}
        columns={[
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Icon", key: "icon" },
          { label: "Is Active", key: "is_active" },
          { label: "Is Default", key: "is_default" },
          { label: "Created At", key: "created_at" },
          { label: "Updated At", key: "updated_at" },
        ]}
      />
    </Suspense>
  );
}
export default ManageDiscount;
