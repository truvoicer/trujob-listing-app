import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_SHIPPING_METHOD_ID } from "./ManageShippingMethod";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditShippingMethodFields from "./EditShippingMethodFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { ShippingMethod, CreateShippingMethod, UpdateShippingMethod } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { min } from "underscore";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


export type EditShippingMethodProps = {
    data?: ShippingMethod;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditShippingMethod({
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditShippingMethodProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: ShippingMethod = {
        id: data?.id || 0,
        carrier: data?.carrier || '',
        description: data?.description || '',
        processing_time_days: data?.processing_time_days || 0,
        display_order: data?.display_order || 0,
        is_active: data?.is_active || false,
        rates: data?.rates || [],
        restrictions: data?.restrictions || [],
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildRequestData(values: ShippingMethod) {
        let requestData: CreateShippingMethod | UpdateShippingMethod = {};
        if (values?.carrier) {
            requestData.carrier = values?.carrier || '';
        }
        if (values?.description) {
            requestData.description = values?.description || '';
        }
        if (values.hasOwnProperty('processing_time_days')) {
            requestData.processing_time_days = values?.processing_time_days || 0;
        }
        if (values.hasOwnProperty('is_active')) {
            requestData.is_active = values?.is_active || false;
        }
        if (Array.isArray(values?.rates)) {
            requestData.rates = buildShippingRates(values?.rates || []);
        }

        return requestData;
    }

    function buildShippingRates(rates: any[]) {
        return rates.map((rate) => {
            return {
                id: rate?.id || 0,
                shipping_method_id: rate?.shipping_method?.id || '',
                shipping_zone_id: rate?.shipping_zone?.id || '',
                type: rate?.type || '',
                amount: rate?.amount ? parseFloat(rate?.amount) || 0 : 0,
                weight_limit: rate?.weight_limit || false,
                height_limit: rate?.height_limit || false,
                length_limit: rate?.length_limit || false,
                width_limit: rate?.width_limit || false,
                min_weight: rate?.min_weight? parseFloat(rate?.min_weight) || 0 : 0,
                max_weight: rate?.max_weight ? parseFloat(rate?.max_weight) || 0 : 0,
                min_height: rate?.min_height ? parseFloat(rate?.min_height) || 0 : 0,  
                max_height: rate?.max_height ? parseFloat(rate?.max_height) || 0 : 0,
                min_length: rate?.min_length ? parseFloat(rate?.min_length) || 0 : 0,
                max_length: rate?.max_length ? parseFloat(rate?.max_length) || 0 : 0,
                min_width: rate?.min_width ? parseFloat(rate?.min_width) || 0 : 0,
                max_width: rate?.max_width ? parseFloat(rate?.max_width) || 0 : 0,
                currency_id: rate?.currency?.id || '',
                is_free_shipping_possible: rate?.is_free_shipping_possible || false,
            }
        });
    }

    function buildCreateData(values: ShippingMethod) {

        let requestData: CreateShippingMethod = {
            carrier: values?.carrier || '',
            description: values?.description || '',
            processing_time_days: values?.processing_time_days || 0,
            is_active: values?.is_active || false,
            rates: buildShippingRates(values?.rates || []),
        };

        return requestData;
    }

    function buildUpdateData(values: ShippingMethod) {

        let requestData: UpdateShippingMethod = {
            id: values?.id || 0,
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        }
        return requestData;
    }
    async function handleSubmit(values: ShippingMethod) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return false;
        }

        let response = null;

        switch (operation) {
            case 'edit':
                if (!values?.id) {
                    throw new Error('ShippingMethod ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.shippingMethod,
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
                if (Array.isArray(values?.shippingMethods)) {
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.shippingMethod,
                        'store'
                    ]),
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: buildCreateData(values),
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
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_SHIPPING_METHOD_ID, 'edit'));
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_SHIPPING_METHOD_ID, 'create'));
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
                        <EditShippingMethodFields operation={operation} />
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
                                <EditShippingMethodFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditShippingMethod;