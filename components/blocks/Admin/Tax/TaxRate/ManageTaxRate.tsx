import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Suspense, useContext } from "react";
import EditTaxRate from "./EditTaxRate";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, {
  ActionColumnBadgeDropdownItems,
  DataManageComponentProps,
} from "@/components/Table/DataManager";
import { TaxRate } from "@/types/Tax";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import Loader from "@/components/Loader";
import { ConfirmationState } from "@/library/services/confirmation/ConfirmationService";
import { AppConfirmationContext } from "@/contexts/AppConfirmationContext";

export const CREATE_TAX_RATE_MODAL_ID = "create-tax-rate-modal";
export const EDIT_TAX_RATE_MODAL_ID = "edit-tax-rate-modal";
export const DELETE_TAX_RATE_MODAL_ID = "delete-tax-rate-modal";
export const MANAGE_TAX_RATE_ID = "manage-tax-rate-modal";

export interface ManageTaxRateProps extends DataManageComponentProps {
  data?: Array<TaxRate>;
}

function ManageTaxRate({
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
}: ManageTaxRateProps) {

    const confirmationContext = useContext<ConfirmationState>(
      AppConfirmationContext
    );
  
    function defaultItemButtonConfig({
      item,
      dataTableContextState,
    }: ActionColumnBadgeDropdownItems) {
      const isDefault: boolean = item?.is_default === true;
      const modalId: string = (isDefault)? 'set-default-tax-rate-modal' : 'unset-default-tax-rate-modal';
      return {
        text: (!isDefault) ? "Set as default" : "Unset default",
        linkProps: {
          href: `#`,
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const confirmationMessage = (!isDefault)
              ? `Are you sure you want to set ${item.name} as the default tax-rate?`
              : `Are you sure you want to unset ${item.name} as the default tax-rate?`;
            confirmationContext.show(
              {
                title: (!isDefault) ? "Set Default tax rate" : "Unset Default tax rate",
                message: confirmationMessage,
                onOk: async () => {
                  try {
                    if (!item?.id) {
                      console.warn("No ID found for the tax-rate item");
                      return;
                    }
                    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                      endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.taxRate,
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
                    console.error(`Error ${(!isDefault) ? "setting" : "unsetting"} default tax rate:`, error);
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
        actionColumnBadgeDropdownItems={getActionColumnBadgeDropdownItems}
        deleteBulkItemsRequest={async ({ ids }: { ids: any }) => {
          return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.taxRate}/bulk/destroy`,
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
              truJobApiConfig.endpoints.taxRate,
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
              truJobApiConfig.endpoints.taxRate,
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
          });
        }}
        mode={mode}
        operation={operation}
        id={MANAGE_TAX_RATE_ID}
        editFormComponent={EditTaxRate}
        data={data}
        rowSelection={rowSelection}
        multiRowSelection={multiRowSelection}
        onChange={onChange}
        enableEdit={enableEdit}
        paginationMode={paginationMode}
        enablePagination={enablePagination}
        title={"Manage Tax rates"}
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
export default ManageTaxRate;
