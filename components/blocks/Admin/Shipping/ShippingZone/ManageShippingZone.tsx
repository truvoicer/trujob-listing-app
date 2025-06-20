import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditShippingZone from "./EditShippingZone";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { ShippingZone } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";

export const CREATE_SHIPPING_ZONE_MODAL_ID = "create-shipping-zone-modal";
export const EDIT_SHIPPING_ZONE_MODAL_ID = "edit-shipping-zone-modal";
export const DELETE_SHIPPING_ZONE_MODAL_ID = "delete-shipping-zone-modal";
export const MANAGE_SHIPPING_ZONE_ID = "manage-shipping-zone-modal";

export interface ManageShippingZoneProps extends DataManageComponentProps {
  data?: Array<ShippingZone>;
  values?: ShippingZone[];
}

function ManageShippingZone({
  columnHandler,
  isChild = false,
  
  values,
  mode = "selector",
  data,
  operation = "create",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageShippingZoneProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.shippingZone}/bulk/destroy`,
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
              truJobApiConfig.endpoints.shippingZone,
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
              truJobApiConfig.endpoints.shippingZone,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_SHIPPING_ZONE_ID}
        editFormComponent={EditShippingZone}
        values={values}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Shipping zones"}
        columns={[
          { label: "Name", key: "name" },
          {
            label: "Countries",
            key: "countries",
            render: (col: Record<string, any>, item: ShippingZone) => {
              if (item?.all) {
                return <span className="badge bg-success">All Countries</span>;
              }
              return (
                <div className="d-flex flex-wrap">
                  {item?.countries?.map((country, index) => (
                    <span key={index} className="badge bg-secondary mr-1 mb-1">
                      {country.name} ({country.iso2}) <br />
                    </span>
                  ))}
                </div>
              );
            },
          },
          { label: "Is Active", key: "is_active" },
          { label: "Created At", key: "created_at", type: "date" },
          { label: "Updated At", key: "updated_at", type: "date" },
        ]}
      />
    </Suspense>
  );
}
export default ManageShippingZone;
