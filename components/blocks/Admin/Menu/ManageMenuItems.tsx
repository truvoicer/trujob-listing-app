import Reorder from "@/components/Reorder/Reorder";
import { useContext } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import MenuItemForm from "./MenuItemForm";

function ManageMenuItems({ data = null, onChange = null }) {
    const menuItems = data || [];

    const dataTableContext = useContext(DataTableContext);

    const menuItemSchema = {
        active: data?.active || false,
        label: data?.label || '',
        type: data?.type || '',
        url: data?.url || '',
        target: data?.target || '',
        order: data?.order || '',
        icon: data?.icon || '',
        li_class: data?.li_class || '',
        a_class: data?.a_class || '',
        page: data?.page || null,
        roles: data?.roles || [],
        menus: data?.menus || [],
    };
    function updateFieldValue(index, field, value) {
        const newData = [...menuItems];
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