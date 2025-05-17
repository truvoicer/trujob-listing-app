import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_LISTING_MODAL_ID, EDIT_LISTING_MODAL_ID } from "./ManageListing";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { CreateListing, Listing, ListingRequest, UpdateListing } from "@/types/Listing";
import EditListingFields from "./EditListingFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";


export type EditListingProps = {
    data?: Listing;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListing({
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Listing = {
        id: data?.id || 0,
        name: data?.name || '',
        title: data?.title || '',
        description: data?.description || '',
        active: data?.active || false,
        allow_offers: data?.allow_offers || false,
        quantity: data?.quantity || 0,
        type: data?.type || {
            id: data?.type?.id || 0,
            name: data?.type?.name || '',
            label: data?.type?.label || '',
            description: data?.type?.description || '',
        },
        user: data?.user || {
            id: data?.user?.id || 0,
            first_name: data?.user?.first_name || '',
            last_name: data?.user?.last_name || '',
            username: data?.user?.username || '',
            email: data?.user?.email || '',
            created_at: data?.user?.created_at || '',
            updated_at: data?.user?.updated_at || '',
        },
        follows: data?.follows || [],
        features: data?.features || [],
        reviews: data?.reviews || [],
        categories: data?.categories || [],
        brands: data?.brands || [],
        colors: data?.colors || [],
        product_types: data?.product_types || [],
        media: data?.media || [],
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };


    function buildRequestData(values: Listing) {
        let requestData: ListingRequest = {
            active: values?.active || false,
            name: values.name,
            title: values.title,
        };
        if (values.hasOwnProperty('description')) {
            requestData.description = values.description;
        }
        if (values.hasOwnProperty('allow_offers')) {
            requestData.allow_offers = values.allow_offers;
        }
        if (values.hasOwnProperty('quantity')) {
            requestData.quantity = values.quantity;
        }
        if (values.hasOwnProperty('type')) {
            requestData.type = values.type.id;
        }
        if (values.hasOwnProperty('user')) {
            requestData.user = values.user.id;
        }
        if (Array.isArray(values?.follows)) {
            requestData.follows = RequestHelpers.extractIdsFromArray(values.follows);
        }
        if (Array.isArray(values?.features)) {
            requestData.features = RequestHelpers.extractIdsFromArray(values.features);
        }
        if (Array.isArray(values?.reviews)) {
            requestData.reviews = values.reviews;
        }
        if (Array.isArray(values?.categories)) {
            requestData.categories = RequestHelpers.extractIdsFromArray(values.categories);
        }
        if (Array.isArray(values?.brands)) {
            requestData.brands = RequestHelpers.extractIdsFromArray(values.brands);
        }
        if (Array.isArray(values?.colors)) {
            requestData.colors = RequestHelpers.extractIdsFromArray(values.colors);
        }
        if (Array.isArray(values?.product_types)) {
            requestData.product_types = RequestHelpers.extractIdsFromArray(values.product_types);
        }
        if (Array.isArray(values?.media)) {
            requestData.media = [];
        }
        return requestData;
    }

    function buildCreateData(values: Listing) {
        console.log('buildCreateData', {values});
        if (!values?.type?.id) {
            console.warn('Listing type is required');
            return;
        }
        let requestData: CreateListing = {
            name: values.name,
            title: values.title,
            active: values?.active || false,
            type: values.type.id
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }

    function buildUpdateData(values: Listing) {

        let requestData: UpdateListing = {
            id: data?.id || 0,
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }

    async function handleSubmit(values: Listing) {

        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }

        let response = null;
        let requestData: CreateListing | UpdateListing;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', {requestData, values});
                if (!data?.id) {
                    throw new Error('Listing ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.listing}/${data.id}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                requestData = buildCreateData(values);
                console.log('create requestData', {requestData, values});
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.listing}/create`,
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
        dataTableContext.refresh();
        dataTableContext.modal.close(EDIT_LISTING_MODAL_ID);
        dataTableContext.modal.close(CREATE_LISTING_MODAL_ID);

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
                        <EditListingFields operation={operation} />
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
                                <EditListingFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditListing;