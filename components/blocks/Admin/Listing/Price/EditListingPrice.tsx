import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_LISTING_PRICE_MODAL_ID, EDIT_LISTING_PRICE_MODAL_ID } from "./ManageListingPrice";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Listing } from "@/types/Listing";
import EditListingPriceFields from "./EditListingPriceFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { CreatePrice, Price, PriceRequest, UpdatePrice } from "@/types/Price";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { has } from "underscore";

export type EditListingPriceProps = {
    listingId?: number;
    data?: Listing;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingPrice({
    listingId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingPriceProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Price = {
        id: data?.id || 0,
        user: data?.user || null,
        country: data?.country || null,
        currency: data?.currency || null,
        type: data?.type || null,
        valid_from: data?.valid_from || '',
        valid_to: data?.valid_to || '',
        is_default: data?.is_default || false,
        is_active: data?.is_active || false,
        amount: data?.amount || 0,
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildRequestData(values: Price) {
        let requestData: PriceRequest = {};
        
        if (values?.country) {
            requestData.country_id = values?.country?.id;
        }
        if (values?.currency) {
            requestData.currency_id = values?.currency?.id;
        }
        if (values?.type) {
            requestData.type_id = values?.type?.id;
        }
        if (values?.valid_from) {
            requestData.valid_from = values?.valid_from;
        }
        if (values?.valid_to) {
            requestData.valid_to = values?.valid_to;
        }
        if (values.hasOwnProperty('is_default')) {
            requestData.is_default = values?.is_default;
        }
        if (values.hasOwnProperty('is_active')) {
            requestData.is_active = values?.is_active;
        }
        if (values.hasOwnProperty('amount')) {
            requestData.amount = values?.amount;
        }
        return requestData;
    }

    function buildCreateData(values: Price) {

        let requestData: CreatePrice = {
            
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };
        return requestData;
    }
    function buildUpdateData(values: Price) {

        let requestData: UpdatePrice = {
            id: values?.id || 0,
        };

        if (values?.user) {
            requestData.user_id = values?.user?.id;
        }
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };
        return requestData;
    }

    async function handleSubmit(values: Price) {
        console.log('handleSubmit', {values});
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }


        if (!listingId) {
            console.warn('Listing ID is required');
            return;
        }

        let response = null;


        switch (operation) {
            case 'edit':
            case 'update':
                if (!values?.id) {
                    console.warn('Listing review ID is required');
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingPrice.replace(
                            ':listingId',
                            listingId.toString()
                        ),
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
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingPrice.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        'create',
                    ]),
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: buildCreateData(values),
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
        dataTableContext.modal.close(EDIT_LISTING_PRICE_MODAL_ID);
        dataTableContext.modal.close(CREATE_LISTING_PRICE_MODAL_ID);

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
                        <EditListingPriceFields operation={operation} />
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
                                <EditListingPriceFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditListingPrice;