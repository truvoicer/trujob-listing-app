import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnEdit, ReorderOnMove } from "@/components/Reorder/Reorder";
import { useContext } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import MenuItemForm from "./MenuItemForm";
import { CreateMenuItem, MenuItem, UpdateMenuItem } from "@/types/Menu";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";

export type ManageMenuItemsProps = {
    menuId?: number;
    data?: Array<MenuItem>;
    onChange?: (data: Array<MenuItem>) => void;
}
function ManageMenuItems({
    menuId,
    data = [],
    onChange
}: ManageMenuItemsProps) {
    const menuItems = data || [];

    const dataTableContext = useContext(DataTableContext);
    const notificationContext = useContext(AppNotificationContext);

    const menuItemSchema: CreateMenuItem = {
        type: ''
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
    function handleAddMenuItem({
        reorderData,
        onChange,
        itemSchema
    }: ReorderOnAdd) {
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
            showFooter: true
        }, 'menu-item-create-form');
    }

    async function handleMoveMenuItem({
        direction,
        reorderData,
        onChange,
        itemSchema,
        newIndex,
        index,
        item
    }: ReorderOnMove) {
        console.log('Move item', item, index, direction, newIndex);
        if (!['up', 'down'].includes(direction)) {
            return;
        }
        if (!menuId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Menu id not found
                    </p>
                ),
            }, 'menu-item-move-error');
            console.warn('Menu id not found', menuId);
            return false;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${item.id}/reorder`,
            method: TruJobApiMiddleware.METHOD.POST,
            protectedReq: true,
            data: {
                direction
            }
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Menu item moved successfully
                    </p>
                ),
            }, 'menu-item-move-success');
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Menu item move failed
                </p>
            ),
        }, 'menu-item-move-error');
        return false;

    }

    function handleEditMenuItem({
        reorderData,
        onChange,
        itemSchema,
        index,
        item
    }: ReorderOnEdit) {

    }

    async function handleDeleteMenuItem({
        item
    }: ReorderOnDelete) {

        if (!menuId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Menu item id not found
                    </p>
                ),
            }, 'menu-item-delete-error');
            console.warn('Menu id not found', menuId);
            return false;
        }

        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Menu item id not found
                    </p>
                ),
            }, 'menu-item-delete-error');
            console.warn('Menu item id not found', item);
            return false;
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${item.id}/delete`,
            method: TruJobApiMiddleware.METHOD.DELETE,
            protectedReq: true,
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Menu item deleted successfully
                    </p>
                ),
            }, 'menu-item-delete-success');
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Menu item delete failed
                </p>
            ),
        }, 'menu-item-delete-error');

        return false;
    }

    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={menuItemSchema}
                    itemHeader={(item, index) => `${item?.label} | url: ${item?.url} | type: ${item?.type}` || 'Item type error'}
                    data={menuItems || []}
                    onChange={handleChange}
                    onAdd={handleAddMenuItem}
                    onEdit={handleEditMenuItem}
                    onDelete={handleDeleteMenuItem}
                    onMove={handleMoveMenuItem}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <MenuItemForm
                            data={item}
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