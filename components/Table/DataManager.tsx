import DataTable, {
  DataTableColumn,
  DataTableItem,
  OnRowSelectActionClick,
} from "@/components/Table/DataTable";
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { ModalService } from "@/library/services/modal/ModalService";
import { useSearchParams } from "next/navigation";
import { isNotEmpty, isObject, isObjectEmpty } from "@/helpers/utils";
import {
  DataTableContext,
  dataTableContextData,
} from "@/contexts/DataTableContext";
import { ConfirmationService } from "@/library/services/confirmation/ConfirmationService";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { PaginationHelpers } from "@/helpers/PaginationHelpers";
import { AppModalContext } from "@/contexts/AppModalContext";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";
import { FormikProps, FormikValues } from "formik";
import Link from "next/link";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import {
  SORT_BY,
  SORT_ORDER,
} from "@/library/redux/constants/search-constants";
import BadgeDropDown from "../BadgeDropDown";
export type ActionColumnBadgeDropdownItems = {
    item: Record<string, unknown>;
    index: number;
    dataTableContextState: DataTableContextType;
    dropdownItems: Array<{
    text: string;
    linkProps: {
      href: string;
      onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    };
  }>;
}
export type ActionColumnItems = {
    item: Record<string, unknown>;
    index: number;
    dataTableContextState: DataTableContextType;
    dropdownItems: Array<React.ReactNode>;
}

export type DataManageComponentProps = {
  isChild?: boolean;
  mode?: "selector" | "edit";
  operation?: "edit" | "update" | "add" | "create";
  enableEdit?: boolean;
  paginationMode?: "router" | "state";
  enablePagination?: boolean;
  onChange: (values: unknown[]) => void;
  rowSelection?: boolean;
  multiRowSelection?: boolean;
  data?: Array<unknown>;
  onRowSelect?: (
    item: DataTableItem,
    index: number,
    dataTableContextState: unknown
  ) => boolean | Promise<boolean>;
  columnHandler?: (columns: DataTableColumn[]) => Array<DataTableColumn>;
};
export interface DMOnRowSelectActionClick extends OnRowSelectActionClick {
  data: Array<unknown>;
  dataTableContextState: unknown;
  setDataTableContextState: (data: unknown) => void;
}

export type DataManagerProps = {
  isChild?: boolean;
  id: string;
  mode?: "selector" | "edit";
  operation?: "edit" | "update" | "add" | "create";
  values?: Array<unknown>;
  data?: Array<unknown>;
  onChange: (tableData: Array<unknown>) => void;
  paginationMode?: "router" | "state";
  enablePagination?: boolean;
  enableEdit?: boolean;
  title?: string;
  onRowSelect?: (
    item: DataTableItem,
    index: number,
    dataTableContextState: unknown
  ) => boolean | Promise<boolean>;
  multiRowSelection?: boolean;
  rowSelection?: boolean;
  columns?: Array<DataTableColumn>;
  deleteItemRequest?: ({ item }: { item: unknown }) => Promise<boolean>;
  deleteBulkItemsRequest?: ({ ids }: { ids: unknown }) => Promise<boolean>;
  fetchItemsRequest?: ({
    post,
    query,
  }: {
    post: Record<string, unknown>;
    query: Record<string, unknown>;
  }) => Promise<{
    data: Array<Record<string, unknown>>;
    links: Array<Record<string, unknown>>;
    meta: Record<string, unknown>;
  }>;
  editFormComponent?:
    | React.ComponentType<unknown>
    | {
        component: React.ComponentType<unknown>;
        props?: Record<string, unknown>;
      };

  columnHandler?: (columns: DataTableColumn[]) => Array<DataTableColumn>;
  renderActionColumn?: ({
    item,
    index,
    dataTableContextState,
    buildActionColumn,
  }: {
    item: Record<string, unknown>;
    index: number;
    dataTableContextState: DataTableContextType;
    buildActionColumn: (
      item: Record<string, unknown>,
      index: number,
      dataTableContextState: DataTableContextType
    ) => React.ReactNode;
  }) => React.ReactNode;
  actionColumnItems?: ({
    item,
    index,
    dataTableContextState,
    dropdownItems,
  }: ActionColumnItems) => Array<React.ReactNode>;
  actionColumnBadgeDropdownItems?: ({
    item,
    index,
    dataTableContextState,
    dropdownItems,
  }: ActionColumnBadgeDropdownItems) => Array<{
    text: string;
    linkProps: {
      href: string;
      onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    };
  }>;
};

