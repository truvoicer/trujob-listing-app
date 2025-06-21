import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense, useContext } from "react";
import EditDiscount from "./EditDiscount";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  ActionColumnBadgeDropdownItems,
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { Discount } from "@/types/Discount";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { NotificationState } from "@/library/services/notification/NotificationService";
import { AppConfirmationContext } from "@/contexts/AppConfirmationContext";
import { ConfirmationState } from "@/library/services/confirmation/ConfirmationService";

export const CREATE_DISCOUNT_MODAL_ID = "create-discount-modal";
export const EDIT_DISCOUNT_MODAL_ID = "edit-discount-modal";
export const DELETE_DISCOUNT_MODAL_ID = "delete-discount-modal";
export const MANAGE_DISCOUNT_ID = "manage-discount-modal";

export interface ManageDiscountProps extends DataManageComponentProps {
  data?: Array<Discount>;
}

function ManageDiscount({
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
}: ManageDiscountProps) {
  const confirmationContext = useContext<ConfirmationState>(
    AppConfirmationContext
  );

  function defaultItemButtonConfig({
    item,
    dataTableContextState,
  }: ActionColumnBadgeDropdownItems) {
    const isDefault: boolean = item?.is_default === true;
    const modalId: string = (isDefault)? 'set-default-discount-modal' : 'unset-default-discount-modal';
    return {
      text: (!isDefault) ? "Set as default" : "Unset default",
      linkProps: {
        href: `#`,
        onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          e.stopPropagation();
          const confirmationMessage = (!isDefault)
            ? `Are you sure you want to set ${item.name} as the default discount?`
            : `Are you sure you want to unset ${item.name} as the default discount?`;
          confirmationContext.show(
            {
              title: (!isDefault) ? "Set Default Discount" : "Unset Default Discount",
              message: confirmationMessage,
              onOk: async () => {
                try {
                  if (!item?.id) {
                    console.warn("No ID found for the discount item");
                    return;
                  }
                  const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                      truJobApiConfig.endpoints.discount,
                      item.id.toString(),
                      (!isDefault) ? "set-default" : "unset-default",
                    ]),
                    method: (!isDefault) ? ApiMiddleware.METHOD.POST : ApiMiddleware.METHOD.DELETE,
                    protectedReq: true,
                  });
                  if (!response) {
                    console.warn("No response received from the API");
                    return;
                  }
                  dataTableContextState.refresh();
                  confirmationContext.hide(modalId);
                } catch (error) {
                  console.error(`Error ${(!isDefault) ? "setting" : "unsetting"} default discount:`, error);
                }
              },
            },
            modalId
          );
        }
      },
    };
  }
  function getActionColumnBadgeDropdownItems({
    item,
    index,
    dataTableContextState,
    dropdownItems,
  }: ActionColumnBadgeDropdownItems) {
    const setDefaultItem = defaultItemButtonConfig( {
      item,
      index,
      dataTableContextState,
      dropdownItems,
    });
    if (Array.isArray(dropdownItems)) {
      return [...dropdownItems, setDefaultItem];
    }
    console.warn(
      "Action column badge dropdown items are not an array, returning default item"
    );
    return [setDefaultItem];
  }
  return (
    <Suspense fallback={<Loader />}>
      <DataManager
        columnHandler={columnHandler}
        isChild={isChild}
        data={data}
        actionColumnBadgeDropdownItems={getActionColumnBadgeDropdownItems}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.discount}/bulk/destroy`,
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
              truJobApiConfig.endpoints.discount,
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
              truJobApiConfig.endpoints.discount,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_DISCOUNT_ID}
        editFormComponent={EditDiscount}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Discounts"}
        columns={[
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Icon", key: "icon" },
          { label: "Is Active", key: "is_active" },
          { label: "Is Default", key: "is_default" },
          { label: "Created At", key: "created_at", type: "date" },
          { label: "Updated At", key: "updated_at", type: "date" },
        ]}
      />
    </Suspense>
  );
}
export default ManageDiscount;
