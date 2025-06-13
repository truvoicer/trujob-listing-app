import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditReview from "./EditReview";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Review } from "@/types/Review";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export interface ManageReviewProps extends DataManageComponentProps {
  data?: Array<Review>;
}
export const EDIT_REVIEW_MODAL_ID = "edit-review-modal";
export const ADD_REVIEW_MODAL_ID = "add-review-modal";
export const DELETE_REVIEW_MODAL_ID = "delete-review-modal";
export const MANAGE_REVIEW_ID = "manage-review-modal";

function ManageReview({
  mode = "selector",
  data,
  operation = "create",
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageReviewProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.review}/${item.id}/delete`,
            method: ApiMiddleware.METHOD.DELETE,
            protectedReq: true,
          });
        }}
        deleteItemRequest={async ({ item }: { item: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.review}/bulk/destroy`,
            method: ApiMiddleware.METHOD.DELETE,
            protectedReq: true,
            data: {
              ids: ids,
            },
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
              truJobApiConfig.endpoints.review,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_REVIEW_ID}
        editFormComponent={EditReview}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Reviews"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Review", key: "review" },
          { label: "Rating", key: "rating" },
        ]}
      />
    </Suspense>
  );
}
export default ManageReview;
