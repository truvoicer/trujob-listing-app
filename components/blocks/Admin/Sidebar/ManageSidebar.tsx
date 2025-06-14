import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import EditSidebar from "./EditSidebar";
import { Sidebar } from "@/types/Sidebar";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const EDIT_SIDEBAR_MODAL_ID = "edit-sidebar-modal";
export const CREATE_SIDEBAR_MODAL_ID = "create-sidebar-modal";
export const DELETE_SIDEBAR_MODAL_ID = "delete-sidebar-modal";
export const MANAGE_SIDEBAR_ID = "manage-sidebar-modal";
export interface ManageSidebarProps extends DataManageComponentProps {
  data?: Array<Sidebar>;
}
function ManageSidebar({
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
}: ManageSidebarProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        isChild={isChild}
        data={data}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebar}/bulk/destroy`,
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
              truJobApiConfig.endpoints.sidebar,
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
            endpoint: `${truJobApiConfig.endpoints.sidebar}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_SIDEBAR_ID}
        editFormComponent={EditSidebar}
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
export default ManageSidebar;
