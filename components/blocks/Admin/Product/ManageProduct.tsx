import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense, useState } from "react";
import EditProduct from "./EditProduct";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  ActionColumnBadgeDropdownItems,
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Product } from "@/types/Product";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";
import { connect } from "react-redux";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { RootState } from "@/library/redux/store";
import { Modal } from "react-bootstrap";
import GenerateProductSku from "./GenerateProductSku";
import { DataTableColumn } from "@/components/Table/DataTable";
import Tooltip from "@/components/Elements/Tooltip";
import BadgeWithCount from "@/components/Elements/Badge/BadgeWithCount";
import ProductHealthCheckDisplay from "@/components/Elements/ProductHealthCheckDisplay";
import CheckoutProvider from "@/components/Theme/Admin/Order/Payment/Checkout/CheckoutProvider";
import PaymentProcess, { STEP_PRICE } from "@/components/Theme/Admin/Order/Payment/PaymentProcess";

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
  const [showModal, setShowModal] = useState(false);
  const [showSkuModal, setShowSkuModal] = useState(false);
  const [item, setItem] = useState<Product | null>(null);

  function getActionColumnBadgeDropdownItems({
    item,
    index,
    dataTableContextState,
    dropdownItems,
  }: ActionColumnBadgeDropdownItems) {
    const checkoutItem = {
      text: "Checkout",
      disabled: (item?.health_check?.unhealthy?.count || 0) > 0 ? true : false,
      linkProps: {
        href: `#`,
        onClick: (e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setItem(item);
          setShowModal(true);
        },
      },
    };
    const skuItem = {
      text: "Generate SKU",
      linkProps: {
        href: `#`,
        onClick: (e: any) => {
          e.preventDefault();
          e.stopPropagation();
          setItem(item);
          setShowSkuModal(true);
        },
      },
    };
    if (Array.isArray(dropdownItems)) {
      return [...dropdownItems, checkoutItem, skuItem];
    }
    console.warn(
      "Action column badge dropdown items are not an array, returning default item"
    );
    return [checkoutItem];
  }
  const itemd = {
    health_check: {
      unhealthy: {
        count: 1,
      },
    },
  };

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
            endpoint: `${truJobApiConfig.endpoints.userProduct}`,
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
          {
            label: "Status",
            render: (col: DataTableColumn, item: Record<string, unknown>) => {
              const unhealthyCount = item?.health_check?.unhealthy?.count || 0;
              const isUnhealthy = unhealthyCount > 0;
              return (
                <Tooltip
                  tooltipContent={
                    <ProductHealthCheckDisplay
                      data={item?.health_check || {}}
                    />
                  }
                >
                  <div>
                    <BadgeWithCount
                      count={item?.health_check?.unhealthy?.count || null}
                      text={`${isUnhealthy ? "Unhealthy" : "Healthy"}`}
                      bgColor={`${
                        isUnhealthy ? "danger-light" : "success-light"
                      }`}
                      textColor="#000"
                      badgeBgColor={`${isUnhealthy ? "danger" : "success"}`}
                      badgeTextColor="#000"
                    />
                  </div>
                </Tooltip>
              );
            },
          },
          { label: "Title", key: "title" },
          { label: "Permalink", key: "permalink" },
        ]}
      >
        <GenerateProductSku
          product={item}
          showModal={showSkuModal}
          setShowModal={setShowSkuModal}
        />
      </DataManager>
      <Modal
        fullscreen={true}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Test Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {item ? (
            <CheckoutProvider initialStep={STEP_PRICE}>
              <PaymentProcess productId={item.id} />
            </CheckoutProvider>
          ) : (
            <p>No product selected</p>
          )}
        </Modal.Body>
      </Modal>
    </Suspense>
  );
}
export default connect((state: RootState) => {
  return {
    session: state[SESSION_STATE],
  };
})(ManageProduct);
