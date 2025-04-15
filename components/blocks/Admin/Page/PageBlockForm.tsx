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
import SidebarForm from "./SidebarForm";
import SelectPaginationTypes from "./SelectPaginationType";
import SelectPaginationScrollTypes from "./SelectPaginationScrollType";
import { DataTableContext } from "@/contexts/DataTableContext";

function PageBlockForm({ data = null, onChange = null }) {

    const dataTableContext = useContext(DataTableContext);

    // async function pageBlockRequest() {
    //     const response = await TruJobApiMiddleware.getInstance().pageBlocksRequest(data?.id);
    //     if (!response) {
    //         return;
    //     }
    //     formContext.setFieldValue('blocks', response?.data || []);
    // }

    function renderSideBarWidgets(block) {
        return (
            <Reorder
                itemSchema={pageBlockSchema}
                itemHeader={(item, index) => item?.title || 'Item title error'}
                data={block?.sidebars || []}
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

    const pageBlockSchema = {
        'default': false,
        'nav_title': '',
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
        const newData = [...data];
        if (!newData?.[index]) {
            return;
        }
        newData[index][field] = value;
        onChange(newData);
    }
    function handleChange(values) {
        onChange(values);
    }

    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={pageBlockSchema}
                    itemHeader={(item, index) => {
                        return item?.type || 'Item type error'
                    }
                    }
                    data={data || []}
                    onChange={handleChange}
                    onAdd={({
                        reorderData,
                        onChange,
                        itemSchema
                    }) => {
                        dataTableContext.modal.show({
                            component: (
                                <div className="row">
                                    <div className="col-12 col-lg-12">
                                        <SelectBlock
                                            pageId={data?.id}
                                            onSubmit={selectedBlock => {
                                                const newData = [...reorderData];
                                                newData.push({ ...pageBlockSchema, ...selectedBlock });
                                                onChange(newData);
                                                dataTableContext.modal.close('page-edit-block-select');
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
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="default"
                                    id={"default" + index}
                                    checked={block?.default || false}
                                    onChange={e => {
                                        updateFieldValue(index, 'default', e.target.checked);
                                    }}
                                />
                                <label className="custom-control-label" htmlFor={'default' + index}>
                                    Default?
                                </label>
                            </div>
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="nav_title"
                                    id={"nav_title" + index}
                                    required=""
                                    onChange={e => {
                                        updateFieldValue(index, 'nav_title', e.target.value);
                                    }}
                                    value={block?.nav_title || ""} />
                                <label className="form-label" htmlFor={'nav_title' + index}>Nav Title</label>
                            </div>
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
                                    value={block?.background_color || ""} />
                                <label className="form-label" htmlFor={'background_color' + index}>Background Color</label>
                            </div>
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="pagination"
                                    id={"pagination" + index}
                                    checked={block?.pagination || false}
                                    onChange={e => {
                                        updateFieldValue(index, 'pagination', e.target.checked);
                                    }}
                                />
                                <label className="custom-control-label" htmlFor={'pagination' + index}>
                                    Pagination
                                </label>
                            </div>
                            <SelectPaginationTypes
                                value={block?.pagination_type}
                                onChange={(paginationType) => {
                                    updateFieldValue(index, 'pagination_type', paginationType);
                                }}
                                showSubmitButton={false}
                            />
                            <SelectPaginationScrollTypes
                                value={block?.pagination_scroll_type}
                                onChange={(paginationScrollType) => {
                                    updateFieldValue(index, 'pagination_scroll_type', paginationScrollType);
                                }}
                                showSubmitButton={false}
                            />
                            <div className="floating-input form-group">
                                <textarea
                                    className="form-control"
                                    name="content"
                                    id={"content" + index}
                                    required=""
                                    onChange={e => {
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
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    name="has_sidebar"
                                    id={"has_sidebar" + index}
                                    checked={block?.has_sidebar || false}
                                    onChange={e => {
                                        updateFieldValue(index, 'has_sidebar', e.target.checked);
                                    }}
                                />
                                <label className="custom-control-label" htmlFor={'has_sidebar' + index}>
                                    Has Sidebar
                                </label>
                            </div>
                            <div className="floating-input form-group">
                                <button
                                    type="button"
                                    className="btn btn-primary mr-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        dataTableContext.modal.show({
                                            title: "Manage Sidebars",
                                            component: (
                                                <SidebarForm
                                                    data={block?.sidebars || []}
                                                    onChange={(sidebars) => {
                                                        updateFieldValue(index, 'sidebars', sidebars);
                                                    }}
                                                />
                                            ),
                                            showFooter: false
                                        }, 'page-edit-block-sidebar-widgets');
                                    }}
                                >
                                    Manage Sidebars
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