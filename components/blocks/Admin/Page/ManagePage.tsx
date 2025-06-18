import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditPage from "./EditPage";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Page } from "@/types/Page";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";

export interface ManagePageProps extends DataManageComponentProps {
  data?: Array<Page>;
}
export const EDIT_PAGE_MODAL_ID = "edit-page-modal";
export const CREATE_PAGE_MODAL_ID = "create-page-modal";
export const DELETE_PAGE_MODAL_ID = "delete-page-modal";
export const MANAGE_PAGE_ID = "manage-page-modal";

function ManagePage({
  columnHandler,
  isChild = false,
  
  mode = "selector",
  operation = "edit",
  data,
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManagePageProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
        data={data}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}/bulk/destroy`,
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
              truJobApiConfig.endpoints.page,
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
            endpoint: `${truJobApiConfig.endpoints.page}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_PAGE_ID}
        editFormComponent={EditPage}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        columns={[
          { label: "ID", key: "id" },
          { label: "Title", key: "title" },
          { label: "Permalink", key: "permalink" },
        ]}
      />
    </Suspense>
  );
}
export default ManagePage;
