import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditUser from "./EditUser";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { User } from "@/types/User";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export interface ManageUserProps extends DataManageComponentProps {
  data?: Array<User>;
  values?: Array<User>;
  fixSessionUser?: boolean;
}
export const EDIT_USER_MODAL_ID = "edit-user-modal";
export const MANAGE_USER_ID = "manage-user-modal";

function ManageUser({
  isChild = false,
  data,
  fixSessionUser = false,
  operation = "create",
  mode = "selector",
  values,
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageUserProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {mode === "selector" && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          Selected:
          <div className="d-flex flex-wrap">
            {values?.map((item: User, index: number) => {
              return (
                <div key={index} className="badge bg-primary-light mr-2 mb-2">
                  {item?.first_name} {item?.last_name}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <DataManager
        isChild={isChild}
        data={data}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.user}/bulk/destroy`,
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
              truJobApiConfig.endpoints.user,
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
          let newQuery = query || {};
          newQuery = {
            ...newQuery,
            fix_session_user: fixSessionUser ? true : false,
          };
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.user}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: newQuery,
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_USER_ID}
        editFormComponent={EditUser}
        values={values}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Users"}
        columns={[
          { label: "ID", key: "id" },
          { label: "First name", key: "first_name" },
          { label: "Last name", key: "last_name" },
          { label: "Email", key: "email" },
        ]}
      />
    </Suspense>
  );
}
export default ManageUser;
