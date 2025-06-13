import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Role } from "@/types/Role";
import EditSidebarFields from "./EditSidebarFields";
import { MANAGE_SIDEBAR_ID } from "./ManageSidebar";
import { CreateSidebar, Sidebar, UpdateSidebar } from "@/types/Sidebar";
import { CreateWidget, Widget } from "@/types/Widget";
import { ModalService } from "@/library/services/modal/ModalService";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


export type EditSidebarProps = {
    data?: Sidebar | null;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
};
function EditSidebar({
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditSidebarProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const initialValues: Sidebar = {
        id: data?.id || 0,
        name: data?.name || '',
        title: data?.title || '',
        icon: data?.icon || '',
        properties: data?.properties || {},
        roles: data?.roles || [],
        widgets: data?.widgets || [],
    };
    function buildWidgetData(widgets: Array<Widget>): Array<CreateWidget> {
        let filteredWidgetData: Array<CreateWidget> = [];
        widgets.forEach((widget: Widget) => {
            if (!Array.isArray(widget?.roles)) {
                filteredWidgetData.push({
                    ...widget,
                    roles: [],
                });
                return;
            }
            filteredWidgetData.push({
                ...widget,
                roles: buildRoleIdData(widget.roles),
            });
        });
        return filteredWidgetData;
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
            requestData.widgets = buildWidgetData(values.widgets);
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
            console.log('No data to update');
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
                response = await truJobApiMiddleware.resourceRequest({
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
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.sidebar}/create`,
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            default:
                console.log('Invalid operation');
                break;
        }
        console.log('edit sidebar response', response);
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
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_SIDEBAR_ID, 'edit'));
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
                        <EditSidebarFields operation={operation} />
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