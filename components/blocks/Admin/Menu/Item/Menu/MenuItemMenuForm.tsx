import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectMenu from "../../SelectMenu";
import { Menu, MenuItemMenu } from "@/types/Menu";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { FormikProps, FormikValues } from "formik";

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
            console.warn('No item found');
            return false;
        }
        if (typeof onMove !== 'function') {
            console.warn('No onMove function found');
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
            console.warn('No response from onMove function');
            return false;
        }
        initRequest();
        return true;
    }
    async function handleOk({ index, item, itemSchema, reorderData }: ReorderOnOk) {
        if (!item) {
            console.warn('No item found');
            return false;
        }
        if (typeof onOk !== 'function') {
            console.warn('No onOk function found');
            return false;
        }
        const response = await onOk(reorderData);
        if (!response) {
            console.warn('No response from onOk function');
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
                    console.warn('No form helpers found');
                    return false;
                }

                if (!formHelpers?.values?.menu) {
                    console.warn('No menu found');
                    return false;
                }
                if (typeof onAdd !== 'function') {
                    console.warn('No onAdd function found');
                    return false;
                }
                const response = await onAdd(
                    formHelpers?.values?.menu
                );
                if (!response) {
                    console.warn('No response from onAdd function');
                    return false;
                }
                initRequest();
                console.log('Successfully added menu');
                dataTableContext.modal.close('menu-select');
                return false;
            }
        }, 'menu-select');
    }

    async function handleDelete({ index, item, itemSchema, reorderData }: ReorderOnDelete) {
        if (!item) {
            console.warn('No item found');
            return false;
        }
        if (typeof onDelete !== 'function') {
            console.warn('No onDelete function found');
            return false;
        }
        const response = await onDelete(item);
        if (!response) {
            console.warn('No response from onDelete function');
            return false;
        }
        initRequest();
        return true
    }

    function handleChange(values: Array<Menu>) {
        setMenus(values);
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
        console.warn('No response from makeRequest');
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(menus);
        }
    }, [menus]);

    useEffect(() => {
        if (['create', 'add'].includes(operation || '')) {
            return;
        }
        initRequest();
    }, []);

    useEffect(() => {
        if (!['create', 'add'].includes(operation || '')) {
            return;
        }
        if (!data) {
            return;
        }
        if (!Array.isArray(data)) {
            console.warn('Sidebar widget data is not an array');
            return;
        }
        setMenus(data);
    }, []);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    modalState={dataTableContext.modal}
                    enableEdit={false}
                    itemSchema={menuSchema}
                    itemHeader={(item, index) => `${item?.menu?.name}` || 'Item type error'}
                    data={menus || []}
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