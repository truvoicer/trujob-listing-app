import { SetStateAction, useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import { CreateMenuItem, Menu, MenuItem, MenuItemPostRequest, UpdateMenuItem } from "@/types/Menu";
import { Role } from "@/types/Role";
import { Page } from "@/types/Page";
import EditMenuItemFields from "./EditMenuItemFields";
import { Form } from "formik";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { isObjectEmpty } from "@/helpers/utils";

export type EditMenuItemProps = {
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    menuId?: number;
    index?: number;
    data?: MenuItem;
}
function EditMenuItem({
    data,
    index,
    menuId,
    operation,
    inModal = false,
    modalId,
}: EditMenuItemProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const [initialValues, setInitialValues] = useState<MenuItem | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    async function menuItemRequest() {
        if (!menuId) {
            console.warn('Menu Item ID is required');
            return;
        }
        if (!data?.id) {
            console.warn('Menu Item ID is required');
            return;
        }
        const response = await truJobApiMiddleware.resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${data.id}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return;
        }
        if (!response?.data) {
            console.warn('No data found');
            return;
        }
        setInitialValues(response.data);
    }
    function buildMenuIdData(menus: Array<Menu>): Array<number> {
        const filterSidebarData: Array<Menu> = menus
            .filter((menu: Menu | number) => {
                if (typeof menu === 'object') {
                    return menu.id;
                }
                return false;
            });
        return filterSidebarData.map((menu: Menu) => {
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

    function buildRequestData(values: MenuItem) {
        let requestData: MenuItemPostRequest = {
            type: values?.type || '',
        };
        if (values.hasOwnProperty('active')) {
            requestData.active = values.active;
        }
        if (values.hasOwnProperty('label')) {
            requestData.label = values.label;
        }
        if (values.hasOwnProperty('url')) {
            requestData.url = values.url;
        }
        if (values.hasOwnProperty('target')) {
            requestData.target = values.target;
        }
        if (values.hasOwnProperty('order')) {
            requestData.order = values.order;
        }
        if (values.hasOwnProperty('icon')) {
            requestData.icon = values.icon;
        }
        if (values.hasOwnProperty('li_class')) {
            requestData.li_class = values.li_class;
        }
        if (values.hasOwnProperty('a_class')) {
            requestData.a_class = values.a_class;
        }
        if (values.hasOwnProperty('page') && values.page && values.page?.id) {
            requestData.page_id = values.page.id;
        }
        if (Array.isArray(values?.menus)) {
            requestData.menus = buildMenuIdData(values.menus);
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        return requestData;
    }

    function buildCreateData(values: MenuItem) {
        let requestData: CreateMenuItem = {
            type: values?.type || '',
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }

    function buildUpdateData(values: MenuItem) {
        let requestData: UpdateMenuItem = {
            id: values.id,
            type: values?.type || '',
        };

        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };
        return requestData;
    }
    function getRequiredFields() {
        let requiredFields: any = {};
        if (operation === 'edit' || operation === 'update') {
            requiredFields = {
                id: true,
                menus: {
                    id: true,
                },
                roles: {
                    id: true,
                },
            };
        }
        return requiredFields;
    }
    async function handleSubmit(values: MenuItem) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }
        if (!menuId) {
            console.warn('Menu ID is required');
            return;
        }
        let response = null;
        let requestData: CreateMenuItem | UpdateMenuItem;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', {values, requestData});
                // return;
                if (!requestData?.id) {
                    throw new Error('MenuItem ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/${requestData.id}/update`,
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
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.menuItem.replace('%s', menuId.toString())}/create`,
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
            setAlert({
                show: true,
                message: (
                    <div>
                        <strong>Error:</strong>
                        {truJobApiMiddleware.getErrors().map((error: ErrorItem, index: number) => {
                            return (
                                <div key={index}>{error.message}</div>
                            )
                        })}
                    </div>
                ),
                type: 'danger',
            });
            return;
        }
        dataTableContext.refresh();
    }
    const dataTableContext = useContext(DataTableContext);

    useEffect(() => {
        if (!data?.id) {
            return;
        }
        if (['add', 'create'].includes(operation)) {
            setInitialValues(data);
        } else if (['edit', 'update'].includes(operation)) {
            menuItemRequest();
        }
    }, [data?.id]);

    useEffect(() => {
        if (!inModal) {
            return;
        }
        if (!modalId) {
            return;
        }

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
    }, [inModal, modalId, initialValues]);
    return (
        <div className="row">
            <div className="col-12">
                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}
                {inModal
                    ? (
                        <EditMenuItemFields
                            operation={operation}
                            menuId={menuId}
                        />
                    )
                    : (
                        <Form
                            operation={operation}
                            requiredFields={getRequiredFields()}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        >
                            {() => {
                                return (
                                    <EditMenuItemFields
                                        operation={operation}
                                        menuId={menuId}
                                    />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditMenuItem;