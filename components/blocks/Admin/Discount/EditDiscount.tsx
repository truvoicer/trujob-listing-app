import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_DISCOUNT_MODAL_ID, EDIT_DISCOUNT_MODAL_ID } from "./ManageDiscount";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditDiscountFields from "./EditDiscountFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { Discount, CreateDiscount, UpdateDiscount } from "@/types/Discount";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { RequestHelpers } from "@/helpers/RequestHelpers";


export type EditDiscountProps = {
    data?: Discount;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditDiscount({
    data,
    operation,
    inModal = false,
    modalId,
}: EditDiscountProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const initialValues: Discount = {
        id: data?.id || 0,
        name: data?.name || '',
        description: data?.description || '',
        type: data?.type || '',
        amount: data?.amount || 0,
        rate: data?.rate || 0,
        currency: data?.currency || '',
        starts_at: data?.starts_at || '',
        ends_at: data?.ends_at || '',
        is_active: data?.is_active || false,
        usage_limit: data?.usage_limit || 0,
        per_user_limit: data?.per_user_limit || 0,
        min_order_amount: data?.min_order_amount || 0,
        min_items_quantity: data?.min_items_quantity || 0,
        scope: data?.scope || '',
        code: data?.code || '',
        is_code_required: data?.is_code_required || false,
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };


    function buildCreateData(values: Discount) {

        let requestData: CreateDiscount = {
            name: values?.name || '',
            description: values?.description || '',
            type: values?.type || '',
            amount: values?.amount || 0,
            rate: values?.rate || 0,
            currency_id: values?.currency?.id || 0,
            starts_at: values?.starts_at || '',
            ends_at: values?.ends_at || '',
            is_active: values?.is_active || false,
            usage_limit: values?.usage_limit || 0,
            per_user_limit: values?.per_user_limit || 0,
            min_order_amount: values?.min_order_amount || 0,
            min_items_quantity: values?.min_items_quantity || 0,
            scope: values?.scope || '',
            code: values?.code || '',
            is_code_required: values?.is_code_required || false,
        };

        return requestData;
    }

    function buildUpdateData(values: Discount) {

        let requestData: UpdateDiscount = {
            id: values?.id || 0,
        };
        if (values?.name) {
            requestData.name = values?.name || '';
        }
        if (values?.description) {
            requestData.description = values?.description || '';
        }
        if (values?.type) {
            requestData.type = values?.type || '';
        }
        if (values?.amount) {
            requestData.amount = values?.amount || 0;
        }
        if (values?.rate) {
            requestData.rate = values?.rate || 0;
        }
        if (values?.currency?.id) {
            requestData.currency_id = values?.currency.id;
        }
        if (values?.starts_at) {
            requestData.starts_at = values?.starts_at || '';
        }
        if (values?.ends_at) {
            requestData.ends_at = values?.ends_at || '';
        }
        if (values?.hasOwnProperty('is_active')) {
            requestData.is_active = values?.is_active || false;
        }
        if (values?.usage_limit) {
            requestData.usage_limit = values?.usage_limit || 0;
        }
        if (values?.per_user_limit) {
            requestData.per_user_limit = values?.per_user_limit || 0;
        }
        if (values?.min_order_amount) {
            requestData.min_order_amount = values?.min_order_amount || 0;
        }
        if (values?.min_items_quantity) {
            requestData.min_items_quantity = values?.min_items_quantity || 0;
        }
        if (values?.scope) {
            requestData.scope = values?.scope || '';
        }
        if (values?.code) {
            requestData.code = values?.code || '';
        }
        if (values?.hasOwnProperty('is_code_required')) {
            requestData.is_code_required = values?.is_code_required || false;
        }
        if (Array.isArray(values?.products) && values?.products.length > 0) {
            requestData.products = values?.products;
        }
        if (Array.isArray(values?.categories) && values?.categories.length > 0) {
            requestData.categories = RequestHelpers.extractIdsFromArray(values?.categories || []);
        }
        return requestData;
    }
    async function handleSubmit(values: Discount) {

        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return false;
        }

        let response = null;
        let requestData: CreateDiscount | UpdateDiscount;
        switch (operation) {
            case 'edit':
            case 'update':
                if (!values?.id) {
                    throw new Error('Discount ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.discount,
                        values.id,
                        'update'
                    ]),
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: buildUpdateData(values),
                })
                break;
            case 'add':
            case 'create':
                if (Array.isArray(values?.discounts)) {
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.discount,
                        'store'
                    ]),
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: buildCreateData(values),
                })
                break;
            default:
                console.log('Invalid operation');
                return false;
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
        dataTableContext.refresh();
        dataTableContext.modal.close(CREATE_DISCOUNT_MODAL_ID);
        dataTableContext.modal.close(EDIT_DISCOUNT_MODAL_ID);
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
        ModalService.initializeModalWithForm({
            modalState: dataTableContext?.modal,
            id: modalId,
            operation: operation,
            initialValues: initialValues,
            requiredFields: getRequiredFields(),
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
                        <EditDiscountFields operation={operation} />
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
                                <EditDiscountFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditDiscount;