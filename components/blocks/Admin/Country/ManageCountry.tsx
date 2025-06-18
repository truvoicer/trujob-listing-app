import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Country } from "@/types/Country";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import EditCountry from "./EditCountry";
import Loader from "@/components/Loader";

export const CREATE_COUNTRY_MODAL_ID = "create-country-modal";
export const EDIT_COUNTRY_MODAL_ID = "edit-country-modal";
export const DELETE_COUNTRY_MODAL_ID = "delete-country-modal";
export const MANAGE_COUNTRY_ID = "manage-country-modal";

export interface ManageCountryProps extends DataManageComponentProps {
  data?: Array<Country>;
}

function ManageCountry({
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
}: ManageCountryProps) {

  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.country}/bulk/destroy`,
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
              truJobApiConfig.endpoints.country,
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
              truJobApiConfig.endpoints.country,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_COUNTRY_ID}
        editFormComponent={EditCountry}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Countrys"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Label", key: "label" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManageCountry;
