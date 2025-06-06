import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_SHIPPING_RATE_MODAL_ID, EDIT_SHIPPING_RATE_MODAL_ID } from "./ManageShippingRate";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditShippingRateFields from "./EditShippingRateFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { ShippingRate, CreateShippingRate, UpdateShippingRate } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";


export type EditShippingRateProps = {
    data?: ShippingRate;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditShippingRate({
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditShippingRateProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: ShippingRate = {
        id: data?.id || 0,
        shipping_method: data?.shipping_method || '',
        shipping_zone: data?.shipping_zone || '',
        type: data?.type || '',
        min_amount: data?.min_amount || 0,
        max_amount: data?.max_amount || 0,
        amount: data?.amount || 0,
        currency: data?.currency || '',
        is_free_shipping_possible: data?.is_free_shipping_possible || false,
        zone: data?.zone || null,
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };


    function buildCreateData(values: ShippingRate) {

        let requestData: CreateShippingRate = {
            name: values?.name || '',
            country_ids: RequestHelpers.extractIdsFromArray(values?.countries || []),
            is_active: values?.is_active || false,
        };
        if (values?.zone?.id) {
            requestData.zone_id = values?.zone?.id || 0;
        }
        return requestData;
    }

    function buildUpdateData(values: ShippingRate) {

        let requestData: UpdateShippingRate = {
            id: values?.id || 0,
        };
        if (values?.name) {
            requestData.name = values?.name || '';
        }
        if (Array.isArray(values?.countries) && values?.countries.length > 0) {
            requestData.country_ids = RequestHelpers.extractIdsFromArray(values?.countries || []);
        }
        if (values?.hasOwnProperty('is_active')) {
            requestData.is_active = values?.is_active || false;
        }
        if (values?.zone?.id) {
            requestData.zone_id = values?.zone?.id || 0;
        }
        return requestData;
    }
    async function handleSubmit(values: ShippingRate) {
        console.log('handleSubmit', values);
        return;
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return;
        }

        let response = null;
        let requestData: CreateShippingRate | UpdateShippingRate;
        switch (operation) {
            case 'edit':
            case 'update':
                if (!values?.id) {
                    throw new Error('Shipping rate ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.shippingMethodRate,
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
                if (Array.isArray(values?.shippingRates)) {
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.shippingMethodRate,
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
            return;
        }
        if (dataTable) {
            dataTable.refresh();
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(CREATE_SHIPPING_RATE_MODAL_ID);
        dataTableContext.modal.close(EDIT_SHIPPING_RATE_MODAL_ID);
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
                        <EditShippingRateFields operation={operation} />
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
                                <EditShippingRateFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditShippingRate;