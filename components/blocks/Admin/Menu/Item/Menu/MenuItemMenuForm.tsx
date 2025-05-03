import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectMenu from "../../SelectMenu";
import { CreateMenu, CreateMenuItem, Menu, MenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { FormikProps, FormikValues } from "formik";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { RequestHelpers } from "@/helpers/RequestHelpers";

export type MenuItemMenuFormProps = {
    menuId?: number;
    menuItemId?: number;
    operation?: 'edit' | 'update' | 'add' | 'create';
    data?: Array<Menu>;
    onChange?: (data: Array<Menu>) => void;
}
function MenuItemMenuForm({
    menuId,
    menuItemId,
    operation,
    data = [],
    onChange
}: MenuItemMenuFormProps) {

    const [menus, setMenus] = useState<Array<Menu>>([]);

    const dataTableContext = useContext(DataTableContext);
    const notificationContext = useContext(AppNotificationContext);

    const menuSchema: Menu = {
        id: 0,
        active: false,
        name: '',
        ul_class: '',
        roles: [],
        menu_items: [],
        has_parent: false,
    };
    function updateFieldValue(
        index: number,
        field: string,
        value: string | number | boolean | Array<MenuItem> | Array<Role>
    ) {
        const newData = [...data];
        newData[index][field] = value;
        if (typeof onChange !== 'function') {
            return;
        }
        onChange(newData);
    }
    function handleChange(
        values: Array<Menu>
    ) {
        if (typeof onChange !== 'function') {
            return;
        }
        onChange(values);
    }

    function validateMenuId(): boolean {
        if (!menuId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Menu id not found
                    </p>
                ),
            }, 'menu-item-menu-form-validate-menu-id-error');
            console.warn('Menu id not found', menuId);
            return false;
        }
        return true;
    }

    function validateMenuItemId(): boolean {
        if (!menuItemId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Menu item id not found
                    </p>
                ),
            }, 'menu-item-menu-form-validate-menu-item-id-error');
            console.warn('Menu item id not found', menuItemId);
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
                        <SelectMenu

                        />
                    </div>
                </div>
            ),
            showFooter: true,
            formProps: {
                operation: 'add',
                initialValues: { menu: null },
            },
            onOk: async ({ formHelpers }: {
                formHelpers: FormikProps<FormikValues>;
            }) => {
                const selectedMenu = formHelpers?.values?.menu;
                if (!selectedMenu) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Menu not found
                            </p>
                        ),
                    }, 'menu-item-menu-form-select-menu-error');
                    console.warn('Menu not found', selectedMenu);
                    return false;
                }
                if (!selectedMenu?.id) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                MenuItem id not found
                            </p>
                        ),
                    }, 'menu-item-menu-form-select-menu-error');
                    console.warn('MenuItem id not found', selectedMenu);
                    return false;
                }

                if (['add', 'create'].includes(operation || '')) {
                    setMenus(
                        [...menus, {
                            ...menuSchema,
                            ...formHelpers.values.menu
                        }]
                    );
                    return true;
                }

                if (!validateMenuId() || !menuId) {
                    return false;
                }
                if (!validateMenuItemId() || !menuItemId) {
                    return false;
                }
                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${menuItemId}/menu/${selectedMenu.id}/create`,
                    method: TruJobApiMiddleware.METHOD.POST,
                    protectedReq: true,
                });
                if (!response) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Menu add failed
                            </p>
                        ),
                    }, 'menu-item-menu-add-error');
                    console.warn('menu add failed', response);
                    return false;
                }
                notificationContext.show({
                    variant: 'success',
                    title: 'Success',
                    component: (
                        <p>
                            Menu added successfully
                        </p>
                    ),
                }, 'menu-item-menu-add-success');
                menusRequest();
                dataTableContext.modal.close('menu-item-menu-form-select-menu');
                return true;
            }
        }, 'menu-item-menu-form-select-menu');
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
        if (!validateMenuItemId() || !menuItemId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${menuItemId}/menu/${item.id}/reorder`,
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
                        Menu moved successfully
                    </p>
                ),
            }, 'menu-item-menu-move-success');
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Menu move failed
                </p>
            ),
        }, 'menu-item-menu-move-error');
        return false;

    }

    async function handleDeleteMenuItem({
        item,
    }: ReorderOnDelete) {

        if (['add', 'create'].includes(operation || '')) {
            setMenus(
                menus.filter((menu: Menu) => {
                    return menu.id !== item.id;
                })
            );
            return true;
        }
        if (!validateMenuId() || !menuId) {
            return;
        }
        if (!validateMenuItemId() || !menuItemId) {
            return;
        }

        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Menu id not found
                    </p>
                ),
            }, 'menu-item-menu-delete-error');
            console.warn('Menu id not found', item);
            return false;
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${menuItemId}/menu/${item.id}/delete`,
            method: TruJobApiMiddleware.METHOD.DELETE,
            protectedReq: true,
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Menu deleted successfully
                    </p>
                ),
            }, 'menu-item-menu-delete-success');
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Menu delete failed
                </p>
            ),
        }, 'menu-item-menu-delete-error');

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
        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Menu id not found
                    </p>
                ),
            }, 'menu-item-menu-update-error');
            console.warn('menu id not found', item);
            return false;
        }
        if (['add', 'create'].includes(operation || '')) {
            if (item.hasOwnProperty('index')) {
                setMenus(prevState => {
                    let newState = [...prevState];
                    if (newState?.[item.index]) {
                        newState[item.index] = item;
                    }
                    return newState;
                });
            } else {
                setMenus([...menus, item]);
            }
            return true;
        }

        if (Array.isArray(item?.roles)) {
            item.roles = RequestHelpers.extractIdsFromArray(item.roles);
        }
        if (!validateMenuId() || !menuId) {
            return;
        }
        if (!validateMenuItemId() || !menuItemId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItemRel.replace('%s', menuId.toString())}/${item.id}/update`,
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
                        menu updated successfully
                    </p>
                ),
            }, 'menu-item-menu-update-success');
            menusRequest();
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    menuItem update failed
                </p>
            ),
        }, 'menu-item-menu-update-error');
        return false;
    }

    async function menusRequest() {
        if (!validateMenuId() || !menuId) {
            return;
        }
        if (!validateMenuItemId() || !menuItemId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${menuItemId}/menu`,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return;
        }
        const data = response?.data || [];
        setMenus(data);
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
        if (!menuId) {
            return;
        }
        menusRequest();
    }, [menuId]);

    useEffect(() => {
        if (!['create', 'add'].includes(operation || '')) {
            return;
        }
        if (!data) {
            return;
        }
        if (!Array.isArray(data)) {
            console.warn('menuItem data is not an array');
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
                    itemHeader={(item, index) => `${item?.name}` || 'Item type error'}
                    data={data || []}
                    onChange={handleChange}
                    onAdd={handleAddMenuItem}
                    onMove={handleMoveMenuItem}
                    onDelete={handleDeleteMenuItem}
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