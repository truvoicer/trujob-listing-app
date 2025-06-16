import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditPaymentMethod from "./EditPaymentMethod";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { PaymentMethod } from "@/types/PaymentMethod";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const CREATE_PAYMENT_METHOD_MODAL_ID = "create-payment-method-modal";
export const EDIT_PAYMENT_METHOD_MODAL_ID = "edit-payment-method-modal";
export const DELETE_PAYMENT_METHOD_MODAL_ID = "delete-payment-method-modal";
export const MANAGE_PAYMENT_METHOD_ID = "manage-payment-method-modal";

export interface ManagePaymentMethodProps extends DataManageComponentProps {
  data?: Array<PaymentMethod>;
}

function ManagePaymentMethod({
  columnHandler,
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
}: ManagePaymentMethodProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.paymentMethod}/bulk/destroy`,
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
              truJobApiConfig.endpoints.paymentMethod,
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
              truJobApiConfig.endpoints.paymentMethod,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_PAYMENT_METHOD_ID}
        editFormComponent={EditPaymentMethod}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Payment methods"}
        columns={[{ label: "Name", key: "name" }]}
      />
    </Suspense>
  );
}
export default ManagePaymentMethod;
