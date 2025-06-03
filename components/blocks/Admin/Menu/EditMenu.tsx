import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_MENU_MODAL_ID } from "./ManageMenu";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { CreateMenu, CreateMenuItem, Menu, MenuItem, UpdateMenu, UpdateMenuItem } from "@/types/Menu";
import EditMenuFields from "./EditMenuFields";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { FormikProps, FormikValues } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { DataTableContextType } from "@/components/Table/DataManager";


export type EditMenuProps = {
    data?: Menu | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
        dataTable?: DataTableContextType;
};
function EditMenu({
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditMenuProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const initialValues = {
        id: data?.id || 0,
        name: data?.name || '',
        has_parent: data?.has_parent || false,
        ul_class: data?.ul_class || '',
        active: data?.active || false,
        roles: data?.roles || [],
        menu_items: data?.menu_items || [],
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

    function buildMenuItemRequestData(menuItems: Array<MenuItem>) {
        let newMenuItems: Array<CreateMenuItem | UpdateMenuItem> = [];
        menuItems.forEach((menuItem: MenuItem, index: number) => {
            newMenuItems[index] = {
                active: menuItem?.active,
                label: menuItem?.label,
                type: menuItem?.type,
                url: menuItem?.url,
                target: menuItem?.target,
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
            
            if (menuItem.hasOwnProperty('page') && menuItem.page && menuItem.page?.id) {
                newMenuItems[index].page_id = menuItem.page.id;
            }
            if (Array.isArray(menuItem?.roles)) {
                if (!Array.isArray(newMenuItems?.[index]?.roles)) {
                    newMenuItems[index].roles = [];
                }
                newMenuItems[index].roles = RequestHelpers.extractIdsFromArray(menuItem.roles);
            }
            if (Array.isArray(menuItem?.menus)) {
                if (!Array.isArray(newMenuItems?.[index]?.menus)) {
                    newMenuItems[index].menus = [];
                }
                newMenuItems[index].menus = RequestHelpers.extractIdsFromArray(menuItem.menus);
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
            requestData.roles = RequestHelpers.extractIdsFromArray(values.roles);
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
            requestData.roles = RequestHelpers.extractIdsFromArray(values.roles);
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
                response = await truJobApiMiddleware.resourceRequest({
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
                response = await truJobApiMiddleware.resourceRequest({
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

        if (dataTable) {
            dataTable.refresh();
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
                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}
                {inModal &&
                    ModalService.modalItemHasFormProps(dataTableContext?.modal, modalId) &&
                    (
                        <EditMenuFields operation={operation} />
                    )
                }
                {!inModal && (
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
                            handleChange,
                        }: FormikProps<FormikValues>) => {
                            return (
                                <EditMenuFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditMenu;