import Form, { FormContextType } from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Dispatch, SetStateAction, use, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_MENU_MODAL_ID } from "./ManageMenu";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import MenuItemForm from "./ManageMenuItems";
import RoleForm from "../Role/RoleForm";
import { CreateMenu, CreateMenuItem, Menu, MenuItem, UpdateMenu, UpdateMenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";
import EditMenuFields from "./EditMenuFields";

export type EditMenuProps = {
    data?: Menu | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
};
function EditMenu({
    data,
    operation,
    inModal = false,
    modalId,
}: EditMenuProps) {

    const initialValues = {
        'id': data?.id,
        'name': data?.name || '',
        'has_parent': data?.has_parent || false,
        'ul_class': data?.ul_class || '',
        'active': data?.active || false,
        'roles': data?.roles || [],
        'menu_items': data?.menu_items || [],
    };
    function buildMenuIdData(menus: Array<Menu>): Array<number> {
        const filterMenuData: Array<Menu> = menus
            .filter((menu: Menu) => {
                if (typeof menu === 'object') {
                    return menu.id;
                }
                return false;
            });
        return filterMenuData.map((menu: Menu) => {
            return menu.id;
        });
    }
    function buildRoleIdData(roles: Array<Role>): Array<number> {
        const filterRoleData: Array<Role> = roles
            .filter((role: Role | number) => {
                if (typeof role === 'object') {
                    return role.id;
                }
                return false;
            });
        return filterRoleData.map((role: Role) => {
            return role.id;
        });
    }
    function buildMenuItemRequestData(menuItems: Array<MenuItem>) {
        let newMenuItems: Array<CreateMenuItem | UpdateMenuItem> = [];
        menuItems.forEach((menuItem: MenuItem, index: number) => {
            newMenuItems[index] = {
                active: menuItem?.active,
                label: menuItem?.label,
                type: menuItem?.type,
                url: menuItem?.url,
                target: menuItem?.target,
                order: menuItem?.order,
                icon: menuItem?.icon,
                li_class: menuItem?.li_class,
                a_class: menuItem?.a_class
            };
            if (menuItem.hasOwnProperty('id') && menuItem.id) {
                newMenuItems[index].id = menuItem.id;
            }
            if (menuItem.hasOwnProperty('page_id')) {
                newMenuItems[index].page_id = menuItem.page_id;
            }
            if (Array.isArray(menuItem?.roles)) {
                if (!Array.isArray(newMenuItems?.[index]?.roles)) {
                    newMenuItems[index].roles = [];
                }
                newMenuItems[index].roles = buildRoleIdData(menuItem.roles);
            }
            if (Array.isArray(menuItem?.menus)) {
                if (!Array.isArray(newMenuItems?.[index]?.menus)) {
                    newMenuItems[index].menus = [];
                }
                newMenuItems[index].menus = buildMenuIdData(menuItem.menus);
            }
        });
        return newMenuItems
    }

    function buildCreateData(values: Menu) {
        let requestData: CreateMenu = {
            name: values?.name,
        };
        if (values.hasOwnProperty('ul_class')) {
            requestData.ul_class = values.ul_class;
        }
        if (values.hasOwnProperty('active')) {
            requestData.active = values.active;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        if (Array.isArray(values?.menu_items)) {
            requestData.menu_items = buildMenuItemRequestData(values.menu_items);
        }
        return requestData;
    }

    function buildUpdateData(values: Menu) {
        let requestData: UpdateMenu = {
            id: values?.id,
        };
        if (values.hasOwnProperty('ul_class')) {
            requestData.ul_class = values.ul_class;
        }
        if (values.hasOwnProperty('active')) {
            requestData.active = values.active;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        if (Array.isArray(values?.menu_items)) {
            requestData.menu_items = buildMenuItemRequestData(values.menu_items);
        }
        return requestData;
    }
    function getRequiredFields() {
        let requiredFields: any = {};
        if (operation === 'edit' || operation === 'update') {
            requiredFields = {
                id: true,
                menu_items: {
                    id: true,
                },
                roles: {
                    id: true,
                },
            };
        }
        return requiredFields;
    }
    async function handleSubmit(values: Menu) {
        console.log('edit menu values', values);
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }
        let response = null;
        let requestData: CreateMenu | UpdateMenu;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', requestData);
                // return;
                if (!requestData?.id) {
                    throw new Error('Menu ID is required');
                }
                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.menu}/${requestData.id}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                requestData = buildCreateData(values);
                console.log('create requestData', requestData);
                // return;
                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.menu}/create`,
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            default:
                console.warn('Invalid operation');
                break;
        }
        if (!response) {
            return;
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(EDIT_MENU_MODAL_ID);
    }
    const dataTableContext = useContext(DataTableContext);
    useEffect(() => {
        if (!inModal) {
            return;
        }
        if (!modalId) {
            return;
        }
        console.log('in modal', modalId);
        dataTableContext.modal.update(
            {
                formProps: {
                    operation: operation,
                    initialValues: initialValues,
                    requiredFields: getRequiredFields(),
                    onSubmit: handleSubmit,
                }
            },
            modalId
        );
    }, [inModal, modalId]);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                {inModal
                    ? (
                        <EditMenuFields />
                    )
                    : (
                        <Form
                            operation={operation}
                            requiredFields={getRequiredFields()}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        >
                            {({
                                values,
                                errors,
                                setFieldValue,
                                onChange,
                            }: FormContextType) => {
                                return (
                                    <EditMenuFields />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditMenu;