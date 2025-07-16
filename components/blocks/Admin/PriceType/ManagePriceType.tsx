import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { PriceType } from "@/types/Price";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";

export const CREATE_PRICE_TYPE_MODAL_ID = "create-price-type-modal";
export const EDIT_PRICE_TYPE_MODAL_ID = "edit-price-type-modal";
export const DELETE_PRICE_TYPE_MODAL_ID = "delete-price-type-modal";
export const MANAGE_PRICE_TYPE_ID = "manage-price-type-modal";

export interface ManagePriceTypeProps extends DataManageComponentProps {
  data?: Array<PriceType>;
  values?: Array<PriceType>;
  fetchItemsRequest?: ({
    post,
    query,
  }: {
    post: Record<string, unknown>;
    query: Record<string, unknown>;
  }) => Promise<{
    data: Array<Record<string, unknown>>;
    links: Array<Record<string, unknown>>;
    meta: Record<string, unknown>;
  }>;
}

function ManagePriceType({
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
  fetchItemsRequest,
}: ManagePriceTypeProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}
        isChild={isChild}
        isCheckedHandler={async (
          item: Record<string, unknown>,
          values: Array<Record<string, unknown>>
        ) => {
          let checked: boolean = false;
          if (Array.isArray(values)) {
            checked = values.some(
              async (value: Record<string, unknown>) => {
                if (typeof value === "object") {
                  return value?.name === item?.name;
                }
                return value === item.name;
              }
            );
          }
          return checked;
        }}
        fetchItemsRequest={async ({
          post,
          query,
        }: {
          post?: Record<string, unknown>;
          query?: Record<string, unknown>;
        }) => {
          if (typeof fetchItemsRequest === "function") {
            return await fetchItemsRequest({ post, query });
          }
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.priceType,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_PRICE_TYPE_ID}
        values={values}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage price types"}
        columns={[
          { label: "Label", key: "label" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManagePriceType;
