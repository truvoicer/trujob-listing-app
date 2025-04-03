import { FormContext } from "@/components/form/contexts/FormContext";
import Form from "@/components/form/Form";
import Reorder from "@/components/Reorder/Reorder";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import SelectBlock from "./SelectBlock";

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
    function renderSideBarWidgets(block) {
        return (
            <Reorder
                itemSchema={pageBlockSchema}
                itemHeader={(item, index) => item?.type || 'Item type error'}
                data={block?.sidebar_widgets || []}
                onChange={async (values) => {
                    // updateFieldValue(index, 'sidebar_widgets', values);
                }}
            >
                {({
                    block,
                    index,
                }) => (
                    <>

                    </>
                )}
            </Reorder>
        );
    }
    useEffect(() => {
        if (!data?.id) {
            return;
        }
        pageBlockRequest()

    }, [data?.id]);

    const pageBlockSchema = {
        'title': '',
        'subtitle': '',
        'background_image': '',
        'background_color': '',
        'pagination_type': '',
        'pagination': false,
        'pagination_scroll_type': '',
        'properties': [],
        'content': '',
        'has_sidebar': false,
        'sidebar_widgets': [],
        'order': 0,
    };
    function updateFieldValue(index, field, value) {
        const newData = [...formContext?.values?.blocks];
        newData[index][field] = value;
        formContext.setFieldValue('blocks', newData);
    }
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={pageBlockSchema}
                    itemHeader={(item, index) => item?.type || 'Item type error'}
                    data={formContext?.values?.blocks || []}
                    onChange={async (values) => {
                        formContext.setFieldValue('blocks', values);
                    }}
                    onAdd={({
                        reorderData,
                        setReorderData,
                        itemSchema
                    }) => {
                        appModalContext.show({
                            component: (
                                <div className="row">
                                    <div className="col-12 col-lg-12">
                                        <SelectBlock
                                            pageId={data?.id}
                                            onSubmit={selectedBlock => {
                                                console.log('selectedBlock', selectedBlock);
                                                const newData = [...reorderData];
                                                newData.push({ ...pageBlockSchema, ...selectedBlock });
                                                setReorderData(newData);
                                                appModalContext.close('page-edit-block-select');
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'page-edit-block-select');
                    }}
                >
                    {({
                        block,
                        index,
                    }) => (
                        <>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    id={"title" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'title', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'title', e.target.value);
                                    }}
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
                                    onChange={e => {
                                        updateFieldValue(index, 'subtitle', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'subtitle', e.target.value);
                                    }}
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
                                    onChange={e => {
                                        updateFieldValue(index, 'background_image', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'background_image', e.target.value);
                                    }}
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
                                    onChange={e => {
                                        updateFieldValue(index, 'background_color', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'background_color', e.target.value);
                                    }}
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
                                    onChange={e => {
                                        updateFieldValue(index, 'pagination_type', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'pagination_type', e.target.value);
                                    }}
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
                                    onChange={e => {
                                        updateFieldValue(index, 'pagination', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'pagination', e.target.value);
                                    }}
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
                                    onChange={e => {
                                        updateFieldValue(index, 'pagination_scroll_type', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'pagination_scroll_type', e.target.value);
                                    }}
                                    value={block?.pagination_scroll_type || ""} />
                                <label className="form-label" htmlFor={'pagination_scroll_type' + index}>Pagination Scroll Type</label>
                            </div>
                            <div className="floating-input form-group">
                                <textarea
                                    className="form-control"
                                    name="content"
                                    id={"content" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'content', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'content', e.target.value);
                                    }}
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
                                    onChange={e => {
                                        updateFieldValue(index, 'has_sidebar', e.target.checked);
                                    }}
                                    value={block?.has_sidebar || ""} />
                                <label className="form-label" htmlFor={'has_sidebar' + index}>Has Sidebar</label>
                            </div>
                            <div className="floating-input form-group">
                                <button
                                    className="btn btn-primary"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        appModalContext.show({
                                            component: (
                                                <div className="row">
                                                    <div className="col-12 col-lg-12">
                                                        {renderSideBarWidgets(block)}
                                                    </div>
                                                </div>
                                            ),
                                            showFooter: false
                                        }, 'page-edit-block-sidebar-widgets');
                                    }}
                                >
                                    Manage Sidebar Widgets
                                </button>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="order"
                                    id={"order" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'order', e.target.value);
                                    }}
                                    onBlur={e => {
                                        updateFieldValue(index, 'order', e.target.value);
                                    }}
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
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default PageBlockForm;