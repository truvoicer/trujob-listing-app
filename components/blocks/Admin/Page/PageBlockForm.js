import { FormContext } from "@/components/form/contexts/FormContext";
import Form from "@/components/form/Form";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

function PageBlockForm({ data }) {
    const appModalContext = useContext(AppModalContext);
    const formContext = useContext(FormContext);
    async function pageBlockRequest() {
        const response = await TruJobApiMiddleware.getInstance().pageBlocksRequest(data?.id);
        if (!response) {
            return;
        }
        formContext.setFieldValue('blocks', response?.data || []);
    }
    function handleChange(e) {
    }
    useEffect(() => {
        if (!data?.id) {
            return;
        }
        pageBlockRequest()

    }, [data?.id]);

    // 'title' => $this->title,
    // 'subtitle' => $this->subtitle,
    // 'background_image' => $this->background_image,
    // 'background_color' => $this->background_color,
    // 'pagination_type' => $this->pagination_type,
    // 'pagination' => (bool)$this->pagination,
    // 'pagination_scroll_type' => $this->pagination_scroll_type,
    // 'content' => $this->content,
    // 'properties' => $this->properties,
    // 'has_sidebar' => (bool)$this->has_sidebar,
    // 'sidebar_widgets' => $this->sidebar_widgets,
    // 'order' => $this->order,
    // 'roles'  
    return (
        <div className="row">
            <div className="col-12 col-lg-6">
                {Array.isArray(formContext?.values?.blocks) && (
                    <Accordion>
                        {formContext?.values?.blocks?.map((block, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>{block?.type || 'Block error'}</Accordion.Header>
                                <Accordion.Body>
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="title"
                                            id={"title" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.title || ""} />
                                        <label className="form-label" htmlFor={'title' + index}>Title</label>
                                    </div>
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="subtitle"
                                            id={"subtitle" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.subtitle || ""} />
                                        <label className="form-label" htmlFor={'subtitle' + index}>Subtitle</label>
                                    </div>
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="background_image"
                                            id={"background_image" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.background_image || ""} />
                                        <label className="form-label" htmlFor={'background_image' + index}>Background Image</label>
                                    </div>
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="background_color"
                                            id={"background_color" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.background_color || ""} />
                                        <label className="form-label" htmlFor={'background_color' + index}>Background Color</label>
                                    </div>
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="pagination_type"
                                            id={"pagination_type" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.pagination_type || ""} />
                                        <label className="form-label" htmlFor={'pagination_type' + index}>Pagination Type</label>
                                    </div>
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="pagination"
                                            id={"pagination" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.pagination || ""} />
                                        <label className="form-label" htmlFor={'pagination' + index}>Pagination</label>
                                    </div>
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="pagination_scroll_type"
                                            id={"pagination_scroll_type" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.pagination_scroll_type || ""} />
                                        <label className="form-label" htmlFor={'pagination_scroll_type' + index}>Pagination Scroll Type</label>
                                    </div>
                                    <div className="floating-input form-group">
                                        <textarea
                                            className="form-control"
                                            name="content"
                                            id={"content" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.content || ""}></textarea>
                                        <label className="form-label" htmlFor={'content' + index}>Content</label>
                                    </div>
                                    {/* <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="properties"
                                            id={"properties" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.properties || ""} />
                                        <label className="form-label" htmlFor={'properties' + index}>Properties</label>
                                    </div> */}
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="has_sidebar"
                                            id={"has_sidebar" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.has_sidebar || ""} />
                                        <label className="form-label" htmlFor={'has_sidebar' + index}>Has Sidebar</label>
                                    </div>
                                    {/* <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="sidebar_widgets"
                                            id={"sidebar_widgets" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.sidebar_widgets || ""} />
                                        <label className="form-label" htmlFor={'sidebar_widgets' + index}>Sidebar Widgets</label>
                                    </div> */}
                                    <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="order"
                                            id={"order" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.order || ""} />
                                        <label className="form-label" htmlFor={'order' + index}>Order</label>
                                    </div>
                                    {/* <div className="floating-input form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="roles"
                                            id={"roles" + index}
                                            required=""
                                            onChange={handleChange}
                                            value={block?.roles || ""} />
                                        <label className="form-label" htmlFor={'roles' + index}>Roles</label>
                                    </div> */}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
}
export default PageBlockForm;