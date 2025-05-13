import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectMenu from "../../SelectMenu";
import { Menu, MenuItemMenu } from "@/types/Menu";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { FormikProps, FormikValues } from "formik";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type MenuItemMenuFormProps = {
    operation: 'edit' | 'update' | 'add' | 'create';
    data?: Array<MenuItemMenu>;
    onMove?: ({
        index,
        item,
        itemSchema,
        reorderData,
        direction
    }: ReorderOnMove) => Promise<boolean>;
    onOk?: (data: Array<MenuItemMenu>) => void;
    onChange: (data: Array<MenuItemMenu>) => void;
    onAdd?: (data: MenuItemMenu) => Promise<boolean>;
    makeRequest?: () => Promise<Array<MenuItemMenu>> | null;
    onDelete?: (data: MenuItemMenu) => Promise<boolean>;
}
function MenuItemMenuForm({
    operation,
    data = [],
    onChange,
    onDelete,
    onAdd,
    onMove,
    onOk,
    makeRequest
}: MenuItemMenuFormProps) {

    const [menus, setMenus] = useState<Array<Menu>>([]);

    const dataTableContext = useContext(DataTableContext);
    const notificationContext = useContext(AppNotificationContext);

    const menuSchema: MenuItemMenu = {
        id: 0,
        active: false,
        order: 0,
    };

    async function handleMove({
        direction,
        item,
        itemSchema,
        index,
        reorderData,
        onChange,
        newIndex
    }: ReorderOnMove) {
        if (!item) {
            DebugHelpers.log(DebugHelpers.WARN, 'No item found');
            return false;
        }
        if (typeof onMove !== 'function') {
            DebugHelpers.log(DebugHelpers.WARN, 'No onMove function found');
            return false;
        }
        const response = await onMove({
            direction,
            item,
            itemSchema,
            index,
            reorderData,
            onChange,
            newIndex
        });
        if (!response) {
            DebugHelpers.log(DebugHelpers.WARN, 'No response from onMove function');
            return false;
        }
        initRequest();
        return true;
    }
    async function handleOk({ index, item, itemSchema, reorderData }: ReorderOnOk) {
        if (!item) {
            DebugHelpers.log(DebugHelpers.WARN, 'No item found');
            return false;
        }
        if (typeof onOk !== 'function') {
            DebugHelpers.log(DebugHelpers.WARN, 'No onOk function found');
            return false;
        }
        const response = await onOk(reorderData);
        if (!response) {
            DebugHelpers.log(DebugHelpers.WARN, 'No response from onOk function');
            return false;
        }
        initRequest();
        return true;
    }
    function handleAdd() {
        dataTableContext.modal.show({
            component: (
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <SelectMenu

                        />
                    </div>
                </div>
            ),
            formProps: { menu: null },
            showFooter: true,
            onOk: async ({ formHelpers }: {
                formHelpers: FormikProps<FormikValues>;
            }) => {
                if (!formHelpers) {
                    DebugHelpers.log(DebugHelpers.WARN, 'No form helpers found');
                    return false;
                }

                if (!formHelpers?.values?.menu) {
                    DebugHelpers.log(DebugHelpers.WARN, 'No menu found');
                    return false;
                }
                if (typeof onAdd !== 'function') {
                    DebugHelpers.log(DebugHelpers.WARN, 'No onAdd function found');
                    return false;
                }
                const response = await onAdd(
                    formHelpers?.values?.menu
                );
                if (!response) {
                    DebugHelpers.log(DebugHelpers.WARN, 'No response from onAdd function');
                    return false;
                }
                initRequest();
                DebugHelpers.log(DebugHelpers.DEBUG, 'Successfully added menu');
                dataTableContext.modal.close('menu-select');
                return false;
            }
        }, 'menu-select');
    }

    async function handleDelete({ index, item, itemSchema, reorderData }: ReorderOnDelete) {
        if (!item) {
            DebugHelpers.log(DebugHelpers.WARN, 'No item found');
            return false;
        }
        if (typeof onDelete !== 'function') {
            DebugHelpers.log(DebugHelpers.WARN, 'No onDelete function found');
            return false;
        }
        const response = await onDelete(item);
        if (!response) {
            DebugHelpers.log(DebugHelpers.WARN, 'No response from onDelete function');
            return false;
        }
        initRequest();
        return true
    }

    function handleChange(values: Array<Menu>) {
        if (typeof onChange === 'function') {
            onChange(values);
        }
    }
    async function initRequest() {
        if (typeof makeRequest !== 'function') {
            return;
        }
        const response = await makeRequest()
        if (Array.isArray(response)) {
            setMenus(response);
            return;
        }
        DebugHelpers.log(DebugHelpers.WARN, 'No response from makeRequest');
    }

    useEffect(() => {
        if (['create', 'add'].includes(operation || '')) {
            return;
        }
        initRequest();
    }, []);

    function getMenus() {
        if (['create', 'add'].includes(operation || '')) {
            return Array.isArray(data)? data : [];
        } 
        if (['edit', 'update'].includes(operation || '')) {
            return menus || [];
        }
        return [];
    }
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    modalState={dataTableContext.modal}
                    enableEdit={false}
                    itemSchema={menuSchema}
                    itemHeader={(item, index) => {
                        DebugHelpers.log(DebugHelpers.DEBUG, 'item', item);
                        if (['create', 'add'].includes(operation || '')) {
                            return `${item?.name}` || 'Item type error'
                        } else if (['edit', 'update'].includes(operation || '')) {
                            return `${item?.menu?.name}` || 'Item type error'
                        }
                        return `Item name error | ${operation}`;
                    }}
                    data={getMenus()}
                    onChange={handleChange}
                    onAdd={handleAdd}
                    onMove={handleMove}
                    onDelete={handleDelete}
                    onOk={handleOk}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <>

                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default MenuItemMenuForm;