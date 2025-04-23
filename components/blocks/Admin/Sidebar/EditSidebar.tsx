import Form, { FormContextType } from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Role } from "@/types/Role";
import EditSidebarFields from "./EditSidebarFields";
import { EDIT_SIDEBAR_MODAL_ID } from "./ManageSidebar";
import { Sidebar } from "@/types/Sidebar";

export type EditSidebarProps = {
    data?: Sidebar | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
};
function EditSidebar({
    data,
    operation,
    inModal = false,
    modalId,
}: EditSidebarProps) {

    const initialValues: Sidebar = {
        name: data?.name || '',
        title: data?.title || '',
        icon: data?.icon || '',
        has_container: data?.has_container || false,
        order: data?.order || 0,
        properties: data?.properties || {},
        roles: data?.roles || [],
        widgets: data?.widgets || [],
    };
    function buildSidebarIdData(sidebars: Array<Sidebar>): Array<number> {
        const filterSidebarData: Array<Sidebar> = sidebars
            .filter((sidebar: Sidebar) => {
                if (typeof sidebar === 'object') {
                    return sidebar.id;
                }
                return false;
            });
        return filterSidebarData.map((sidebar: Sidebar) => {
            return sidebar.id;
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
    function buildSidebarItemRequestData(sidebarItems: Array<SidebarItem>) {
        let newSidebarItems: Array<CreateSidebarItem | UpdateSidebarItem> = [];
        sidebarItems.forEach((sidebarItem: SidebarItem, index: number) => {
            newSidebarItems[index] = {
                active: sidebarItem?.active,
                label: sidebarItem?.label,
                type: sidebarItem?.type,
                url: sidebarItem?.url,
                target: sidebarItem?.target,
                order: sidebarItem?.order,
                icon: sidebarItem?.icon,
                li_class: sidebarItem?.li_class,
                a_class: sidebarItem?.a_class
            };
            if (sidebarItem.hasOwnProperty('id') && sidebarItem.id) {
                newSidebarItems[index].id = sidebarItem.id;
            }
            if (sidebarItem.hasOwnProperty('page_id')) {
                newSidebarItems[index].page_id = sidebarItem.page_id;
            }
            if (Array.isArray(sidebarItem?.roles)) {
                if (!Array.isArray(newSidebarItems?.[index]?.roles)) {
                    newSidebarItems[index].roles = [];
                }
                newSidebarItems[index].roles = buildRoleIdData(sidebarItem.roles);
            }
            if (Array.isArray(sidebarItem?.sidebars)) {
                if (!Array.isArray(newSidebarItems?.[index]?.sidebars)) {
                    newSidebarItems[index].sidebars = [];
                }
                newSidebarItems[index].sidebars = buildSidebarIdData(sidebarItem.sidebars);
            }
        });
        return newSidebarItems
    }

    function buildCreateData(values: Sidebar) {
        let requestData: CreateSidebar = {
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
        if (Array.isArray(values?.sidebar_items)) {
            requestData.sidebar_items = buildSidebarItemRequestData(values.sidebar_items);
        }
        return requestData;
    }

    function buildUpdateData(values: Sidebar) {
        let requestData: UpdateSidebar = {
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
        if (Array.isArray(values?.sidebar_items)) {
            requestData.sidebar_items = buildSidebarItemRequestData(values.sidebar_items);
        }
        return requestData;
    }
    function getRequiredFields() {
        let requiredFields: any = {};
        if (operation === 'edit' || operation === 'update') {
            requiredFields = {
                id: true,
                sidebar_items: {
                    id: true,
                },
                roles: {
                    id: true,
                },
            };
        }
        return requiredFields;
    }
    async function handleSubmit(values: Sidebar) {
        console.log('edit sidebar values', values);
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }
        let response = null;
        let requestData: CreateSidebar | UpdateSidebar;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', requestData);
                // return;
                if (!requestData?.id) {
                    throw new Error('Sidebar ID is required');
                }
                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.sidebar}/${requestData.id}/update`,
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
                    endpoint: `${truJobApiConfig.endpoints.sidebar}/create`,
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
        dataTableContext.modal.close(EDIT_SIDEBAR_MODAL_ID);
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
                {inModal
                    ? (
                        <EditSidebarFields />
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
                                    <EditSidebarFields />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditSidebar;