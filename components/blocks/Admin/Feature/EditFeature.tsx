import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditFeatureFields from "./EditFeatureFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { CreateFeature, Feature, UpdateFeature } from "@/types/Feature";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type EditFeatureProps = {
    listingId?: number;
    data?: Feature;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditFeature({
    listingId,
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
            name: values?.name || '',
            label: values?.label || '',
        };

        return requestData;
    }
    async function handleSubmit(values: Feature) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            DebugHelpers.log(DebugHelpers.WARN, 'No data to update');
            return;
        }


        if (!listingId) {
            DebugHelpers.log(DebugHelpers.WARN, 'Listing ID is required');
            return;
        }
        if (!values?.feature?.id) {
            DebugHelpers.log(DebugHelpers.WARN, 'Brand ID is required');
            return;
        }

        let response = null;
        let requestData: CreateFeature | UpdateFeature;
        switch (operation) {
            case 'edit':
            case 'update':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingFeature.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.feature?.id,
                        'update',
                    ]),
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                })
                break;
            case 'add':
            case 'create':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingFeature.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.feature?.id,
                        'create',
                    ]),
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                })
                break;
            default:
                DebugHelpers.log(DebugHelpers.WARN, 'Invalid operation');
                break;
        }
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
                handleSubmit: handleSubmit,
            });
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