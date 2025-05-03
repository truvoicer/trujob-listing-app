import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import SelectSidebar from "./SelectSidebar";
import SidebarWidgetForm from "../Sidebar/Widget/SidebarWidgetForm";
import { DataTableContext } from "@/contexts/DataTableContext";
import { Sidebar } from "@/types/Sidebar";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";

export const sidebarSchema = {
    'title': '',
    'name': '',
    'icon': '',
};

export type SidebarFormOnAdd = {
    reorderData: Array<Sidebar>;
    onChange: (data: Array<Sidebar>) => void;
    sidebars: Array<Sidebar>;
    setSidebars: React.Dispatch<React.SetStateAction<Array<Sidebar>>>;
    sidebarsRequest?: () => Promise<void>;
}
export type SidebarFormMakeRequest = {
    sidebars: Array<Sidebar>;
    setSidebars: React.Dispatch<React.SetStateAction<Array<Sidebar>>>;
}

export type SidebarFormOnDelete = {
    item: Sidebar;
    sidebars: Array<Sidebar>;
    setSidebars: React.Dispatch<React.SetStateAction<Array<Sidebar>>>;
    sidebarsRequest?: () => Promise<void>;
}
export type SidebarFormOnMove = {
    direction: 'up' | 'down';
    reorderData: Array<Sidebar>;
    onChange: (data: Array<Sidebar>) => void;
    itemSchema: Sidebar;
    newIndex: number;
    index: number;
    item: Sidebar;
    sidebars: Array<Sidebar>;
    setSidebars: React.Dispatch<React.SetStateAction<Array<Sidebar>>>;
    sidebarsRequest?: () => Promise<void>;
}
export type SidebarFormOnOk = {
    formHelpers: FormikProps<FormikValues>;
    sidebars: Array<Sidebar>;
    setSidebars: React.Dispatch<React.SetStateAction<Array<Sidebar>>>;
    sidebarsRequest?: () => Promise<void>;
}
export type SidebarFormProps = {
    data?: Array<Sidebar>;
    onChange: (data: Array<Sidebar>) => void;
    onAdd?: ({
        reorderData,
        onChange,
        sidebars,
        setSidebars,
        sidebarsRequest
    }: SidebarFormOnAdd) => Promise<boolean>;
    makeRequest?: ({
        sidebars,
        setSidebars
    }: SidebarFormMakeRequest) => Promise<boolean>;
    onDelete?: ({
        item,
        sidebars,
        setSidebars,
        sidebarsRequest
    }: SidebarFormOnDelete) => Promise<boolean>;
    onMove?: ({
        direction,
        reorderData,
        onChange,
        itemSchema,
        newIndex,
        index,
        item,
        sidebars,
        setSidebars,
        sidebarsRequest
    }: SidebarFormOnMove) => Promise<boolean>;
    onOk?: ({
        formHelpers,
        sidebars,
        setSidebars,
        sidebarsRequest
    }: SidebarFormOnOk) => Promise<boolean>;
    operation: 'edit' | 'update' | 'add' | 'create';
}

function SidebarForm({ 
    operation,
    data = [], 
    onChange,
    onDelete,
    onMove,
    onAdd,
    onOk,
    makeRequest
 }: SidebarFormProps) {
    const [sidebars, setSidebars] = useState(data || []);

    const dataTableContext = useContext(DataTableContext);

    
    function handleChange(values: Array<Sidebar>) {
        setSidebars(values);
    }

    async function handleAddSidebar({
        reorderData,
        onChange,
    }: ReorderOnAdd) {
        if (typeof onAdd === 'function') {
            return await onAdd({
                reorderData,
                onChange,
                sidebars,
                setSidebars,
                sidebarsRequest: sidebarsRequest
            });
        }
        console.warn('onAdd is not a function');
        return false;
    }

    async function handleMoveSidebar({
        direction,
        reorderData,
        onChange,
        itemSchema,
        newIndex,
        index,
        item
    }: ReorderOnMove) {
        if (typeof onMove === 'function') {
            return await onMove({
                direction,
                reorderData,
                onChange,
                itemSchema,
                newIndex,
                index,
                item,
                sidebars,
                setSidebars,
                sidebarsRequest: sidebarsRequest
            });
        }
        console.warn('onMove is not a function');
        return false;
    }

    async function handleDeleteSidebar({
        item
    }: ReorderOnDelete) {
        if (typeof onDelete === 'function') {
            return await onDelete({
                item,
                sidebars,
                setSidebars,
                sidebarsRequest: sidebarsRequest
            });
        }
        console.warn('onDelete is not a function');
        return false;
    }

    async function handleOk({
        formHelpers
    }: ReorderOnOk) {
        if (typeof onOk === 'function') {
            return await onOk({
                formHelpers,
                sidebars,
                setSidebars,
                sidebarsRequest: sidebarsRequest
            });
        }
        console.warn('onOk is not a function');
        return false;
    }

    async function sidebarsRequest() {
        if (typeof makeRequest === 'function') {
            const response = await makeRequest({
                sidebars,
                setSidebars
            });
            if (!Array.isArray(response)) {
                console.warn('sidebar data is not an array');
                return;
            }
            setSidebars(response);
            return;
        }
        console.warn('makeRequest is not a function');
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(sidebars);
        }
    }, [sidebars]);

    useEffect(() => {
        if (['create', 'add'].includes(operation || '')) {
            if (!data) {
                return;
            }
            if (!Array.isArray(data)) {
                console.warn('sidebar data is not an array');
                return;
            }
            setSidebars(data);
        } else if (['edit', 'update'].includes(operation || '')) {
            sidebarsRequest();
        }
    }, []);
    console.log('sidebar form', operation, sidebars);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={sidebarSchema}
                    itemHeader={(item, index) => `${item?.title} (${item?.name})` || 'Item type error'}
                    data={sidebars || []}
                    onChange={handleChange}
                    onAdd={handleAddSidebar}
                    onOk={handleOk}
                    onMove={handleMoveSidebar}
                    onDelete={handleDeleteSidebar}
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
                                                    operation={operation}
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