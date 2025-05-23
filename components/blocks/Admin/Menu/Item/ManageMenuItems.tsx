import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnEdit, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import { CreateMenuItem, MenuItem, UpdateMenuItem } from "@/types/Menu";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { FormikProps, FormikValues } from "formik";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import EditMenuItem from "./EditMenuItem";


export type ManageMenuItemsProps = {
    menuId?: number;
    data?: Array<MenuItem>;
    onChange?: (data: Array<MenuItem>) => void;
    operation: 'add' | 'create' | 'edit' | 'update';
}
function ManageMenuItems({
    operation,
    menuId,
    data = [],
    onChange
}: ManageMenuItemsProps) {
    const [menuItems, setMenuItems] = useState<Array<MenuItem>>([]);

    const dataTableContext = useContext(DataTableContext);
    const notificationContext = useContext(AppNotificationContext);
    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const menuItemSchema: CreateMenuItem = {
        type: '',
    };

    function handleChange(values: Array<MenuItem>) {
        setMenuItems(values);
    }

    function validateMenuId(): boolean {
        if (!menuId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Page id not found
                    </p>
                ),
            }, 'page-block-form-validate-page-id-error');
            console.log('Page id not found', menuId);
            return false;
        }
        return true;
    }

    function handleAddMenuItem({
        reorderData,
        onChange,
    }: ReorderOnAdd) {
        dataTableContext.modal.show({
            component: (
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <EditMenuItem
                            data={menuItemSchema}
                            menuId={menuId}
                            operation={'add'}
                            inModal={true}
                            modalId={'menuItem-form-select-menuItem'}
                        />
                    </div>
                </div>
            ),
            showFooter: true,
            formProps: {
                operation: 'add',
                initialValues: menuItemSchema,
            },
            onOk: async ({ formHelpers }: {
                formHelpers: FormikProps<CreateMenuItem>;
            }) => {
                const selectedMenuItem = formHelpers?.values;
                if (!selectedMenuItem) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                MenuItem not found
                            </p>
                        ),
                    }, 'menuItem-form-select-menuItem-error');
                    console.log('MenuItem not found', selectedMenuItem);
                    return false;
                }

                let saveData = {
                    ...menuItemSchema,
                    ...formHelpers.values
                };
                if (['add', 'create'].includes(operation || '')) {
                    console.log('menuItem add', {
                        ...menuItemSchema,
                        ...formHelpers.values
                    });
                    setMenuItems(
                        [
                            ...menuItems,
                            saveData
                        ]
                    );
                    return true;
                }

                if (!validateMenuId() || !menuId) {
                    return false;
                }
                if (selectedMenuItem?.page && selectedMenuItem?.page &&selectedMenuItem?.page?.id) {
                    saveData.page_id = selectedMenuItem.page.id;
                    delete saveData.page;
                }
                if (Array.isArray(selectedMenuItem?.roles)) {
                    saveData.roles = RequestHelpers.extractIdsFromArray(selectedMenuItem.roles);
                }
                const response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/create`,
                    method: TruJobApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: saveData
                });
                if (!response) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Menu item add failed
                            </p>
                        ),
                    }, 'sidebar-menuItem-add-error');
                    console.log('menuItem add failed', response);
                    return false;
                }
                notificationContext.show({
                    variant: 'success',
                    title: 'Success',
                    component: (
                        <p>
                            menuItem added successfully
                        </p>
                    ),
                }, 'sidebar-menuItem-add-success');
                menuItemsRequest();
                dataTableContext.modal.close('menuItem-form-select-menuItem');
                return true;
            }
        }, 'menuItem-form-select-menuItem');
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
        if (!['up', 'down'].includes(direction)) {
            return false;
        }

        if (['add', 'create'].includes(operation || '')) {
            return true;
        }
        if (!validateMenuId() || !menuId) {
            return;
        }
        const response = await truJobApiMiddleware.resourceRequest({
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

    async function handleDeleteMenuItem({
        item,
    }: ReorderOnDelete) {

        if (['add', 'create'].includes(operation || '')) {
            setMenuItems(
                menuItems.filter((menuItem: MenuItem) => {
                    return menuItem.id !== item.id;
                })
            );
            return true;
        }
        if (!validateMenuId() || !menuId) {
            return;
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
            console.log('Menu item id not found', item);
            return false;
        }

        const response = await truJobApiMiddleware.resourceRequest({
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

    async function handleOk({
        formHelpers
    }: ReorderOnOk) {
        if (!formHelpers) {
            return;
        }
        console.log('formHelpers', formHelpers.values);
        const item = { ...formHelpers.values };
        if (['add', 'create'].includes(operation || '')) {
            if (item.hasOwnProperty('index')) {
                setMenuItems(prevState => {
                    let newState = [...prevState];
                    if (newState?.[item.index]) {
                        newState[item.index] = item;
                    }
                    return newState;
                });
            } else {
                setMenuItems([...menuItems, item]);
            }
            return true;
        }

        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        menuItem id not found
                    </p>
                ),
            }, 'sidebar-menuItem-update-error');
            console.log('menuItem id not found', item);
            return false;
        }
        if (item.hasOwnProperty('page') && item.page && item.page?.id) {
            item.page_id = item.page.id;
            delete item.page;
        }
        if (Array.isArray(item?.roles)) {
            item.roles = RequestHelpers.extractIdsFromArray(item.roles);
        }
        if (Array.isArray(item?.menus)) {
            item.menus = RequestHelpers.extractIdsFromArray(item.menus);
        }
        if (!validateMenuId() || !menuId) {
            return;
        }
        const response = await truJobApiMiddleware.resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${item.id}/update`,
            method: TruJobApiMiddleware.METHOD.PATCH,
            protectedReq: true,
            data: item
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        menuItem updated successfully
                    </p>
                ),
            }, 'sidebar-menuItem-update-success');
            menuItemsRequest();
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <div>
                    <strong>Error:</strong>
                    {truJobApiMiddleware.getErrors().map((error: ErrorItem, index: number) => {
                        return (
                            <div key={index}>{error.message}</div>
                        )
                    })}
                </div>
            ),
        }, 'sidebar-menuItem-update-error');
        return false;
    }

    async function menuItemsRequest() {
        console.log('menuItemsRequest', menuId);
        if (!validateMenuId() || !menuId) {
            return;
        }
        const response = await truJobApiMiddleware.resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}`,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return;
        }
        const data = response?.data || [];
        setMenuItems(data);
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(menuItems);
        }
    }, [menuItems]);

    useEffect(() => {
        if (['create', 'add'].includes(operation || '')) {
            return;
        }
        if (!menuId) {
            return;
        }
        menuItemsRequest();
    }, [menuId]);

    useEffect(() => {
        if (!['create', 'add'].includes(operation || '')) {
            return;
        }
        if (!data) {
            return;
        }
        if (!Array.isArray(data)) {
            console.log('menuItem data is not an array');
            return;
        }
        setMenuItems(data);

    }, []);



    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    modalState={dataTableContext.modal}
                    itemSchema={menuItemSchema}
                    itemHeader={(item, index) => `${item?.label} | url: ${item?.url} | type: ${item?.type}` || 'Item type error'}
                    data={menuItems || []}
                    onChange={handleChange}
                    onAdd={handleAddMenuItem}
                    onDelete={handleDeleteMenuItem}
                    onMove={handleMoveMenuItem}
                    onOk={handleOk}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <EditMenuItem
                            menuId={menuId}
                            data={{
                                ...item,
                                index: index,
                            }}
                            operation={operation}
                            inModal={true}
                            modalId={'reorder-modal'}
                            index={index}
                        />
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default ManageMenuItems;