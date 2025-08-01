import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { UPDATE_ADDRESS_MODAL_ID, CREATE_ADDRESS_MODAL_ID, Address, CreateAddress, UpdateAddress, AddressRequestData } from "./ManageAddress";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditAddressFields from "./EditAddressFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { AppModalContext } from "@/contexts/AppModalContext";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContextType } from "@/components/Table/DataManager";
import { LocaleService } from "@/library/services/locale/LocaleService";


export type EditAddressProps = {
    type: 'billing' | 'shipping';
    data?: Address;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    fetchAddresses?: () => void;
    dataTable?: DataTableContextType;
}
function EditAddress({
    dataTable,
    fetchAddresses,
    type,
    data,
    operation = 'create',
    inModal = false,
    modalId,
}: EditAddressProps) {
    const modalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Address = {
        id: data?.id || 0,
        label: data?.label || '',
        address_line_1: data?.address_line_1 || '',
        address_line_2: data?.address_line_2 || '',
        city: data?.city || '',
        state: data?.state || '',
        postal_code: data?.postal_code || '',
        phone: data?.phone || '',
        country: data?.country || LocaleService.getCountry(),
        user: data?.user,
        type: data?.type || type,
        is_default: data?.is_default || false,
    };
    function buildRequestData(values: any) {
        let requestData: AddressRequestData = {};
        if (values?.label) {
            requestData.label = values.label;
        }
        if (values?.address_line_1) {
            requestData.address_line_1 = values.address_line_1;
        }
        if (values?.address_line_2) {
            requestData.address_line_2 = values.address_line_2;
        }
        if (values?.city) {
            requestData.city = values.city;
        }
        if (values?.state) {
            requestData.state = values.state;
        }
        if (values?.postal_code) {
            requestData.postal_code = values.postal_code;
        }
        if (values?.phone) {
            requestData.phone = values.phone;
        }
        requestData.country_id = values.country.id ;
        if (values.hasOwnProperty('is_default')) {
            requestData.is_default = values.is_default;
        }
        return requestData;
    }

    function buildCreateData(values: any) {
        if (!values?.type) {
            notificationContext.show({
                title: 'Error',
                message: 'Address type is invalid',
                variant: 'danger',
            }, 'invalid-address-type-notification');
            return false;
        }
        let requestData: CreateAddress = buildRequestData(values) as CreateAddress;
        requestData.type = values.type;
        return requestData;
    }

    function buildUpdateData(values: any) {
        let requestData: UpdateAddress = {
            id: values.id,
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        }
        return requestData;
    }

    async function handleSubmit(values: Address) {
        console.log('handleSubmit called with values:', values);
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return false;
        }


        let response = null;
        switch (operation) {
            case 'edit':
            case 'update':
                if (!data?.id) {
                    throw new Error('Product ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.address,
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
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.address,
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
            console.log('No response from API', truJobApiMiddleware.getErrors());
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
        notificationContext.show({
            title: 'Success',
            message: 'Address updated successfully',
            variant: 'success',
        }, 'address-update-success-notification');

        if (typeof fetchAddresses === 'function') {
            fetchAddresses();
        }
        return true;
    }


    useEffect(() => {
        if (!inModal) {
            return;
        }
        if (!modalId) {
            return;
        }

        ModalService.initializeModalWithForm({
            modalState: modalContext,
            id: modalId,
            operation: operation,
            initialValues: initialValues,
            requiredFields: {
                id: true
            },
            handleSubmit: handleSubmit,
        });
    }, [inModal, modalId]);


    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}
                <EditAddressFields operation={operation} />
            </div>
        </div>
    );
}
export default EditAddress;