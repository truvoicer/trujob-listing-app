import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense } from "react";
import EditProduct from "./EditProduct";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  ActionColumnBadgeDropdownItems,
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Product } from "@/types/Product";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import ProductTestCheckout from "./Checkout/ProductTestCheckout";
import Loader from "@/components/Loader";
import { connect } from "react-redux";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { RootState } from "@/library/redux/store";

export interface ManageProductProps extends DataManageComponentProps {
  data?: Array<Product>;
  values?: Product[];
}
export const TEST_TRANSACTION_MODAL_ID = "test-transaction-modal";
export const EDIT_PRODUCT_MODAL_ID = "edit-product-modal";
export const CREATE_PRODUCT_MODAL_ID = "create-product-modal";
export const DELETE_PRODUCT_MODAL_ID = "delete-product-modal";
export const MANAGE_PRODUCT_ID = "manage-product-modal";

function ManageProduct({
  session,
  columnHandler,
  isChild = false,
  onRowSelect,
  mode = "selector",
  operation,
  data,
  values,
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageProductProps) {
  function getActionColumnBadgeDropdownItems({
    item,
    index,
    dataTableContextState,
    dropdownItems,
  }: ActionColumnBadgeDropdownItems) {
    const checkoutItem = {
      text: "Checkout",
      linkProps: {
        href: `#`,
        onClick: (e: any) => {
          e.preventDefault();
          e.stopPropagation();
          dataTableContextState.modal.show(
            {
              title: "Edit Product",
              fullscreen: true,
              size: "xl",
              formProps: {
                operation: operation,
                initialValues: {},
              },
              showFooter: false,
              component: (
                <ProductTestCheckout
                  productId={item?.id}
                  modalId={TEST_TRANSACTION_MODAL_ID}
                />
              ),
            },
            TEST_TRANSACTION_MODAL_ID
          );
        },
      },
    };
    if (Array.isArray(dropdownItems)) {
      return [...dropdownItems, checkoutItem];
    }
    console.warn(
      "Action column badge dropdown items are not an array, returning default item"
    );
    return [checkoutItem];
  }
  
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}
        data={data}
        values={values}
        isChild={isChild}
        actionColumnBadgeDropdownItems={getActionColumnBadgeDropdownItems}
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
              truJobApiConfig.endpoints.product,
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
          console.log("fetchItemsRequest", { post, query });
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
        id={MANAGE_PRODUCT_ID}
        editFormComponent={EditProduct}
        onRowSelect={onRowSelect}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Products"}
        columns={[
          { label: "ID", key: "id" },
          { label: "Title", key: "title" },
          { label: "Permalink", key: "permalink" },
        ]}
      />
    </Suspense>
  );
}
export default connect(
  (state: RootState) => {
    return {
      session: state[SESSION_STATE],
    };
  },
)(ManageProduct);
