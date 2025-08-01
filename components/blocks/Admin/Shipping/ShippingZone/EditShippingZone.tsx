import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_SHIPPING_ZONE_ID } from "./ManageShippingZone";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditShippingZoneFields from "./EditShippingZoneFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { ShippingZone, CreateShippingZone, UpdateShippingZone, ShippingZoneAble, ShippingZoneAbleRequest } from "@/types/Shipping";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


export type EditShippingZoneProps = {
    data?: ShippingZone;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditShippingZone({
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditShippingZoneProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: ShippingZone = {
        id: data?.id || 0,
        label: data?.label || '',
        shipping_zoneables: data?.shipping_zoneables || [],
        is_active: data?.is_active || false,
        all: data?.all || false,
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildShippingZoneables(zoneables: ShippingZoneAble[]): ShippingZoneAbleRequest[] {
        return zoneables.map((zoneable) => ({
            shipping_zoneable_id: zoneable?.shipping_zoneable_id || 0,
            shipping_zoneable_type: zoneable?.shipping_zoneable_type || '',
        }));
    }

    function buildCreateData(values: ShippingZone) {

        const requestData: CreateShippingZone = {
            label: values?.label || '',
            shipping_zoneables: buildShippingZoneables(values?.shipping_zoneables || []),
            is_active: values?.is_active || false,
            all: values?.all || false,
        };

        return requestData;
    }

    function buildUpdateData(values: ShippingZone) {

        const requestData: UpdateShippingZone = {
            id: values?.id || 0,
        };
        if (values?.label) {
            requestData.label = values?.label || '';
        }
        if (values.hasOwnProperty('shipping_zoneables') && Array.isArray(values?.shipping_zoneables)) {
            requestData.shipping_zoneables = buildShippingZoneables(values?.shipping_zoneables || []);
        }
        // console.log('Update Shipping Zone Data:', values, requestData);
        if (values?.hasOwnProperty('is_active')) {
            requestData.is_active = values?.is_active || false;
        }
        if (values?.hasOwnProperty('all')) {
            requestData.all = values?.all || false;
        }
        return requestData;
    }
    async function handleSubmit(values: ShippingZone) {

        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return false;
        }
        
        let response = null;

        switch (operation) {
            case 'edit':
            case 'update':
                if (!values?.id) {
                    throw new Error('Shipping zone ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.shippingZone,
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
                if (Array.isArray(values?.shippingZones)) {
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.shippingZone,
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
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_SHIPPING_ZONE_ID, 'edit'));
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_SHIPPING_ZONE_ID, 'create'));
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
                        <EditShippingZoneFields operation={operation} />
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
                                <EditShippingZoneFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditShippingZone;