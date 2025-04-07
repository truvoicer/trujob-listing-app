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

function PageBlockForm({ data = null, onChange = null }) {
    const [blocks, setBlocks] = useState(data || []);

    const appModalContext = useContext(AppModalContext);
    const formContext = useContext(FormContext);

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
        const newData = [...blocks];
        // if (!newData?.[index]) {
        //     newData[index] = { ...pageBlockSchema };
        // }
        console.log('newData', index, field, value);
        newData[index][field] = value;
        setBlocks(newData);
    }
    function handleChange(values) {
        setBlocks(values);
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(blocks);
        }
    }, [blocks]);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={pageBlockSchema}
                    itemHeader={(item, index) => {
                        console.log('item', item);
                        return item?.type || 'Item type error'}
                    }
                    data={blocks || []}
                    onChange={handleChange}
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
                            <SelectPaginationTypes 
                                onChange={(paginationType) => {
                                    updateFieldValue(index, 'pagination_type', paginationType);
                                }}
                                showSubmitButton={false}
                            />
                            <SelectPaginationScrollTypes
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
                                    type="button"
                                    className="btn btn-primary mr-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        appModalContext.show({
                                            title: "Manage Sidebars",
                                            component: (
                                                <SidebarForm
                                                    data={block?.sidebars || []}
                                                    onChange={(sidebars) => {
                                                        console.log('sidebars', sidebars);
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