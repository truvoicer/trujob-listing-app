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
import { CreateSidebar, Sidebar, UpdateSidebar } from "@/types/Sidebar";
import { Widget } from "@/types/Widget";

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
        id: data?.id || 0,
        name: data?.name || '',
        title: data?.title || '',
        icon: data?.icon || '',
        order: data?.order || 0,
        properties: data?.properties || {},
        roles: data?.roles || [],
        widgets: data?.widgets || [],
    };
    function buildWidgetIdData(sidebars: Array<Widget>): Array<number> {
        const filterWidgetData: Array<Widget> = sidebars
            .filter((widget: Widget) => {
                if (typeof widget === 'object') {
                    return widget.id;
                }
                return false;
            });
        return filterWidgetData.map((widget: Widget) => {
            return widget.id;
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

    function buildCreateData(values: Sidebar) {
        let requestData: CreateSidebar = {
            name: values?.name,
            title: values?.title,
        };
        if (values.hasOwnProperty('title')) {
            requestData.title = values.title;
        }
        if (values.hasOwnProperty('icon')) {
            requestData.icon = values.icon;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        if (Array.isArray(values?.widgets)) {
            requestData.widgets = buildWidgetIdData(values.widgets);
        }
        return requestData;
    }

    function buildUpdateData(values: Sidebar) {
        let requestData: UpdateSidebar = {
            id: values?.id,
        };
        if (values.hasOwnProperty('name')) {
            requestData.name = values.name;
        }
        if (values.hasOwnProperty('title')) {
            requestData.title = values.title;
        }
        if (values.hasOwnProperty('icon')) {
            requestData.icon = values.icon;
        }
        return requestData;
    }
    function getRequiredFields() {
        let requiredFields: any = {};
        if (operation === 'edit' || operation === 'update') {
            requiredFields = {
                id: true,
                widgets: {
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
            return false;
        }
        let response = null;
        let requestData: CreateSidebar | UpdateSidebar;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', requestData, values);
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
                console.log('create requestData', requestData, values);
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
        console.log('edit sidebar response', response);
        if (!response) {
            return false;
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
                        <EditSidebarFields operation={operation} />
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
                                    <EditSidebarFields operation={operation} />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditSidebar;