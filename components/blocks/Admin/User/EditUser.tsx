import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_USER_MODAL_ID } from "./ManageUser";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { User } from "@/types/User";
import { Sidebar } from "@/types/Sidebar";
import EditUserFields from "./EditUserFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";


export type EditUserProps = {
    data?: User;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditUser({
    data,
    operation,
    inModal = false,
    modalId,
    dataTable,
}: EditUserProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: User = {
        id: data?.id || 0,
        first_name: data?.first_name || '',
        last_name: data?.last_name || '',
        username: data?.username || '',
        email: data?.email || '',
    };

    async function handleSubmit(values: User) {
        let requestData = { ...values };

        if (['edit', 'update'].includes(operation) && isObjectEmpty(requestData)) {
            console.log('No data to update');
            return;
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = RequestHelpers.extractIdsFromArray(values.roles);
        }
        if (Array.isArray(requestData?.sidebars)) {
            requestData.sidebars = requestData?.sidebars.filter((sidebar: Sidebar) => {
                return sidebar?.id;
            })
                .map((sidebar: Sidebar) => {
                    return sidebar.id;
                });
        }
        if (Array.isArray(requestData?.blocks)) {
            requestData.blocks = requestData?.blocks.map((block: User) => {
                if (Array.isArray(block?.sidebars)) {
                    block.sidebars = RequestHelpers.extractIdsFromArray(block.sidebars);
                }
                if (Array.isArray(block?.roles)) {
                    block.roles = RequestHelpers.extractIdsFromArray(block.roles);
                }
                return block;
            });
        }


        let response = null;
        switch (operation) {
            case 'edit':
            case 'update':
                if (!data?.id) {
                    throw new Error('User ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.user}/${data.id}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.user}/create`,
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
        dataTableContext.modal.close(EDIT_USER_MODAL_ID);

    }


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
                    onSubmit: handleSubmit,
                }
            },
            modalId
        );
    }, [inModal, modalId]);


    const dataTableContext = useContext(DataTableContext);
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
                        <EditUserFields operation={operation} />
                    )
                }
                {!inModal && (
                    <Form
                        operation={operation}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {() => {
                            return (
                                <EditUserFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditUser;