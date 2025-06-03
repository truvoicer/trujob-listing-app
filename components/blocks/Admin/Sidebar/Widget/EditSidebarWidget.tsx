import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Role } from "@/types/Role";
import EditSidebarWidgetFields from "./EditSidebarWidgetFields";
import { EDIT_SIDEBAR_WIDGET_MODAL_ID } from "./ManageSidebarWidget";
import { CreateWidget, Widget, UpdateWidget } from "@/types/Widget";
import { DataTableContextType } from "@/components/Table/DataManager";


export type EditSidebarWidgetProps = {
    data?: Widget | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    sidebarId?: number;
    index?: number;
    dataTable?: DataTableContextType;
};
function EditSidebarWidget({
    dataTable,
    index,
    sidebarId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditSidebarWidgetProps) {
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const [initialValues, setInitialValues] = useState<Widget | null>(null);

    async function sidebarWidgetRequest() {
        if (!sidebarId) {
            console.log('Sidebar ID is required');
            return;
        }
        if (!data?.id) {
            console.log('Sidebar widget ID is required');
            return;
        }
        const response = await truJobApiMiddleware.resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${data.id}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return;
        }
        if (!response?.data) {
            console.log('No data found');
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
            console.log('No data to update');
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
                response = await truJobApiMiddleware.resourceRequest({
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
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.widget}/create`,
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            default:
                console.log('Invalid operation');
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
        dataTableContext.modal.close(EDIT_SIDEBAR_WIDGET_MODAL_ID);
    }
    const dataTableContext = useContext(DataTableContext);

    useEffect(() => {
        if (!data?.id) {
            return;
        }
        if (['add', 'create'].includes(operation)) {
            setInitialValues(data);
        } else if (['edit', 'update'].includes(operation)) {
            sidebarWidgetRequest()
            return;
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
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}
                {inModal
                    ? (
                        <EditSidebarWidgetFields
                            operation={operation}
                            sidebarId={sidebarId}
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
                                    <EditSidebarWidgetFields
                                        sidebarId={sidebarId}
                                        operation={operation}
                                    />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditSidebarWidget;