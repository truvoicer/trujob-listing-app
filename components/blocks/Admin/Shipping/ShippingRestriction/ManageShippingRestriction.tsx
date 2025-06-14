import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditShippingRestriction from "./EditShippingRestriction";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { ShippingRestriction } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const CREATE_SHIPPING_RESTRICTION_MODAL_ID =
  "create-shipping-restriction-modal";
export const EDIT_SHIPPING_RESTRICTION_MODAL_ID =
  "edit-shipping-restriction-modal";
export const DELETE_SHIPPING_RESTRICTION_MODAL_ID =
  "delete-shipping-restriction-modal";
export const MANAGE_SHIPPING_RESTRICTION_ID =
  "manage-shipping-restriction-modal";

export interface ManageShippingRestrictionProps
  extends DataManageComponentProps {
  data?: Array<ShippingRestriction>;
}

function ManageShippingRestriction({
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
}: ManageShippingRestrictionProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shippingRestriction}/bulk/destroy`,
            method: ApiMiddleware.METHOD.DELETE,
            protectedReq: true,
            data: {
              ids: ids,
            },
          });
        }}
        deleteItemRequest={async ({ item }: { item: any }) => {
          await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.shippingRestriction,
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
              truJobApiConfig.endpoints.shippingRestriction,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_SHIPPING_RESTRICTION_ID}
        editFormComponent={EditShippingRestriction}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Shipping restrictions"}
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
export default ManageShippingRestriction;
