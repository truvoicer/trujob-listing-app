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
import { Price } from "@/types/Price";
import { UrlHelpers } from "@/helpers/UrlHelpers";

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
    const initialValues: {
        prices: Array<Price>;
    } = {
        prices: data?.prices || [],
    };

    async function handleSubmit(values: {
        prices: Array<Price>;
    }) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }
        if (!listingId) {
            console.log('Listing ID is required');
            return;
        }
        if (!Array.isArray(values?.prices)) {
            console.warn('Invalid values received');
            return;
        }
        let response = null;
        let requestData = {
            ids: RequestHelpers.extractIdsFromArray(values?.prices),
        }
        switch (operation) {
            case 'add':
            case 'create':
            case 'edit':
            case 'update':
                console.log('create requestData', requestData);
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingPrice.replace(
                            ':listingId',
                            listingId.toString(),
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