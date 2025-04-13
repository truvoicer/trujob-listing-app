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
import SelectRole from "./SelectRole";

function RoleForm({ data = null, onChange = null }) {

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
                            <SelectRole
                                value={block?.pagination_type}
                                onChange={(paginationType) => {
                                    updateFieldValue(index, 'pagination_type', paginationType);
                                }}
                                showSubmitButton={false}
                            />
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default RoleForm;