export type DataTableContextType = {
  [key: string]: unknown | Array<unknown> | string | null | undefined;
  requestStatus: string;
  data: Array<unknown>;
  links: unknown;
  meta: unknown;
  query: unknown;
  post: unknown;
  modal: unknown;
  refresh: () => void;
  update: (data: unknown) => void;
};

export type DatatableSearchParams = {
  [key: string]: string | null | undefined;
  page?: string | null;
  sort_order?: string | null;
  sort_by?: string | null;
  query?: string | null;
  page_size?: string | null;
};

function DataManager({
  renderActionColumn,
  actionColumnItems,
  actionColumnBadgeDropdownItems,
  columnHandler,
  isChild = false,
  id,
  operation,
  mode = "selector",
  values = [],
  data,
  rowSelection = false,
  onChange,
  paginationMode = "router",
  enablePagination = true,
  enableEdit = true,
  title,
  onRowSelect,
  multiRowSelection = false,
  columns = [],
  fetchItemsRequest,
  deleteItemRequest,
  deleteBulkItemsRequest,
  editFormComponent,
}: DataManagerProps) {
  const searchParamsUse = useSearchParams();

  const searchParamPage = searchParamsUse.get("page");
  const searchParamSortOrder = searchParamsUse.get("sort_order");
  const searchParamSortBy = searchParamsUse.get("sort_by");
  const searchParamQuery = searchParamsUse.get("query");
  const searchParamPageSize = searchParamsUse.get("page_size");

  const searchParams: DatatableSearchParams = {
    page: searchParamPage,
    sort_order: searchParamSortOrder,
    sort_by: searchParamSortBy,
    query: searchParamQuery,
    page_size: searchParamPageSize,
  };

  const appModalContext = useContext(AppModalContext);
  const notificationContext = useContext(AppNotificationContext);
  const dataTableContext = useContext(DataTableContext);

  function updateDataTableContextState(data: unknown) {
    if (!isObject(data)) {
      return;
    }
    setDataTableContextState((prevState) => {
      let newState: DataTableContextType = { ...prevState };
      Object.keys(data).forEach((key) => {
        if (dataTableContextData.hasOwnProperty(key)) {
          newState[key] = data[key];
        }
      });
      return newState;
    });
  }

  const [dataTableContextState, setDataTableContextState] =
    useState<DataTableContextType>({
      ...dataTableContextData,
      refresh: makeRequest,
      update: updateDataTableContextState,
    });

  const modalService = new ModalService(
    dataTableContextState,
    setDataTableContextState
  );
  const confirmationService = new ConfirmationService(
    dataTableContextState,
    setDataTableContextState
  );
  modalService.setKey("modal");
  confirmationService.setKey("confirmation");

  function isChecked(
    item: Record<string, unknown>,
    values: Array<Record<string, unknown>>
  ): boolean {
    let checked: boolean = false;
    if (Array.isArray(values)) {
      checked = values.some((value: Record<string, unknown>) => {
        if (typeof value === "object") {
          return value?.id === item?.id;
        }
        return value === item.id;
      });
    }
    return checked;
  }

  function applyValuesToData(
    data: Array<Record<string, unknown>>,
    values: Array<Record<string, unknown>>
  ): Array<Record<string, unknown>> {
    return data.map((item: Record<string, unknown>) => {
      const cloneItem: Record<string, unknown> = { ...item };
      cloneItem.checked = isChecked(cloneItem, values);
      return cloneItem;
    });
  }

  async function makeRequest() {
    if (dataTableContextState?.requestStatus !== "loading") {
      setDataTableContextState((prevState) => {
        let newState = {
          ...prevState,
          requestStatus: "loading",
        };
        return newState;
      });
      const response = await request({
        searchParams,
      });

      if (
        typeof response === "object" &&
        response?.data &&
        response?.links &&
        response?.meta
      ) {
        const data = response?.data || [];
        setDataTableContextState((prevState) => {
          const newState: Record<string, unknown> = { ...prevState };
          newState.data = applyValuesToData(
            data,
            (values as Array<Record<string, unknown>>) || []
          );
          newState.links = response.links;
          newState.meta = response.meta;
          newState.requestStatus = "idle";
          return newState;
        });
        return;
      }
      setDataTableContextState((prevState) => {
        let newState = {
          ...prevState,
          requestStatus: "idle",
        };
        return newState;
      });
      return;
    }
  }

  function handleRowSelectActionClick({
    action,
    data,
  }: OnRowSelectActionClick) {
    if (!isObject(action)) {
      return;
    }
    if (typeof action?.onClick === "function") {
      action.onClick({
        action,
        data,
        dataTableContextState,
      });
    }
  }

  function handleRowSelect(
    item: DataTableItem,
    index: number
  ): boolean | Promise<boolean> {
    if (typeof onRowSelect !== "function") {
      return true;
    }
    return onRowSelect(item, index, dataTableContextState);
  }

  function getAddNewModalInitialValues() {
    switch (mode) {
      case "selector":
        return {
          items: [],
        };
      case "edit":
        return {};
      default:
        return {};
    }
  }

  function getShippingMethodFormModalProps(index?: number) {
    return {
      formProps: {
        operation: operation,
        initialValues: getAddNewModalInitialValues(),
      },
      show: true,
      showFooter: true,
      onOk: async ({
        formHelpers,
      }: {
        formHelpers?: FormikProps<FormikValues>;
      }) => {
        if (!formHelpers) {
          return;
        }
        if (!operation) {
          console.warn("Operation is required");
          return;
        }
        if (typeof formHelpers?.submitForm !== "function") {
          console.warn("submitForm is not a function");
          return;
        }
        let response: boolean | Promise<boolean> = false;
        switch (mode) {
          case "selector":
            DataManagerService.selectorModeHandler({
              onChange,
              data,
              values: formHelpers?.values,
              index,
            });
            break;
          case "edit":
            response = DataManagerService.editModeCreateHandler({
              onChange,
              data,
              values: formHelpers?.values,
              index,
            });
            break;
          default:
            console.warn("Invalid mode");
            return;
        }
        if (enableEdit) {
          return await formHelpers.submitForm();
        }
      },
      fullscreen: true,
    };
  }

  function getFormComponentData() {
    let component: React.ComponentType<unknown> | null = null;
    let props: Record<string, unknown> = {};
    if (typeof editFormComponent === "function") {
      component = editFormComponent;
    } else if (editFormComponent?.component) {
      component = editFormComponent.component;
      props = editFormComponent.props || {};
    }
    return {
      component,
      props,
    };
  }

  function getDatatableContextState() {
    if (isChild) {
      return dataTableContext;
    }
    return dataTableContextState;
  }

  function getDefaultActionColumnBadgeDropdownItems(
    item: Record<string, unknown>,
    index: number
  ) {
    const editFormComponentData = getFormComponentData();
    if (!editFormComponentData?.component) {
      console.warn("editFormComponent is required");
      return null;
    }

    const EditForm = editFormComponentData.component;
    const modalProps = getShippingMethodFormModalProps(index);

    const items: Array<React.ReactNode> = [];
    items.push({
      text: "Edit",
      linkProps: {
        href: "#",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          dataTableContextState.modal.show(
            {
              title: "Edit Shipping method",
              component: (
                <EditForm
                  shippingMethodId={item?.id}
                  dataTable={dataTableContextState}
                  data={item}
                  operation={"edit"}
                  inModal={true}
                  modalId={DataManagerService.getId(id, "edit")}
                  {...(editFormComponentData?.props || {})}
                />
              ),
              ...modalProps,
            },
            DataManagerService.getId(id, "edit")
          );
        },
      },
    });
    items.push({
      text: "Delete",
      linkProps: {
        href: "#",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          appModalContext.show(
            {
              title: "Delete shipping method",
              component: (
                <p>
                  Are you sure you want to delete this item ({item?.title})?
                </p>
              ),
              onOk: async () => {
                if (!item?.id) {
                  notificationContext.show(
                    {
                      variant: "danger",
                      type: "toast",
                      title: "Error",
                      component: <p>Shipping method ID is required</p>,
                    },
                    "shipping-method-delete-error"
                  );
                  return;
                }

                if (typeof deleteItemRequest !== "function") {
                  console.warn("deleteItemRequest is not a function");
                  return;
                }

                const response = await deleteItemRequest({ item });
                if (!response) {
                  notificationContext.show(
                    {
                      variant: "danger",
                      type: "toast",
                      title: "Error",
                      component: <p>Failed to delete item</p>,
                    },
                    "shipping-method-delete-error"
                  );
                  return;
                }
                dataTableContextState.refresh();
              },
              show: true,
              showFooter: true,
            },
            DataManagerService.getId(id, "edit")
          );
        },
      },
    });
    return items;
  }
  function getDefaultActionColumnItems(
    item: Record<string, unknown>,
    index: number
  ) {
    const editFormComponentData = getFormComponentData();
    if (!editFormComponentData?.component) {
      console.warn("editFormComponent is required");
      return null;
    }

    const EditForm = editFormComponentData.component;
    const modalProps = getShippingMethodFormModalProps(index);
    const items: Array<React.ReactNode> = [];
    items.push(
      <Link
        className="badge bg-success-light mr-2"
        target="_blank"
        href="http://google.com"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          getDatatableContextState().modal.show(
            {
              title: "Edit shipping method",
              component: (
                <EditForm
                  dataTable={getDatatableContextState()}
                  data={item}
                  operation={"edit"}
                  inModal={true}
                  modalId={DataManagerService.getId(id, "edit")}
                  {...(editFormComponentData?.props || {})}
                />
              ),
              ...modalProps,
            },
            DataManagerService.getId(id, "edit")
          );
        }}
      >
        <i className="lar la-eye"></i>
      </Link>
    );
    items.push(
      <Link
        className="badge bg-danger-light mr-2"
        target="_blank"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          dataTableContextState.modal.show(
            {
              title: "Delete shipping method",
              component: (
                <p>
                  Are you sure you want to delete this shipping method (
                  {item?.name} | {item?.label})?
                </p>
              ),
              onOk: async () => {
                console.log("Delete shipping method", { operation, item });
                if (!operation) {
                  console.warn("Operation is required");
                  return;
                }
                if (Array.isArray(data) && data.length) {
                  let cloneData = [...data];
                  cloneData.splice(index, 1);
                  if (typeof onChange === "function") {
                    onChange(cloneData);
                  }
                  dataTableContextState.modal.close(
                    DataManagerService.getId(id, "delete")
                  );
                  return;
                }
                if (!item?.id) {
                  notificationContext.show(
                    {
                      variant: "danger",
                      type: "toast",
                      title: "Error",
                      component: <p>Shipping method ID is required</p>,
                    },
                    "shipping-method-delete-error"
                  );
                  return;
                }
                if (typeof deleteItemRequest !== "function") {
                  console.warn("deleteItemRequest is not a function");
                  return;
                }
                const response = await deleteItemRequest({ item });
                if (!response) {
                  notificationContext.show(
                    {
                      variant: "danger",
                      type: "toast",
                      title: "Error",
                      component: <p>Failed to delete shipping method</p>,
                    },
                    "shipping-method-delete-error"
                  );
                  return;
                }
                dataTableContextState.refresh();
              },
              show: true,
              showFooter: true,
            },
            DataManagerService.getId(id, "delete")
          );
        }}
      >
        <i className="lar la-eye"></i>
      </Link>
    );
    return items;
  }

  function getActionColumnItems(item: Record<string, unknown>, index: number) {
    if (typeof actionColumnItems === "function") {
      return actionColumnItems({
        item,
        index,
        dataTableContextState,
        dropdownItems: getDefaultActionColumnItems(item, index),
      });
    }
    return getDefaultActionColumnItems(item, index);
  }
   function getActionColumnBadgeDropdownItems(
    item: Record<string, unknown>,
    index: number
  ) {
    if (typeof actionColumnBadgeDropdownItems === "function") {
      return actionColumnBadgeDropdownItems({
        item,
        index,
        dataTableContextState,
        dropdownItems: getDefaultActionColumnBadgeDropdownItems(item, index),
      });
    }
    return getDefaultActionColumnBadgeDropdownItems(item, index);
  }

   function buildActionColumn(
    item: Record<string, unknown>,
    index: number
  ) {
    if (typeof renderActionColumn === "function") {
      return renderActionColumn({ item, index, dataTableContextState });
    }
    const actionColumns = getActionColumnItems(item, index);
    const actionBadgeColumns = getActionColumnBadgeDropdownItems(item, index);
    return (
      <div className="d-flex align-items-center list-action">
        {Array.isArray(actionColumns) && actionColumns.map((actionItem, actionIndex) => {
          return (
            <React.Fragment key={actionIndex}>
              {actionItem}
            </React.Fragment>
          )
        })}
        {Array.isArray(actionBadgeColumns) && actionBadgeColumns.length > 0 && (
          <BadgeDropDown data={actionBadgeColumns} />
        )}
      </div>
    );
  }
  async function prepareSearch(searchParams: DatatableSearchParams = {}) {
    const query: Record<string, unknown> = {};

    if (isNotEmpty(searchParams?.sort_by)) {
      query[SORT_BY] = searchParams?.sort_by;
    }

    if (isNotEmpty(searchParams?.sort_order)) {
      query[SORT_ORDER] = searchParams?.sort_order;
    }

    if (isNotEmpty(searchParams?.shippingMethod)) {
      query["shippingMethod"] = searchParams.shippingMethod;
    }
    return query;
  }
  async function request({
    searchParams,
  }: {
    searchParams: Record<string, string | null | undefined>;
  }) {
    let query = dataTableContextState?.query || {};
    let post = dataTableContextState?.post || {};
    const preparedQuery = await prepareSearch(searchParams);
    query = {
      ...query,
      ...preparedQuery,
    };
    if (typeof fetchItemsRequest !== "function") {
      console.warn("fetchItemsRequest is not a function");
      return null;
    }
    return await fetchItemsRequest({
      post,
      query,
    });
  }

  async function renderAddNew(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    const editFormComponentData = getFormComponentData();
    if (!editFormComponentData?.component) {
      console.warn("editFormComponent is required");
      return null;
    }
    const EditForm = editFormComponentData.component;
    const modalProps = await getShippingMethodFormModalProps();
    getDatatableContextState().modal.show(
      {
        title: "Create shipping method",
        component: (
          <EditForm
            dataTable={dataTableContextState}
            operation={"create"}
            inModal={true}
            modalId={DataManagerService.getId(id, "create")}
            {...(editFormComponentData?.props || {})}
          />
        ),
        ...modalProps,
      },
      DataManagerService.getId(id, "create")
    );
  }

  function getRowSelectActions() {
    const actions: Array<{
      label: string;
      name: string;
      onClick: (params: DMOnRowSelectActionClick) => void;
    }> = [];
    actions.push({
      label: "Delete",
      name: "delete",
      onClick: ({
        action,
        data,
        dataTableContextState,
      }: DMOnRowSelectActionClick) => {
        dataTableContextState.confirmation.show(
          {
            title: "Edit Menu",
            message: "Are you sure you want to delete selected items?",
            onOk: async () => {
              console.log("Yes");
              if (!data?.length) {
                notificationContext.show(
                  {
                    variant: "danger",
                    type: "toast",
                    title: "Error",
                    component: <p>No items selected</p>,
                  },
                  "shipping-method-bulk-delete-error"
                );
                return;
              }
              const ids = RequestHelpers.extractIdsFromArray(data);
              if (!ids?.length) {
                notificationContext.show(
                  {
                    variant: "danger",
                    type: "toast",
                    title: "Error",
                    component: <p>Item IDs are required</p>,
                  },
                  "shipping-method-bulk-delete-error"
                );
                return;
              }
              if (typeof deleteBulkItemsRequest !== "function") {
                console.warn("deleteItemRequest is not a function");
                return;
              }
              const response = await deleteBulkItemsRequest({ ids });
              if (!response) {
                notificationContext.show(
                  {
                    variant: "danger",
                    type: "toast",
                    title: "Error",
                    component: <p>Failed to delete items</p>,
                  },
                  "shipping-method-bulk-delete-error"
                );
                return;
              }

              notificationContext.show(
                {
                  variant: "success",
                  type: "toast",
                  title: "Success",
                  component: <p>Shipping methods deleted successfully</p>,
                },
                "shipping-method-bulk-delete-success"
              );
              dataTableContextState.refresh();
            },
            onCancel: () => {
              console.log("Cancel delete");
            },
          },
          "delete-bulk-shipping-method-confirmation"
        );
      },
    });
    return actions;
  }

  useEffect(() => {
    const someSet = Object.keys(searchParams).some((key) => {
      return searchParams[key] !== null && searchParams[key] !== undefined;
    });
    if (someSet) {
      return;
    }
    console.log("DataManager useEffect init", dataTableContextState.query);
    makeRequest();
  }, []);

  useEffect(() => {
    setDataTableContextState((prevState) => {
      let newState = {
        ...prevState,
        ...modalService.getState(),
        ...confirmationService.getState(),
      };
      return newState;
    });
  }, []);

  useEffect(() => {
    if (paginationMode === "state") {
      makeRequest();
      return;
    }
    if (dataTableContextState?.requestStatus !== "idle") {
      return;
    }
    const params = UrlHelpers.getSearchParams(
      searchParamsUse,
      PaginationHelpers.DEFAULT_PARAMS
    );
    if (Object.keys(params).length === 0) {
      return;
    }
    setDataTableContextState(
      (prevState: SetStateAction<DataTableContextType>) => {
        let newState: DataTableContextType = {
          ...prevState,
        };
        newState.query = {
          ...prevState.query,
          ...params,
        };
        return newState;
      }
    );
  }, [
    searchParamPage,
    searchParamSortOrder,
    searchParamSortBy,
    searchParamQuery,
    searchParamPageSize,
  ]);
  useEffect(() => {
    if (!dataTableContextState?.query) {
      return;
    }
    if (!isObject(dataTableContextState.query)) {
      return;
    }
    if (isObjectEmpty(dataTableContextState.query)) {
      return;
    }
    makeRequest();
  }, [dataTableContextState.query]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (!Array.isArray(data)) {
      return;
    }

    updateDataTableContextState({
      data,
      links: [],
      meta: {},
      requestStatus: "idle",
    });
  }, [data]);
  return (
    <DataTableContext.Provider value={dataTableContextState}>
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-block card-stretch card-height">
            <div className="card-header">
              <div className="d-flex justify-content-between">
                <div className="iq-header-title">
                  {title && <h4 className="card-title mb-0">{title}</h4>}
                </div>

                {enableEdit && (
                  <a
                    href="#"
                    className="btn btn-primary"
                    onClick={(
                      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                    ) => {
                      e.preventDefault();
                      e.stopPropagation();
                      renderAddNew(e);
                    }}
                  >
                    Add New
                  </a>
                )}
              </div>
            </div>
            <div className="card-body">
              {Array.isArray(dataTableContextState?.data) &&
                dataTableContextState.data.length && (
                  <>
                    <DataTable
                      rowSelection={rowSelection}
                      onChange={onChange}
                      paginationMode={paginationMode}
                      enablePagination={enablePagination}
                      enableEdit={enableEdit}
                      onRowSelect={handleRowSelect}
                      onRowSelectActionClick={handleRowSelectActionClick}
                      rowSelectActions={getRowSelectActions()}
                      multiRowSelection={multiRowSelection}
                      columns={
                        typeof columnHandler === "function"
                          ? columnHandler(columns)
                          : columns
                      }
                      data={dataTableContextState.data}
                      actionColumn={(item, index) => {
                        return buildActionColumn(
                          item,
                          index,
                          dataTableContextState
                        );
                      }}
                    />
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
      {modalService.render()}
      {confirmationService.render()}
    </DataTableContext.Provider>
  );
}
export default DataManager;
