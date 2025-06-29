import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_USER_ID } from "./ManageUser";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { User, UserProfile } from "@/types/User";
import { Sidebar } from "@/types/Sidebar";
import EditUserFields from "./EditUserFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";
import { FormikValues } from "formik";


export type EditUserProps = {
    data?: User & UserProfile;
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
    const initialValues: User & UserProfile = {
        id: data?.id || 0,
        first_name: data?.first_name || '',
        last_name: data?.last_name || '',
        username: data?.username || '',
        email: data?.email || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
        phone: data?.phone || '',
        dob: data?.dob || '',
        country: data?.country || null,
        currency: data?.currency || null,
        language: data?.language || null,
        roles: data?.roles || [],
    };

    function createRequestData(values: FormikValues) {
        let requestData = {};
        if (values?.[SESSION_USER_FIRSTNAME]) {
            requestData[SESSION_USER_FIRSTNAME] = values?.[SESSION_USER_FIRSTNAME];
        }
        if (values?.[SESSION_USER_LASTNAME]) {
            requestData[SESSION_USER_LASTNAME] = values?.[SESSION_USER_LASTNAME];
        }
        if (values?.[SESSION_USER_USERNAME]) {
            requestData[SESSION_USER_USERNAME] = values?.[SESSION_USER_USERNAME];
        }
        if (values?.[SESSION_USER_EMAIL]) {
            requestData[SESSION_USER_EMAIL] = values?.[SESSION_USER_EMAIL];
        }
        if (values?.[SESSION_USER_PROFILE_DOB]) {
            requestData[SESSION_USER_PROFILE] = values?.[SESSION_USER_PROFILE_DOB];
        }
        if (values?.[SESSION_USER_SETTINGS_COUNTRY]) {
            requestData.country_id = values?.[SESSION_USER_SETTINGS_COUNTRY]?.id;
        }
        if (values?.[SESSION_USER_SETTINGS_CURRENCY]) {
            requestData.currency_id = values?.[SESSION_USER_SETTINGS_CURRENCY]?.id;
        }
        if (values?.[SESSION_USER_SETTINGS_LANGUAGE]) {
            requestData.language_id = values?.[SESSION_USER_SETTINGS_LANGUAGE]?.id;
        }
        if (values?.change_password) {
            requestData.change_password = true;
            requestData.password = values?.password;
            requestData.password_confirmation = values?.password_confirmation;
        }
        return requestData;
    }

    async function handleSubmit(values: User) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return false;
        }

        let response = null;
        switch (operation) {
            case 'edit':
            case 'update':
            case 'add':
            case 'create':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.profile}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: createRequestData(values),
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
            return false;
        }
        if (dataTable) {
            dataTable.refresh();
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_USER_ID, 'edit'));
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_USER_ID, 'create'));
        return true;
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