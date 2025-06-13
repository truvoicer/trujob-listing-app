import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import EditWidget from "./EditWidget";
import { Widget } from "@/types/Widget";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const EDIT_SIDEBAR_MODAL_ID = "edit-widget-modal";
export const MANAGE_WIDGET_ID = "manage-widget-modal";
export interface ManageWidgetProps extends DataManageComponentProps {
  data?: Array<Widget>;
}

function ManageWidget({
  operation = "create",
  data,
  mode = "selector",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageWidgetProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.widget}/bulk/destroy`,
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
              truJobApiConfig.endpoints.widget,
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
            endpoint: `${truJobApiConfig.endpoints.widget}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_WIDGET_ID}
        editFormComponent={EditWidget}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        columns={[
          { label: "ID", key: "id" },
          { label: "Name", key: "name" },
          { label: "Title", key: "title" },
        ]}
      />
    </Suspense>
  );
}
export default ManageWidget;
