import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_PRODUCT_PRICE_MODAL_ID, EDIT_PRODUCT_PRICE_MODAL_ID } from "./ManageProductPrice";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditProductPriceFields from "./EditProductPriceFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { CreatePrice, Price, PriceRequest, UpdatePrice } from "@/types/Price";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { getSiteCountryAction, getSiteCurrencyAction } from "@/library/redux/actions/site-actions";
import { DataTableContextType } from "@/components/Table/DataManager";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { isArray } from "underscore";

export type EditProductPriceProps = {
    productId?: number;
    data?: Price;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditProductPrice({
    productId,
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditProductPriceProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const dataTableContext = useContext(DataTableContext);
    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const country = getSiteCountryAction();
    const currency = getSiteCurrencyAction();

    const initialValues: Price = {
        id: data?.id || 0,
        created_by_user: data?.created_by_user,
        country: data?.country || country || null,
        currency: data?.currency || currency || null,
        price_type: data?.price_type,
        valid_from: data?.valid_from || '',
        valid_to: data?.valid_to || '',
        valid_from_timestamp: data?.valid_from_timestamp || 0,
        valid_to_timestamp: data?.valid_to_timestamp || 0,
        is_default: data?.is_default || false,
        is_active: data?.is_active || false,
        tax_rates: data?.tax_rates || [],
        discounts: data?.discounts || [],
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
        if (values?.price_type) {
            requestData.price_type_id = values?.price_type?.id;
        }
        if (values?.created_by_user) {
            requestData.created_by_user_id = values?.created_by_user?.id;
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
        if (Array.isArray(values?.tax_rates) && values?.tax_rates.length > 0) {
            requestData.tax_rate_ids = RequestHelpers.extractIdsFromArray(values.tax_rates);
        }
        if (Array.isArray(values?.discounts) && values?.discounts.length > 0) {
            requestData.discount_ids = RequestHelpers.extractIdsFromArray(values.discounts);
        }
        return requestData;
    }

    function buildCreateData(values: Price) {

        let requestData: CreatePrice = {};
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

        if (values?.created_by_user) {
            requestData.created_by_user_id = values?.created_by_user?.id;
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
            return false;
        }


        if (!productId) {
            console.warn('Product ID is required');
            return false;
        }

        let response = null;


        switch (operation) {
            case 'edit':
            case 'update':
                if (!values?.id) {
                    console.warn('Product review ID is required');
                    return false;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.productPrice.replace(
                            ':productId',
                            productId.toString()
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
                        truJobApiConfig.endpoints.productPrice.replace(
                            ':productId',
                            productId.toString()
                        ),
                        'store',
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
            return false;
        }
        if (dataTable) {
            dataTable.refresh();
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(EDIT_PRODUCT_PRICE_MODAL_ID);
        dataTableContext.modal.close(CREATE_PRODUCT_PRICE_MODAL_ID);
        return true;
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
                        <EditProductPriceFields operation={operation} />
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
                                <EditProductPriceFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditProductPrice;