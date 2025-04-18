import Reorder from "@/components/Reorder/Reorder";
import { useContext } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import MenuItemForm from "./MenuItemForm";
import { CreateMenuItem, MenuItem, UpdateMenuItem } from "@/types/Menu";

export type ManageMenuItemsProps = {
    data?: Array<MenuItem>;
    onChange?: (data: Array<MenuItem>) => void;
}
function ManageMenuItems({ 
    data = [], 
    onChange 
}: ManageMenuItemsProps) {
    const menuItems = data || [];

    const dataTableContext = useContext(DataTableContext);

    const menuItemSchema: CreateMenuItem = {
        active: false,
        label: '',
        type: '',
        url: '',
        target: '',
        order: 0,
        icon: '',
        li_class: '',
        a_class: '',
        page: null,
        roles: [],
        menus: [],
    };
    function updateFieldValue(index: number, field: string, value: string | number | boolean) {
        const newData: Array<MenuItem> = [...menuItems];
        newData[index][field] = value;
        if (typeof onChange !== 'function') {
            return;
        }
        onChange(newData);
    }
    function handleChange(values: Array<MenuItem>) {
        if (typeof onChange !== 'function') {
            return;
        }
        onChange(values);
    }
    
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={menuItemSchema}
                    itemHeader={(item, index) => `${item?.label} | url: ${item?.url} | type: ${item?.type}` || 'Item type error'}
                    data={menuItems || []}
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
                                        <MenuItemForm
                                            onSubmit={selectedMenu => {
                                                const newData = [...reorderData];
                                                newData.push({ ...menuItemSchema, ...selectedMenu });
                                                onChange(newData);
                                                dataTableContext.modal.close('menu-item-create-form');
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'menu-item-create-form');
                    }}
                >
                    {({
                        block,
                        index,
                    }) => (
                        <MenuItemForm
                            data={block}
                            onChange={(key, value) => {
                                updateFieldValue(index, key, value);
                            }}
                        />
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default ManageMenuItems;