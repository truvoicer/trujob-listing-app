import Reorder from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import SelectSidebar from "./SelectSidebar";
import SidebarWidgetForm from "../Sidebar/Widget/SidebarWidgetForm";
import { DataTableContext } from "@/contexts/DataTableContext";
import { Sidebar } from "@/types/Sidebar";

type SidebarFormProps = {
    data?: Array<Sidebar>;
    onChange?: (data: Array<any>) => void;
}

function SidebarForm({ data, onChange }: SidebarFormProps) {
    const [sidebars, setSidebars] = useState(data || []);

    const dataTableContext = useContext(DataTableContext);

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
    function updateFieldValue(index: number, field: string, value: string | number) {
        const newData: Array<Sidebar> = [...sidebars];
        newData[index][field] = value;
        setSidebars(newData);
    }
    function handleChange(values: Array<Sidebar>) {
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
                        item,
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
                                                <SidebarWidgetForm
                                                
                                                    sidebarId={item?.id}
                                                    data={item?.widgets || []}
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