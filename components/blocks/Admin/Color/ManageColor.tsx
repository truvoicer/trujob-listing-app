import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditColor from "./EditColor";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Color } from "@/types/Color";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";

export interface ManageColorProps extends DataManageComponentProps {
  data?: Array<Color>;
}
export const EDIT_COLOR_MODAL_ID = "edit-color-modal";
export const CREATE_COLOR_MODAL_ID = "create-color-modal";
export const DELETE_COLOR_MODAL_ID = "delete-color-modal";
export const MANAGE_COLOR_ID = "manage-color-modal";

function ManageColor({
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
}: ManageColorProps) {

  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        data={data}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.color}/bulk/destroy`,
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
              truJobApiConfig.endpoints.color,
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
              truJobApiConfig.endpoints.color,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_COLOR_ID}
        editFormComponent={EditColor}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Colors"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Label", key: "label" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManageColor;
