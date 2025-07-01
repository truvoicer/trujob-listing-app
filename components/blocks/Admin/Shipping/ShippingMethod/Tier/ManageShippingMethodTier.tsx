import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditShippingMethodTier from "./EditShippingMethodTier";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { ShippingMethodTier } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";
import { DataTableColumn } from "@/components/Table/DataTable";

export const CREATE_SHIPPING_METHOD_TIER_MODAL_ID =
  "create-shipping-method-tier-modal";
export const EDIT_SHIPPING_METHOD_TIER_MODAL_ID =
  "edit-shipping-method-tier-modal";
export const DELETE_SHIPPING_METHOD_TIER_MODAL_ID =
  "delete-shipping-method-tier-modal";
export const MANAGE_SHIPPING_METHOD_TIER_ID = "manage-shipping-method-tier";

export interface ManageShippingMethodTierProps
  extends DataManageComponentProps {
  data?: Array<ShippingMethodTier>;
  shippingMethodId?: number;
}

function ManageShippingMethodTier({
  columnHandler,
  isChild = false,
  shippingMethodId,
  mode = "selector",
  data,
  operation = "create",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageShippingMethodTierProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: Array<number> }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.shippingMethodTier.replace(
                ":shippingMethodId",
                shippingMethodId.toString()
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
        deleteItemRequest={async ({ item }: { item: Record<string, unknown> }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.shippingMethodTier.replace(
                ":shippingMethodId",
                shippingMethodId.toString()
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
          post?: Record<string, unknown>;
          query?: Record<string, unknown>;
        }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.shippingMethodTier.replace(
                ":shippingMethodId",
                shippingMethodId.toString()
              ),
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
        id={MANAGE_SHIPPING_METHOD_TIER_ID}
        editFormComponent={{
          component: EditShippingMethodTier,
          props: {
            shippingMethodId,
          },
        }}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Shipping method tiers"}
        columns={[
          { label: "Name", key: "label" },
          { label: "Description", key: "description" },
          { label: "Is Active", key: "is_active", type: "boolean" },
          {
            label: "Max Dimension",
            render: (column: DataTableColumn, item: ShippingMethodTier) => {
              return (
                <>
                {item?.has_max_dimension ? (
                  <span className="badge bg-danger-light">
                    {item?.max_dimension || 0} {item?.max_dimension_unit || "cm"}
                  </span>
                ) : (
                  <span className="badge bg-secondary-light">No Max Dimension</span>
                )}
                </>
              );
            },
          },
          {
            label: "Max weight",
            render: (column: DataTableColumn, item: ShippingMethodTier) => {
              return (
                <>
                {item?.has_weight ? (
                  <span className="badge bg-danger-light">
                    {item?.max_weight || 0} {item?.weight_unit || "kg"}
                  </span>
                ) : (
                  <span className="badge bg-secondary-light">No Max Weight</span>
                )}
                </>
              );
            },
          },
          {
            label: "Max height",
            render: (column: DataTableColumn, item: ShippingMethodTier) => {
              return (
                <>
                  {item?.has_height ? (
                    <span className="badge bg-danger-light">
                      {item?.max_height || 0} {item?.height_unit || "cm"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">No Max Height</span>
                  )}
                </>
              );
            },
          },
          {
            label: "Max width",
            render: (column: DataTableColumn, item: ShippingMethodTier) => {
              return (
                <>
                  {item?.has_width ? (
                    <span className="badge bg-danger-light">
                      {item?.max_width || 0} {item?.width_unit || "cm"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">No Max Width</span>
                  )}
                </>
              );
            },
          },
          {
            label: "Max length",
            render: (column: DataTableColumn, item: ShippingMethodTier) => {
              return (
                <>
                  {item?.has_length ? (
                    <span className="badge bg-danger-light">
                      {item?.max_length || 0} {item?.length_unit || "cm"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">No Max Length</span>
                  )}
                </>
              );
            },
          },
          {
            label: "Base Amount",
            render: (column: DataTableColumn, item: ShippingMethodTier) => {
              return (
                <span>{item?.base_amount ? item?.base_amount : "0.00"} </span>
              );
            },
          },
          {
            label: "Currency",
            render: (column: DataTableColumn, item: ShippingMethodTier) => {
              return <span>{item?.currency?.code || "Currency error"}</span>;
            },
          },
          {
            label: "Created At",
            key: "created_at",
            type: "date",
            date_format: "Do MMMM YYYY h:mm:ss a",
          },
          {
            label: "Updated At",
            key: "updated_at",
            type: "date",
            date_format: "Do MMMM YYYY h:mm:ss a",
          },
        ]}
      />
    </Suspense>
  );
}
export default ManageShippingMethodTier;
