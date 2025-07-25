import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditShippingRate from "./EditShippingRate";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { ShippingRate } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";
import { DataTableColumn } from "@/components/Table/DataTable";

export const CREATE_SHIPPING_RATE_MODAL_ID = "create-shipping-rate-modal";
export const EDIT_SHIPPING_RATE_MODAL_ID = "edit-shipping-rate-modal";
export const DELETE_SHIPPING_RATE_MODAL_ID = "delete-shipping-rate-modal";
export const MANAGE_SHIPPING_RATE_ID = "manage-shipping-rate-modal";

export interface ManageShippingRateProps extends DataManageComponentProps {
  data?: Array<ShippingRate>;
  shippingMethodId?: number;
}

function ManageShippingRate({
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
}: ManageShippingRateProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.shippingMethodRate.replace(
                ":shippingMethodId",
                shippingMethodId.toString()
              ),
              "bulk/destroy",
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
              truJobApiConfig.endpoints.shippingMethodRate.replace(
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
          post?: Record<string, any>;
          query?: Record<string, any>;
        }) => {
          if (["create", "add"].includes(operation)) {
            return false;
          }
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.shippingMethodRate.replace(
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
        mode={mode}
        operation={operation}
        id={MANAGE_SHIPPING_RATE_ID}
        editFormComponent={{
          component: EditShippingRate,
          props: {
            shippingMethodId: shippingMethodId,
          },
        }}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Shipping rates"}
        columns={[
          {
            label: "ID",
            key: "id",
          },
          {
            label: "Shipping Method",
            key: "shipping_method.name",
          },
          {
            label: "Shipping Zone",
            key: "shipping_zone.name",
          },
          {
            label: "Type",
            key: "type",
          },

          { label: "Name", key: "label" },
          { label: "Description", key: "description" },
          { label: "Is Active", key: "is_active", type: "boolean" },
          {
            label: "Max Dimension",
            render: (column: DataTableColumn, item: ShippingRate) => {
              return (
                <>
                  {item?.has_max_dimension ? (
                    <span className="badge bg-danger-light">
                      {item?.max_dimension || 0}{" "}
                      {item?.max_dimension_unit || "cm"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No Max Dimension
                    </span>
                  )}
                </>
              );
            },
          },
          {
            label: "Max weight",
            render: (column: DataTableColumn, item: ShippingRate) => {
              return (
                <>
                  {item?.has_weight ? (
                    <span className="badge bg-danger-light">
                      {item?.max_weight || 0} {item?.weight_unit || "kg"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No Max Weight
                    </span>
                  )}
                </>
              );
            },
          },
          {
            label: "Max height",
            render: (column: DataTableColumn, item: ShippingRate) => {
              return (
                <>
                  {item?.has_height ? (
                    <span className="badge bg-danger-light">
                      {item?.max_height || 0} {item?.height_unit || "cm"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No Max Height
                    </span>
                  )}
                </>
              );
            },
          },
          {
            label: "Max width",
            render: (column: DataTableColumn, item: ShippingRate) => {
              return (
                <>
                  {item?.has_width ? (
                    <span className="badge bg-danger-light">
                      {item?.max_width || 0} {item?.width_unit || "cm"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No Max Width
                    </span>
                  )}
                </>
              );
            },
          },
          {
            label: "Max length",
            render: (column: DataTableColumn, item: ShippingRate) => {
              return (
                <>
                  {item?.has_depth ? (
                    <span className="badge bg-danger-light">
                      {item?.max_depth || 0} {item?.depth_unit || "cm"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No Max Depth
                    </span>
                  )}
                </>
              );
            },
          },
          {
            label: "Base Amount",
            render: (column: DataTableColumn, item: ShippingRate) => {
              return (
                <span>{item?.amount ? item?.amount : "0.00"} </span>
              );
            },
          },
          {
            label: "Currency",
            render: (column: DataTableColumn, item: ShippingRate) => {
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
export default ManageShippingRate;
