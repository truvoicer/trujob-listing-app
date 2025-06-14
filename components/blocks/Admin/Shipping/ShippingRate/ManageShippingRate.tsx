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

export const CREATE_SHIPPING_RATE_MODAL_ID = "create-shipping-rate-modal";
export const EDIT_SHIPPING_RATE_MODAL_ID = "edit-shipping-rate-modal";
export const DELETE_SHIPPING_RATE_MODAL_ID = "delete-shipping-rate-modal";
export const MANAGE_SHIPPING_RATE_ID = "manage-shipping-rate-modal";

export interface ManageShippingRateProps extends DataManageComponentProps {
  data?: Array<ShippingRate>;
  shippingMethodId?: number;
}

function ManageShippingRate({
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
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.shippingMethodRate.replace(
                ":shippingMethodId",
                shippingMethodId.toString()
              ),
              "bulk/delete",
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
          if (['create', 'add'].includes(operation)) {
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
          {
            label: "Weight",
            render: (column: Record<string, any>, item: ShippingRate) => {
              return (
                <div>
                  {item?.weight_limit ? (
                    <>
                      <span className="badge bg-success-light mr-2">
                        Min: {item?.min_weight || 0} {item?.weight_unit || "kg"}
                      </span>
                      <span className="badge bg-danger-light">
                        Max: {item?.max_weight || 0} {item?.weight_unit || "kg"}
                      </span>
                    </>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No weight limit
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            label: "Height",
            render: (column: Record<string, any>, item: ShippingRate) => {
              return (
                <div>
                  {item?.height_limit ? (
                    <>
                      <span className="badge bg-success-light mr-2">
                        Min: {item?.min_height || 0} {item?.height_unit || "cm"}
                      </span>
                      <span className="badge bg-danger-light">
                        Max: {item?.max_height || 0} {item?.height_unit || "cm"}
                      </span>
                    </>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No height limit
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            label: "Length",
            render: (column: Record<string, any>, item: ShippingRate) => {
              return (
                <div>
                  {item?.length_limit ? (
                    <>
                      <span className="badge bg-success-light mr-2">
                        Min: {item?.min_length || 0} {item?.length_unit || "cm"}
                      </span>
                      <span className="badge bg-danger-light">
                        Max: {item?.max_length || 0} {item?.length_unit || "cm"}
                      </span>
                    </>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No length limit
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            label: "Width",
            render: (column: Record<string, any>, item: ShippingRate) => {
              return (
                <div>
                  {item?.width_limit ? (
                    <>
                      <span className="badge bg-success-light mr-2">
                        Min: {item?.min_width || 0} {item?.width_unit || "cm"}
                      </span>
                      <span className="badge bg-danger-light">
                        Max: {item?.max_width || 0} {item?.width_unit || "cm"}
                      </span>
                    </>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No width limit
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            label: "Length",
            render: (column: Record<string, any>, item: ShippingRate) => {
              return (
                <div>
                  {item?.length_limit ? (
                    <>
                      <span className="badge bg-success-light mr-2">
                        Min: {item?.min_length || 0} {item?.length_unit || "cm"}
                      </span>
                      <span className="badge bg-danger-light">
                        Max: {item?.max_length || 0} {item?.length_unit || "cm"}
                      </span>
                    </>
                  ) : (
                    <span className="badge bg-secondary-light">
                      No length limit
                    </span>
                  )}
                </div>
              );
            },
          },
          {
            label: "Amount",
            key: "amount",
          },
          {
            label: "Currency",
            key: "currency.name",
          },
          {
            label: "Free Shipping Possible",
            key: "is_free_shipping_possible",
          },
          {
            label: "Created At",
            key: "created_at",
          },
          {
            label: "Updated At",
            key: "updated_at",
          },
        ]}
      />
    </Suspense>
  );
}
export default ManageShippingRate;
