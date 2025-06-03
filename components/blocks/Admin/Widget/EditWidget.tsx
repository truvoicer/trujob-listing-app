import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Role } from "@/types/Role";
import EditWidgetFields from "./EditWidgetFields";
import { EDIT_SIDEBAR_MODAL_ID } from "./ManageWidget";
import { CreateWidget, Widget, UpdateWidget } from "@/types/Widget";
import { ModalService } from "@/library/services/modal/ModalService";
import { DataTableContextType } from "@/components/Table/DataManager";


export type EditWidgetProps = {
    data?: Widget | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
};
function EditWidget({
    data,
    operation,
    inModal = false,
    modalId,
    dataTable,
}: EditWidgetProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const initialValues: Widget = {
        id: data?.id || 0,
        name: data?.name || '',
        title: data?.title || '',
        description: data?.description || '',
        icon: data?.icon || '',
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
            
        if (dataTable) {
            dataTable.refresh();
        }return;
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
                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}
                {inModal &&
                    ModalService.modalItemHasFormProps(dataTableContext?.modal, modalId) &&
                    (
                        <EditWidgetFields operation={operation} />
                    )
                }
                {!inModal && (
                    <Form
                        operation={operation}
                        requiredFields={getRequiredFields()}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {() => {
                            return (
                                <EditWidgetFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditWidget;