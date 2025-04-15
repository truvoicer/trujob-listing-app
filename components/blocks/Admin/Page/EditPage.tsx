import Form, { FormContextType } from "@/components/form/Form";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Dispatch, useContext, useEffect, useState } from "react";
import PageBlockForm from "./PageBlockForm";
import { formContextData } from "@/components/form/contexts/FormContext";
import { Button, Modal } from "react-bootstrap";
import SidebarForm from "./SidebarForm";
import SelectPageViews from "./SelectPageViews";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_PAGE_MODAL_ID } from "./ManagePage";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Page } from "@/types/Page";
import { Sidebar } from "@/types/Sidebar";
import { Block } from "@/types/Block";

type Props = {
    data: Page;
    operation: string;
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
function EditPage({ data, operation }: Props) {
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

    const appModalContext = useContext(AppModalContext);
    const dataTableContext = useContext(DataTableContext);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">

                <Form
                    operation={operation}
                    initialValues={initialValues}
                    onSubmit={async (values) => {
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
                            requestData.blocks = requestData?.blocks.map((block: Block) => {
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
                                // if (!data?.id || data?.id === '') {
                                //     throw new Error('Page ID is required');
                                // }
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

                    }}
                >
                    {({
                        values,
                        errors,
                        setFieldValue,
                        onChange,
                    }: FormContextType) => {
                        return (
                            <>
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <SelectPageViews
                                            value={values?.view || ''}
                                            onChange={(pageViews: string) => {
                                                setFieldValue('view', pageViews);
                                            }}
                                            showSubmitButton={false}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="custom-control custom-checkbox mb-3 text-left">
                                            <input
                                                onChange={e => {
                                                    onChange(e);
                                                }}
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="is_active"
                                                name="is_active"
                                                checked={values?.is_active || false} />
                                            <label className="custom-control-label" htmlFor="is_active">
                                                Is active
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <div className="custom-control custom-checkbox mb-3 text-left">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="is_featured"
                                                name="is_featured"
                                                onChange={onChange}
                                                checked={values?.is_featured || false} />
                                            <label className="custom-control-label" htmlFor="is_featured">
                                                Is Featured
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <div className="custom-control custom-checkbox mb-3 text-left">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="is_home"
                                                name="is_home"
                                                onChange={onChange}
                                                checked={values?.is_home || false} />
                                            <label className="custom-control-label" htmlFor="is_home">
                                                Is Home
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="floating-input form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="title"
                                                id="title"
                                                onChange={onChange}
                                                value={values?.title || ""} />
                                            <label className="form-label" htmlFor="title">Title</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="floating-input form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                id="name"
                                                onChange={onChange}
                                                value={values?.name || ""} />
                                            <label className="form-label" htmlFor="name">Name</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="floating-input form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="permalink"
                                                id="permalink"
                                                onChange={onChange}
                                                value={values?.permalink || ""} />
                                            <label className="form-label" htmlFor="permalink">Permalink</label>
                                        </div>
                                    </div>


                                    <div className="col-12 col-lg-6">
                                        <div className="floating-input form-group">
                                            <textarea
                                                className="form-control"
                                                name="content"
                                                id="content"
                                                onChange={onChange}
                                                value={values?.content || ""}></textarea>
                                            <label className="form-label" htmlFor="content">Content</label>
                                        </div>
                                    </div>


                                    <div className="col-12 my-3">
                                        <h4>Manage</h4>
                                        <button
                                            type="button"
                                            className="btn btn-primary mr-2"
                                            onClick={(e) => {
                                                setModalTitle('Manage Blocks', setBlocksModal);
                                                setModalFooter(false, setBlocksModal);
                                                showModal(setBlocksModal);
                                            }}
                                        >
                                            Manage Blocks
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary mr-2"
                                            onClick={(e) => {
                                                setModalTitle('Manage Sidebars', setSidebarsModal);
                                                setModalFooter(false, setSidebarsModal);
                                                showModal(setSidebarsModal);
                                            }}
                                        >
                                            Manage Sidebars
                                        </button>
                                    </div>


                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary mr-2"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                <Modal show={blocksModal.show} onHide={() => hideModal(setBlocksModal)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{blocksModal?.title || ''}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <PageBlockForm
                                            data={values?.blocks || []}
                                            onChange={(blocks: Array<Block>) => {
                                                console.log('blocks', blocks);
                                                setFieldValue('blocks', blocks);
                                            }}
                                        />
                                    </Modal.Body>
                                    {blocksModal.footer &&
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => hideModal(setBlocksModal)}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => hideModal(setBlocksModal)}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    }
                                </Modal>
                                <Modal show={sidebarsModal.show} onHide={() => hideModal(setSidebarsModal)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{sidebarsModal?.title || ''}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <SidebarForm
                                            data={values?.sidebars || []}
                                            onChange={(sidebars: Array<Sidebar>) => {
                                                setFieldValue('sidebars', sidebars);
                                            }}
                                        />
                                    </Modal.Body>
                                    {sidebarsModal.footer &&
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => hideModal(setSidebarsModal)}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => hideModal(setSidebarsModal)}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    }
                                </Modal>
                            </>
                        )
                    }}
                </Form>
            </div>
        </div>
    );
}
export default EditPage;