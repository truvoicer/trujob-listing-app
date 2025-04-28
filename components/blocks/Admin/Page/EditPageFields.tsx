import { Dispatch, useContext, useState } from "react";
import PageBlockForm from "./PageBlockForm";
import { Button, Modal } from "react-bootstrap";
import SidebarForm from "../Sidebar/SidebarForm";
import SelectPageViews from "./SelectPageViews";
import { Sidebar } from "@/types/Sidebar";
import { PageBlock } from "@/types/PageBlock";
import { FormikProps, FormikValues, useFormikContext } from "formik";

type EditPageFields = {
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
function EditPageFields(

) {
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

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
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
                                    setModalFooter(true, setBlocksModal);
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
                                    setModalFooter(true, setSidebarsModal);
                                    showModal(setSidebarsModal);
                                }}
                            >
                                Manage Sidebars
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
                                onChange={(blocks: Array<PageBlock>) => {
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
            </div>
        </div>
    );
}
export default EditPageFields;