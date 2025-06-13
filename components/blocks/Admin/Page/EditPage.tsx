import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_PAGE_ID } from "./ManagePage";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Page } from "@/types/Page";
import { Sidebar } from "@/types/Sidebar";
import { PageBlock } from "@/types/PageBlock";
import EditPageFields from "./EditPageFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export type EditPageProps = {
  data?: Page;
  operation: "edit" | "update" | "add" | "create";
  inModal?: boolean;
  modalId?: string;
  dataTable?: DataTableContextType;
};
function EditPage({
  dataTable,
  data,
  operation,
  inModal = false,
  modalId,
}: EditPageProps) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string | React.ReactNode | React.Component;
    type: string;
  } | null>(null);

  const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
  const initialValues: Page = {
    id: data?.id || 0,
    view: data?.view || "",
    name: data?.name || "",
    title: data?.title || "",
    permalink: data?.permalink || "",
    content: data?.content || "",
    is_active: data?.is_active || false,
    is_featured: data?.is_featured || false,
    is_home: data?.is_home || false,
    blocks: data?.blocks || [],
    has_sidebar: data?.has_sidebar || false,
    sidebars: data?.sidebars || [],
    settings: {
      meta_title: data?.settings?.meta_title || "",
      meta_description: data?.settings?.meta_description || "",
      meta_keywords: data?.settings?.meta_keywords || "",
      meta_robots: data?.settings?.meta_robots || "",
      meta_canonical: data?.settings?.meta_canonical || "",
      meta_author: data?.settings?.meta_author || "",
      meta_publisher: data?.settings?.meta_publisher || "",
      meta_og_title: data?.settings?.meta_og_title || "",
      meta_og_description: data?.settings?.meta_og_description || "",
      meta_og_type: data?.settings?.meta_og_type || "",
      meta_og_url: data?.settings?.meta_og_url || "",
      meta_og_image: data?.settings?.meta_og_image || "",
      meta_og_site_name: data?.settings?.meta_og_site_name || "",
    },
  };

  async function handleSubmit(values: Page) {
    let requestData = { ...values };

    if (["edit", "update"].includes(operation) && isObjectEmpty(requestData)) {
      console.log("No data to update");
      return;
    }
    if (Array.isArray(values?.roles)) {
      requestData.roles = RequestHelpers.extractIdsFromArray(values.roles);
    }
    if (Array.isArray(requestData?.sidebars)) {
      requestData.sidebars = requestData?.sidebars
        .filter((sidebar: Sidebar) => {
          return sidebar?.id;
        })
        .map((sidebar: Sidebar) => {
          return sidebar.id;
        });
    }
    if (Array.isArray(requestData?.blocks)) {
      requestData.blocks = requestData?.blocks.map((block: PageBlock) => {
        if (Array.isArray(block?.sidebars)) {
          block.sidebars = RequestHelpers.extractIdsFromArray(block.sidebars);
        }
        if (Array.isArray(block?.roles)) {
          block.roles = RequestHelpers.extractIdsFromArray(block.roles);
        }
        return block;
      });
    }

    let response = null;
    switch (operation) {
      case "edit":
      case "update":
        if (!data?.id) {
          throw new Error("Page ID is required");
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: `${truJobApiConfig.endpoints.page}/${data.id}/update`,
          method: ApiMiddleware.METHOD.PATCH,
          protectedReq: true,
          data: requestData,
        });
        break;
      case "add":
      case "create":
        if (Array.isArray(values?.productTypes)) {
          return;
        }
        response = await truJobApiMiddleware.resourceRequest({
          endpoint: `${truJobApiConfig.endpoints.page}/create`,
          method: ApiMiddleware.METHOD.POST,
          protectedReq: true,
          data: requestData,
        });
        break;
      default:
        console.log("Invalid operation");
        break;
    }

    if (!response) {
      setAlert({
        show: true,
        message: (
          <div>
            <strong>Error:</strong>
            {truJobApiMiddleware
              .getErrors()
              .map((error: ErrorItem, index: number) => {
                return <div key={index}>{error.message}</div>;
              })}
          </div>
        ),
        type: "danger",
      });
      return;
    }
    if (dataTable) {
      dataTable.refresh();
    }
    dataTableContext.refresh();
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_PAGE_ID, "edit")
    );
    dataTableContext.modal.close(
      DataManagerService.getId(MANAGE_PAGE_ID, "create")
    );
  }

  useEffect(() => {
    if (!inModal) {
      return;
    }
    if (!modalId) {
      return;
    }

    dataTableContext.modal.update(
      {
        formProps: {
          operation: operation,
          initialValues: initialValues,
          onSubmit: handleSubmit,
        },
      },
      modalId
    );
  }, [inModal, modalId]);

  const dataTableContext = useContext(DataTableContext);
  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
          </div>
        )}
        {inModal &&
          ModalService.modalItemHasFormProps(
            dataTableContext?.modal,
            modalId
          ) && <EditPageFields operation={operation} />}
        {!inModal && (
          <Form
            operation={operation}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {() => {
              return <EditPageFields operation={operation} />;
            }}
          </Form>
        )}
      </div>
    </div>
  );
}
export default EditPage;
