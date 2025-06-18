import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditFeature from "./EditFeature";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Feature } from "@/types/Feature";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";

export interface ManageFeatureProps extends DataManageComponentProps {
  data?: Array<Feature>;
}

export const EDIT_FEATURE_MODAL_ID = "edit-feature-modal";
export const CREATE_FEATURE_MODAL_ID = "create-feature-modal";
export const DELETE_FEATURE_MODAL_ID = "delete-feature-modal";
export const MANAGE_FEATURE_ID = "manage-feature-modal";

function ManageFeature({
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
}: ManageFeatureProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}        
        isChild={isChild}
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
              truJobApiConfig.endpoints.feature,
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
              truJobApiConfig.endpoints.feature,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query || {},
            data: post || {},
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_FEATURE_ID}
        editFormComponent={EditFeature}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Features"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Label", key: "label" },
          { label: "Name", key: "name" },
        ]}
      />
    </Suspense>
  );
}
export default ManageFeature;
