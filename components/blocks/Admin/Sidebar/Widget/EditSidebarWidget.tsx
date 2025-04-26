import Form, { FormContext, FormContextType } from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Role } from "@/types/Role";
import EditSidebarWidgetFields from "./EditSidebarWidgetFields";
import { EDIT_SIDEBAR_WIDGET_MODAL_ID } from "./ManageSidebarWidget";
import { CreateWidget, Widget, UpdateWidget } from "@/types/Widget";

export type EditSidebarWidgetProps = {
    data?: Widget | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    sidebarId?: number;
};
function EditSidebarWidget({
    sidebarId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditSidebarWidgetProps) {
    const [initialValues, setInitialValues] = useState<Widget | null>(null);

    async function sidebarWidgetRequest() {
        if (!sidebarId) {
            console.warn('Sidebar ID is required');
            return;
        }
        if (!data?.id) {
            console.warn('Sidebar widget ID is required');
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${data.id}`,
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
        // if (Array.isArray(values?.roles)) {
        //     requestData.roles = buildRoleIdData(values.roles);
        // }
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
        dataTableContext.modal.close(EDIT_SIDEBAR_WIDGET_MODAL_ID);
    }
    const dataTableContext = useContext(DataTableContext);

    useEffect(() => {
        if (!data?.id) {
            return;
        }
        sidebarWidgetRequest()
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
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                {inModal
                    ? (
                        <EditSidebarWidgetFields makeRequest={sidebarWidgetRequest} sidebarId={sidebarId} />
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
                                    <EditSidebarWidgetFields sidebarId={sidebarId} />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditSidebarWidget;