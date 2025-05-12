import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditListingFeatureFields from "./EditListingFeatureFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { CreateFeature, Feature, UpdateFeature } from "@/types/Feature";

export type EditListingFeatureProps = {
    listingId?: number;
    data?: Feature;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingFeature({
    listingId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingFeatureProps) {

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
            console.warn('No data to update');
            return;
        }


        if (!listingId) {
            console.warn('Listing ID is required');
            return;
        }
        if (!values?.feature?.id) {
            console.warn('Brand ID is required');
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
                console.warn('Invalid operation');
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
                            <EditListingFeatureFields operation={operation} />
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
                                    <EditListingFeatureFields operation={operation} />
                                )
                            }}
                        </Form>
                    )}
                </div>
            </div>
        );
    }
    export default EditListingFeature;