import Form, { FormContextType } from "@/components/form/Form";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Dispatch, useContext, useEffect, useState } from "react";
import PageBlockForm from "./PageBlockForm";
import { formContextData } from "@/components/form/contexts/FormContext";
import { Button, Modal } from "react-bootstrap";
import SidebarForm from "../Sidebar/SidebarForm";
import SelectPageViews from "./SelectPageViews";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_PAGE_MODAL_ID } from "./ManagePage";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Page } from "@/types/Page";
import { Sidebar } from "@/types/Sidebar";
import { PageBlock } from "@/types/PageBlock";
import EditPageFields from "./EditPageFields";

type EditPageProps = {
    data?: Page;
    operation: string;
    inModal?: boolean;
    modalId?: string;
}
type SidebarModalState = {
    show: boolean;
    title: string;
    footer: boolean;
}
type BlocksModalState = {
    show: boolean;
    title: string;
    footer: boolean;
}
function EditPage({
    data,
    operation,
    inModal = false,
    modalId,
}: EditPageProps) {
    const [blocksModal, setBlocksModal] = useState<BlocksModalState>({
        show: false,
        title: '',
        footer: true,
    });
    const [sidebarsModal, setSidebarsModal] = useState<SidebarModalState>({
        show: false,
        title: '',
        footer: true,
    });

    const initialValues = {
        view: data?.view || '',
        name: data?.name || '',
        title: data?.title || '',
        permalink: data?.permalink || '',
        content: data?.content || '',
        is_active: data?.is_active || false,
        is_featured: data?.is_featured || false,
        is_home: data?.is_home || false,
        blocks: data?.blocks || [],
        has_sidebar: data?.has_sidebar || false,
        sidebars: data?.sidebars || [],
        settings: {
            meta_title: data?.settings?.meta_title || '',
            meta_description: data?.settings?.meta_description || '',
            meta_keywords: data?.settings?.meta_keywords || '',
            meta_robots: data?.settings?.meta_robots || '',
            meta_canonical: data?.settings?.meta_canonical || '',
            meta_author: data?.settings?.meta_author || '',
            meta_publisher: data?.settings?.meta_publisher || '',
            meta_og_title: data?.settings?.meta_og_title || '',
            meta_og_description: data?.settings?.meta_og_description || '',
            meta_og_type: data?.settings?.meta_og_type || '',
            meta_og_url: data?.settings?.meta_og_url || '',
            meta_og_image: data?.settings?.meta_og_image || '',
            meta_og_site_name: data?.settings?.meta_og_site_name || ''
        }
    };
    function hideModal(setter: Dispatch<React.SetStateAction<SidebarModalState | BlocksModalState>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }
    function showModal(setter: Dispatch<React.SetStateAction<SidebarModalState | BlocksModalState>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }
    function setModalTitle(title: string, setter: Dispatch<React.SetStateAction<SidebarModalState | BlocksModalState>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }
    function setModalFooter(hasFooter: boolean = false, setter: Dispatch<React.SetStateAction<SidebarModalState | BlocksModalState>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }

    async function handleSubmit(values: Page) {
        let requestData = { ...values };

        if (['edit', 'update'].includes(operation) && isObjectEmpty(requestData)) {
            console.warn('No data to update');
            return;
        }
        if (Array.isArray(requestData?.sidebars)) {
            requestData.sidebars = requestData?.sidebars.filter((sidebar: Sidebar) => {
                return sidebar?.id;
            })
                .map((sidebar: Sidebar) => {
                    return sidebar.id;
                });
        }
        if (Array.isArray(requestData?.blocks)) {
            requestData.blocks = requestData?.blocks.map((block: PageBlock) => {
                if (Array.isArray(block?.sidebars)) {
                    block.sidebars = block.sidebars
                        .filter((sidebar: Sidebar) => {
                            return sidebar?.id;
                        })
                        .map((sidebar: Sidebar) => {
                            return sidebar.id;
                        });
                }
                return block;
            });
        }


        let response = null;
        switch (operation) {
            case 'edit':
            case 'update':
                if (!data?.id) {
                    throw new Error('Page ID is required');
                }
                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.page}/${data.id}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.page}/create`,
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            default:
                console.warn('Invalid operation');
                break;
        }
        if (!response) {
            return;
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(EDIT_PAGE_MODAL_ID);

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
                }
            },
            modalId
        );
    }, [inModal, modalId]);

    const appModalContext = useContext(AppModalContext);
    const dataTableContext = useContext(DataTableContext);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                {inModal
                    ? (
                        <EditPageFields />
                    )
                    : (
                        <Form
                            operation={operation}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        >
                            {() => {
                                return (
                                    <EditPageFields />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditPage;