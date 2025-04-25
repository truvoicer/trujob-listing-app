import Form, { FormContextType } from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Role } from "@/types/Role";
import EditWidgetFields from "./EditWidgetFields";
import { EDIT_SIDEBAR_MODAL_ID } from "./ManageWidget";
import { CreateWidget, Widget, UpdateWidget } from "@/types/Widget";

export type EditWidgetProps = {
    data?: Widget | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
};
function EditWidget({
    data,
    operation,
    inModal = false,
    modalId,
}: EditWidgetProps) {

    const initialValues: Widget = {
        name: data?.name || '',
        title: data?.title || '',
        description: data?.description || '',
        icon: data?.icon || '',
        has_container: data?.has_container || false,
        order: data?.order || 0,
        properties: data?.properties || {},
        roles: data?.roles || [],
    };
    
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

    function buildCreateData(values: Widget) {
        let requestData: CreateWidget = {
            name: values?.name,
            title: values?.title,
        };
        if (values.hasOwnProperty('title')) {
            requestData.title = values.title;
        }
        if (values.hasOwnProperty('icon')) {
            requestData.icon = values.icon;
        }
        if (values.hasOwnProperty('has_container')) {
            requestData.has_container = values.has_container;
        }
        if (values.hasOwnProperty('description')) {
            requestData.description = values.description;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        return requestData;
    }

    function buildUpdateData(values: Widget) {
        let requestData: UpdateWidget = {
            id: values?.id,
        };
        if (values.hasOwnProperty('title')) {
            requestData.title = values.title;
        }
        if (values.hasOwnProperty('icon')) {
            requestData.icon = values.icon;
        }
        if (values.hasOwnProperty('has_container')) {
            requestData.has_container = values.has_container;
        }
        if (values.hasOwnProperty('description')) {
            requestData.description = values.description;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
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
    async function handleSubmit(values: Widget) {
        console.log('edit widget values', values);
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }
        let response = null;
        let requestData: CreateWidget | UpdateWidget;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', requestData);
                // return;
                if (!requestData?.id) {
                    throw new Error('Widget ID is required');
                }
                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.widget}/${requestData.id}/update`,
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
                    endpoint: `${truJobApiConfig.endpoints.widget}/create`,
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
        console.log('modalId', {modalId, initialValues, dataTableContext});
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
                        <EditWidgetFields />
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
                                    <EditWidgetFields />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditWidget;