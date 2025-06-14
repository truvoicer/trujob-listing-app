import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";
import EditProduct from "./EditProduct";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  DataManageComponentProps,
  DataTableContextType,
  DatatableSearchParams,
  DMOnRowSelectActionClick,
} from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import {
  SORT_BY,
  SORT_ORDER,
} from "@/library/redux/constants/search-constants";
import { Product } from "@/types/Product";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";
import ProductTestCheckout from "./Checkout/ProductTestCheckout";

export interface ManageProductProps extends DataManageComponentProps {
  data?: Array<Product>;
}
export const TEST_TRANSACTION_MODAL_ID = "test-transaction-modal";
export const EDIT_PRODUCT_MODAL_ID = "edit-product-modal";
export const CREATE_PRODUCT_MODAL_ID = "create-product-modal";
export const DELETE_PRODUCT_MODAL_ID = "delete-product-modal";
export const MANAGE_PRODUCT_ID = "manage-product-modal";

function ManageProduct({
  isChild = false,
  onRowSelect,
  mode = "selector",
  operation,
  data,
  rowSelection = true,
  multiRowSelection = true,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
}: ManageProductProps) {
function renderCheckoutButton() {
    return (
      <Link
        href={`/admin/product/checkout`}
        className="btn btn-primary"
       onClick={(e) => {
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
                }
            }
        >
          Checkout
        </Link>
      );
    }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataManager
        isChild={isChild}
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
export default ManageProduct;
