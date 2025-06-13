import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_TAX_RATE_ID } from "./ManageTaxRate";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditTaxRateFields from "./EditTaxRateFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { TaxRate, CreateTaxRate, UpdateTaxRate, TaxRateRequest } from "@/types/Tax";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


export type EditTaxRateProps = {
    data?: TaxRate;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditTaxRate({
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditTaxRateProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: TaxRate = {
        id: data?.id || 0,
        name: data?.name || '',
        label: data?.label || '',
        type: data?.type || 'vat',
        amount_type: data?.amount_type || 'fixed',
        amount: data?.amount || null,
        rate: data?.rate || null,
        country: data?.country || 0,
        currency: data?.currency || 0,
        has_region: data?.has_region || false,
        region: data?.region || 0,
        is_default: data?.is_default || false,
        scope: data?.scope || 'all',
        is_active: data?.is_active || true,
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };


    function buildCreateData(values: TaxRate) {

        let requestData: CreateTaxRate = buildRequestData(values) as CreateTaxRate;
        return requestData;
    }

    function buildRequestData(values: TaxRate) {

        let requestData: TaxRateRequest = {};
        if (values?.name) {
            requestData.name = values.name;
        }
        if (values?.type) {
            requestData.type = values.type;
        }
        if (values?.amount_type) {
            requestData.amount_type = values.amount_type;
        }
        if (values?.amount !== undefined) {
            requestData.amount = values.amount;
        }
        if (values?.rate !== undefined) {
            requestData.rate = values.rate;
        }
        if (values?.country?.id) {
            requestData.country_id = values.country.id;
        }
        if (values?.currency?.id) {
            requestData.currency_id = values.currency.id;
        }
        if (values.hasOwnProperty('has_region')) {
            requestData.has_region = values.has_region;
        }
        if (values?.region?.id) {
            requestData.region_id = values.region.id;
        }
        if (values.hasOwnProperty('is_default')) {
            requestData.is_default = values.is_default;
        }
        if (values?.scope) {
            requestData.scope = values.scope;
        }
        if (values.hasOwnProperty('is_active')) {
            requestData.is_active = values.is_active;
        }
        return requestData;
    }

    function buildUpdateData(values: TaxRate) {

        let requestData: UpdateTaxRate = {
            id: values?.id || 0,
        };

        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }
    async function handleSubmit(values: TaxRate) {

        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return false;
        }

        let response = null;
        let requestData: CreateTaxRate | UpdateTaxRate;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', requestData);

                if (!values?.id) {
                    throw new Error('TaxRate ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.taxRate,
                        values.id,
                        'update'
                    ]),
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                if (Array.isArray(values?.taxRates)) {
                    return;
                } else {
                    requestData = buildCreateData(values);
                }
                console.log('create requestData', requestData);
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.taxRate,
                        'store'
                    ]),
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
            return false;
        }
        if (dataTable) {
            dataTable.refresh();
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_TAX_RATE_ID, 'edit'));
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_TAX_RATE_ID, 'create'));
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
                        <EditTaxRateFields operation={operation} />
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
                                <EditTaxRateFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditTaxRate;