import { FormContext } from "@/components/form/contexts/FormContext";
import Form from "@/components/form/Form";
import Reorder from "@/components/Reorder/Reorder";
import DataTable from "@/components/Table/DataTable";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import SelectSidebar from "./SelectSidebar";
import WidgetForm from "./WidgetForm";
import { DataTableContext, dataTableContextData } from "@/contexts/DataTableContext";

function SidebarForm({ data = null, onChange = null }) {
    const [sidebars, setSidebars] = useState(data || []);

    const dataTableContext = useContext(DataTableContext);
    const formContext = useContext(FormContext);

    // async function pageSidebarRequest() {
    //     const response = await TruJobApiMiddleware.getInstance().pageSidebarsRequest(data?.id);
    //     if (!response) {
    //         return;
    //     }
    //     formContext.setFieldValue('sidebars', response?.data || []);
    // }

    const pageSidebarSchema = {
        'title': '',
        'name': '',
        'icon': '',
    };
    function updateFieldValue(index, field, value) {
        const newData = [...sidebars];
        newData[index][field] = value;
        setSidebars(newData);
    }
    function handleChange(values) {
        setSidebars(values);
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(sidebars);
        }
    }, [sidebars]);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={pageSidebarSchema}
                    itemHeader={(item, index) => `${item?.title} (${item?.name})` || 'Item type error'}
                    data={sidebars || []}
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
                                        <SelectSidebar
                                            sidebarId={data?.id}
                                            onSubmit={selectedSidebar => {
                                                console.log('selectedSidebar', selectedSidebar);
                                                const newData = [...reorderData];
                                                newData.push({ ...pageSidebarSchema, ...selectedSidebar });
                                                onChange(newData);
                                                dataTableContext.modal.close('page-edit-sidebar-select');
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'page-edit-sidebar-select');
                    }}
                >
                    {({
                        sidebar,
                        index,
                    }) => (
                        <>
                            
                            <div className="floating-input form-group">
                                <button
                                    className="btn btn-primary"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        dataTableContext.modal.show({
                                            component: (
                                                <WidgetForm
                                                    data={sidebar?.widgets || []}
                                                />
                                            ),
                                            showFooter: false
                                        }, 'page-edit-block-sidebar-widgets');
                                    }}
                                >
                                    Manage Widgets
                                </button>
                            </div>
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default SidebarForm;