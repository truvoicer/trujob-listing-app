import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import EditSidebarWidget from "./EditSidebarWidget";
import { Widget } from "@/types/Widget";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";

export const EDIT_SIDEBAR_WIDGET_MODAL_ID = "edit-sidebar-widget-modal";
export const CREATE_SIDEBAR_WIDGET_MODAL_ID = "create-sidebar-widget-modal";
export const DELETE_SIDEBAR_WIDGET_MODAL_ID = "delete-sidebar-widget-modal";
export const MANAGE_SIDEBAR_WIDGET_ID = "manage-sidebar-widget-modal";

export interface ManageSidebarWidgetProps extends DataManageComponentProps {
  data?: Array<Widget>;
  sidebarId?: number;
}
function ManageSidebarWidget({
  columnHandler,
  isChild = false,
  
  operation = "create",
  data,
  mode = "selector",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
  sidebarId,
}: ManageSidebarWidgetProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          if (!sidebarId) {
            throw new Error("Sidebar ID is required for bulk delete.");
          }
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.sidebarWidget.replace(
                "%s",
                sidebarId.toString()
              ),
              "bulk",
              "delete",
            ]),
            method: ApiMiddleware.METHOD.DELETE,
            protectedReq: true,
            data: {
              ids: ids,
            },
          });
        }}
        deleteItemRequest={async ({ item }: { item: any }) => {
          if (!sidebarId) {
            throw new Error("Sidebar ID is required for bulk delete.");
          }
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
              truJobApiConfig.endpoints.sidebarWidget.replace(
                "%s",
                sidebarId.toString()
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
          if (!sidebarId) {
            throw new Error("Sidebar ID is required for bulk delete.");
          }
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
        id={MANAGE_SIDEBAR_WIDGET_ID}
        editFormComponent={EditSidebarWidget}
        data={data}
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
export default ManageSidebarWidget;
