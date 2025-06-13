import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import EditMenu from "./EditMenu";
import { Menu } from "@/types/Menu";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const EDIT_MENU_MODAL_ID = "edit-menu-modal";
export const CREATE_MENU_MODAL_ID = "create-menu-modal";
export const DELETE_MENU_MODAL_ID = "delete-menu-modal";
export const MANAGE_MENU_ID = "manage-menu-modal";

export interface ManageMenuProps extends DataManageComponentProps {
  data?: Array<Menu>;
}
function ManageMenu({
  mode = "selector",
  data,
  operation = "create",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageMenuProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menu}/bulk/destroy`,
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
              truJobApiConfig.endpoints.menu,
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
            endpoint: `${truJobApiConfig.endpoints.menu}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_MENU_ID}
        editFormComponent={EditMenu}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        columns={[
          { label: "ID", key: "id" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManageMenu;
