import DataTable, {
  DataTableItem,
  OnRowSelectActionClick,
} from "@/components/Table/DataTable";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { ModalService } from "@/library/services/modal/ModalService";
import { useSearchParams } from "next/navigation";
import { isObject, isObjectEmpty } from "@/helpers/utils";
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

export type DataManageComponentProps = {
  mode?: "selector" | "edit";
  operation?: "edit" | "update" | "add" | "create";
  enableEdit?: boolean;
  paginationMode?: "router" | "state";
  enablePagination?: boolean;
  onChange: (tableData: Array<any>) => void;
  rowSelection?: boolean;
  multiRowSelection?: boolean;
  data?: Array<any>;
  onRowSelect?: (
    item: DataTableItem,
    index: number,
    dataTableContextState: any
  ) => boolean | Promise<boolean>;
};
export interface DMOnRowSelectActionClick extends OnRowSelectActionClick {
  data: Array<any>;
  dataTableContextState: any;
  setDataTableContextState: (data: any) => void;
}

export type DataManagerProps = {
  id: string;
  mode?: "selector" | "edit";
  operation?: "edit" | "update" | "add" | "create";
  values?: Array<any>;
  data?: Array<any>;
  onChange: (tableData: Array<any>) => void;
  paginationMode?: "router" | "state";
  enablePagination?: boolean;
  enableEdit?: boolean;
  title?: string;
  onRowSelect?: (
    item: DataTableItem,
    index: number,
    dataTableContextState: any
  ) => boolean | Promise<boolean>;
  multiRowSelection?: boolean;
  rowSelection?: boolean;
  columns?: Array<any>;
  deleteItemRequest?: ({ item }: { item: any }) => Promise<boolean>;
  deleteBulkItemsRequest?: ({ ids }: { ids: any }) => Promise<boolean>;
  fetchItemsRequest?: ({
    post,
    query,
  }: {
    post: Record<string, any>;
    query: Record<string, any>;
  }) => Promise<{
    data: Array<Record<string, any>>;
    links: Array<Record<string, any>>;
    meta: Record<string, any>;
  }>;
  editFormComponent?: React.ComponentType<any>;
};

export type DataTableContextType = {
  [key: string]: any | Array<any> | string | null | undefined;
  requestStatus: string;
  data: Array<any>;
  links: any;
  meta: any;
  query: any;
  post: any;
  modal: any;
  refresh: () => void;
  update: (data: any) => void;
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

  
  function updateDataTableContextState(data: any) {
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
          let newState = { ...prevState };
          newState.data = data.map((item: any, index: number) => {
            let cloneItem = { ...item };
            let isChecked = false;
            if (Array.isArray(values)) {
              isChecked = values.some((value: any) => {
                if (typeof value === "object") {
                  return value.id === item.id;
                }
                return value === item.id;
              });
            }
            cloneItem.checked = isChecked;
            return cloneItem;
          });
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
          shippingMethods: [],
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
        switch (mode) {
          case "selector":
            DataManagerService.selectorModeHandler({
              onChange,
              data,
              values: formHelpers?.values?.shippingMethods,
              index,
            });
            break;
          case "edit":
            DataManagerService.editModeCreateHandler({
              onChange,
              data,
              values: formHelpers?.values,
            });
            break;
          default:
            console.warn("Invalid mode");
            return;
        }

        return await formHelpers.submitForm();
      },
      fullscreen: true,
    };
  }

  function renderActionColumn(item: ShippingMethod, index: number) {
    if (!editFormComponent) {
      console.warn("editFormComponent is required");
      return null;
    }
    const EditForm = editFormComponent;
    return (
      <div className="d-flex align-items-center list-action">
        <Link
          className="badge bg-success-light mr-2"
          target="_blank"
          href="http://google.com"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dataTableContextState.modal.show(
              {
                title: "Edit shipping method",
                component: (
                  <EditForm
                    dataTable={dataTableContextState}
                    data={item}
                    operation={"edit"}
                    inModal={true}
                    modalId={DataManagerService.getId(id, "edit")}
                  />
                ),
                ...getShippingMethodFormModalProps(index),
              },
              DataManagerService.getId(id, "edit")
            );
          }}
        >
          <i className="lar la-eye"></i>
        </Link>
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
        <BadgeDropDown
          data={[
            {
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
                        />
                      ),
                      ...getShippingMethodFormModalProps(index),
                    },
                    DataManagerService.getId(id, "edit")
                  );
                },
              },
            },
            {
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
                          Are you sure you want to delete this shippingMethod (
                          {item?.title})?
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
                              component: <p>Failed to delete shippingMethod</p>,
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
            },
          ]}
        />
      </div>
    );
  }
  async function prepareSearch(searchParams: DatatableSearchParams = {}) {
    let query: any = {};

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
    if (!operation) {
      console.warn("Operation is required");
      return;
    }
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

  function renderAddNew(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    let modalState;
    if (mode === "selector") {
      modalState = dataTableContextState.modal;
    } else if (mode === "edit") {
      modalState = dataTableContextState.modal;
    } else {
      console.warn("Invalid mode");
      return;
    }

    if (!editFormComponent) {
      console.warn("editFormComponent is required");
      return null;
    }

    const EditForm = editFormComponent;
    modalState.show(
      {
        title: "Create shipping method",
        component: (
          <EditForm
            dataTable={dataTableContextState}
            operation={"create"}
            inModal={true}
            modalId={DataManagerService.getId(id, "create")}
          />
        ),
        ...getShippingMethodFormModalProps(),
      },
      DataManagerService.getId(id, "create")
    );
  }

  function getRowSelectActions() {
    let actions = [];
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
            message:
              "Are you sure you want to delete selected shippingMethods?",
            onOk: async () => {
              console.log("Yes");
              if (!data?.length) {
                notificationContext.show(
                  {
                    variant: "danger",
                    type: "toast",
                    title: "Error",
                    component: <p>No shippingMethods selected</p>,
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
                    component: <p>Shipping method IDs are required</p>,
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
                    component: <p>Failed to delete shippingMethods</p>,
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
                      renderAddNew(e, {
                        dataTableContextState,
                        setDataTableContextState,
                      });
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
                      columns={columns}
                      data={dataTableContextState.data}
                      actionColumn={(item, index) => {
                        return renderActionColumn(
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
