import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditProductPrice from "./EditProductPrice";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { Price } from "@/types/Price";
import Loader from "@/components/Loader";

export interface ManageProductPriceProps extends DataManageComponentProps {
  data?: Array<Price>;
  productId?: number;
}
export const EDIT_PRODUCT_PRICE_MODAL_ID = "edit-product-price-modal";
export const DELETE_PRODUCT_PRICE_MODAL_ID = "delete-product-price-modal";
export const CREATE_PRODUCT_PRICE_MODAL_ID = "create-product-price-modal";
export const MANAGE_PRODUCT_PRICE_ID = "manage-product-price-modal";

function ManageProductPrice({
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
}: ManageProductPriceProps) {

  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.productPrice.replace(
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
              truJobApiConfig.endpoints.productPrice.replace(
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
              truJobApiConfig.endpoints.productPrice.replace(
                ":productId",
                productId.toString()
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
        id={MANAGE_PRODUCT_PRICE_ID}
        editFormComponent={{
          component: EditProductPrice,
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
        title={"Manage Product Prices"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Price Type", key: "price_type.label" },
          { label: "Label", key: "label" },
          { label: "Amount", key: "amount" },
          { label: "Currency", key: "currency.name" },
          { label: "Country", key: "country.name" },
          { label: "Valid From", key: "valid_from" },
          { label: "Valid To", key: "valid_to" },
          { label: "Is Active", key: "is_active" },
          { label: "Created At", key: "created_at", type: "date" },
          { label: "Updated At", key: "updated_at", type: "date" },
        ]}
      />
    </Suspense>
  );
}
export default ManageProductPrice;
