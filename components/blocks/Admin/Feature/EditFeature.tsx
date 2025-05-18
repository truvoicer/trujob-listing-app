import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditFeatureFields from "./EditFeatureFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { CreateFeature, Feature, UpdateFeature } from "@/types/Feature";
import { request } from "http";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { CREATE_FEATURE_MODAL_ID, EDIT_FEATURE_MODAL_ID } from "./ManageFeature";


export type EditFeatureProps = {
    data?: Feature;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditFeature({
    data,
    operation,
    inModal = false,
    modalId,
}: EditFeatureProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const dataTableContext = useContext(DataTableContext);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Feature = {
        id: data?.id || 0,
        name: data?.name || '',
        label: data?.label || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildCreateData(values: Feature) {

        let requestData: CreateFeature = {
            name: values?.name || '',
            label: values?.label || '',
        };
        return requestData;
    }
    function buildUpdateData(values: Feature) {

        let requestData: UpdateFeature = {
            id: values?.id || 0,
        };
        if (values?.name) {
            requestData.name = values?.name || '';
        }
        if (values?.label) {
            requestData.label = values?.label || '';
        }

        return requestData;
    }
    async function handleSubmit(
        values: Feature | { features: Feature[] }
    ) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }

        let response = null;
        let requestData;
        switch (operation) {
            case 'edit':
            case 'update':
                if (!values?.id) {
                    console.warn('Feature ID is required');
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.feature,
                        values?.id,
                        'update',
                    ]),
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: buildUpdateData(values),
                })
                break;
            case 'add':
            case 'create':
                if (Array.isArray(values?.features)) {
                    return;
                } else {
                    requestData = buildCreateData(values);
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.feature,
                        'create',
                    ]),
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
                message: 'No response from server',
                type: 'danger',
            });
            return;
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(EDIT_FEATURE_MODAL_ID);
        dataTableContext.modal.close(CREATE_FEATURE_MODAL_ID);
    }

    function getRequiredFields() {
        let requiredFields: any = {};
        if (operation === 'edit' || operation === 'update') {
            requiredFields = {
                id: true,
            };
        }
        return requiredFields;
    }

    useEffect(() => {
        if (!inModal) {
            return;
        }
        if (!modalId) {
            return;
        }

        ModalService.initializeModalWithForm({
            modalState: dataTableContext?.modal,
            id: modalId,
            operation: operation,
            initialValues: initialValues,
            requiredFields: getRequiredFields(),
            handleSubmit: handleSubmit,
        });
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
                        <EditFeatureFields operation={operation} />
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
                                <EditFeatureFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditFeature;