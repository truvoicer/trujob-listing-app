import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditListingTypeFields from "./EditListingTypeFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { CreateListingType, ListingType, UpdateListingType } from "@/types/ListingType";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { CREATE_LISTING_TYPE_MODAL_ID, EDIT_LISTING_TYPE_MODAL_ID } from "./ManageListingType";


export type EditListingTypeProps = {
    data?: ListingType;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingType({
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingTypeProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: ListingType = {
        id: data?.id || 0,
        name: data?.name || '',
        label: data?.label || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildCreateData(values: ListingType) {

        let requestData: CreateListingType = {
            name: values?.name || '',
            label: values?.label || '',
        };
        return requestData;
    }
    function buildUpdateData(values: ListingType) {

        let requestData: UpdateListingType = {
            id: values?.id || 0,
            name: values?.name || '',
            label: values?.label || '',
        };

        return requestData;
    }
    async function handleSubmit(values: ListingType) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return;
        }

        let response = null;
        let requestData: CreateListingType | UpdateListingType;
        switch (operation) {
            case 'edit':
            case 'update':

                if (!values?.id) {
                    console.log('Listing type ID is required');
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingType,
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
                if (Array.isArray(values?.listingTypes)) {
                    return;
                } else {
                    requestData = buildCreateData(values);
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingType,
                        'create',
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
                message: 'Error occurred while processing the request',
                type: 'danger',
            });
            return;
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(EDIT_LISTING_TYPE_MODAL_ID);
        dataTableContext.modal.close(CREATE_LISTING_TYPE_MODAL_ID);
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
                        <EditListingTypeFields operation={operation} />
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
                                <EditListingTypeFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditListingType;