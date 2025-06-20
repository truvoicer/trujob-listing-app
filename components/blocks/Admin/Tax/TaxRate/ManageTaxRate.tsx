import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditTaxRate from "./EditTaxRate";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { TaxRate } from "@/types/Tax";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";

export const CREATE_TAX_RATE_MODAL_ID = "create-tax-rate-modal";
export const EDIT_TAX_RATE_MODAL_ID = "edit-tax-rate-modal";
export const DELETE_TAX_RATE_MODAL_ID = "delete-tax-rate-modal";
export const MANAGE_TAX_RATE_ID = "manage-tax-rate-modal";

export interface ManageTaxRateProps extends DataManageComponentProps {
  data?: Array<TaxRate>;
}

function ManageTaxRate({
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
}: ManageTaxRateProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.taxRate}/bulk/destroy`,
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
              truJobApiConfig.endpoints.taxRate,
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
              truJobApiConfig.endpoints.taxRate,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_TAX_RATE_ID}
        editFormComponent={EditTaxRate}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Tax rates"}
        columns={[
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Icon", key: "icon" },
          { label: "Is Active", key: "is_active" },
          { label: "Is Default", key: "is_default" },
          { label: "Created At", key: "created_at", type: "date" },
          { label: "Updated At", key: "updated_at", type: "date" },
        ]}
      />
    </Suspense>
  );
}
export default ManageTaxRate;
