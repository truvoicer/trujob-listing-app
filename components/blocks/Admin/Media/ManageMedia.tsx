import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditMedia from "./EditMedia";

import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { Media } from "@/types/Media";
import Loader from "@/components/Loader";

export interface ManageMediaProps extends DataManageComponentProps {
  data?: Array<Media>;
}
export const EDIT_MEDIA_MODAL_ID = "edit-media-modal";
export const CREATE_MEDIA_MODAL_ID = "create-media-modal";
export const DELETE_MEDIA_MODAL_ID = "delete-media-modal";
export const MANAGE_MEDIA_ID = "manage-media-modal";

function ManageMedia({
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
}: ManageMediaProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        isChild={isChild}
        data={data}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.product}/bulk/destroy`,
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
              truJobApiConfig.endpoints.media,
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
            endpoint: `${truJobApiConfig.endpoints.product}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_MEDIA_ID}
        editFormComponent={EditMedia}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Media"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Title", key: "title" },
          { label: "Permalink", key: "permalink" },
        ]}
      />
    </Suspense>
  );
}
export default ManageMedia;
