import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditShippingMethod from "./EditShippingMethod";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { ShippingMethod } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const CREATE_SHIPPING_METHOD_MODAL_ID = "create-shipping-method-modal";
export const EDIT_SHIPPING_METHOD_MODAL_ID = "edit-shipping-method-modal";
export const DELETE_SHIPPING_METHOD_MODAL_ID = "delete-shipping-method-modal";

export interface ManageShippingMethodProps extends DataManageComponentProps {
  data?: Array<ShippingMethod>;
}

function ManageShippingMethod({
  mode = "selector",
  data,
  operation = "create",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageShippingMethodProps) {
    const MANAGE_SHIPPING_METHOD_ID = "manage-shipping-method";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shippingMethod}/bulk/delete`,
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
              truJobApiConfig.endpoints.shippingMethod,
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
              truJobApiConfig.endpoints.shippingMethod,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        // deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {}}
        // deleteItemRequest={async ({ item }: { item: any }) => {}}
        // fetchItemsRequest={async ({
        //   post,
        //   query,
        // }: {
        //   post?: Record<string, any>;
        //   query?: Record<string, any>;
        // }) => {}}
        mode={mode}
        operation={operation}
        id={MANAGE_SHIPPING_METHOD_ID}
        editFormComponent={EditShippingMethod}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Shipping methods"}
        columns={[
          { label: "Carrier", key: "carrier" },
          { label: "Description", key: "description" },
          { label: "Processing Time (Days)", key: "processing_time_days" },
          { label: "Display Order", key: "display_order" },
          { label: "Is Active", key: "is_active", type: "boolean" },
          { label: "Created At", key: "created_at", type: "date" },
          { label: "Updated At", key: "updated_at", type: "date" },
        ]}
      />
    </Suspense>
  );
}
export default ManageShippingMethod;
