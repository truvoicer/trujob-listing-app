import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_LISTING_FEATURE_MODAL_ID, EDIT_LISTING_FEATURE_MODAL_ID } from "./ManageListingFeature";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Listing, ListingFeature } from "@/types/Listing";
import { Sidebar } from "@/types/Sidebar";
import EditListingFeatureFields from "./EditListingFeatureFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { Feature } from "@/types/Feature";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export type EditListingFeatureProps = {
    data?: Listing;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingFeature({
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
    const initialValues: ListingFeature = {
        
    };

    async function handleSubmit(values: {features: Array<Feature>}) {
            if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
                console.warn('No data to update');
                return;
            }
            if (!data?.id) {
                console.log('Listing feature ID is required');
                return;
            }
            if (!Array.isArray(values?.features)) {
                return;
            }
            let response = null;
            let requestData = {
                ids: RequestHelpers.extractIdsFromArray(values?.features),
            }
            switch (operation) {
                case 'add':
                case 'create':
                    console.log('create requestData', requestData);
                    response = await truJobApiMiddleware.resourceRequest({
                        endpoint: UrlHelpers.urlFromArray([
                            truJobApiConfig.endpoints.listingFeature.replace(
                                ':listingId',
                                data.id.toString(),
                            ),
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
            dataTableContext.refresh();
            dataTableContext.modal.close(EDIT_LISTING_FEATURE_MODAL_ID);
            dataTableContext.modal.close(CREATE_LISTING_FEATURE_MODAL_ID);
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