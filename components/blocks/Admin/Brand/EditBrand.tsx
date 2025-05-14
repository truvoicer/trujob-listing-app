import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_PAGE_MODAL_ID } from "./ManageBrand";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Listing } from "@/types/Listing";
import { Sidebar } from "@/types/Sidebar";
import EditBrandFields from "./EditBrandFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { Brand, CreateBrand, UpdateBrand } from "@/types/Brand";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type EditBrandProps = {
    listingId: number;
    data?: Brand;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditBrand({
    listingId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditBrandProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Brand = {
        id: data?.id || 0,
        label: data?.label || '',
        name: data?.name || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };


    function buildCreateData(values: Brand) {

        let requestData: CreateBrand = {
            name: values?.name || '',
            label: values?.label || '',
        };

        return requestData;
    }

    function buildUpdateData(values: Brand) {

        let requestData: UpdateBrand = {
            id: data?.id || 0,
            name: values?.name || '',
            label: values?.label || '',
        };

        return requestData;
    }
    async function handleSubmit(values: Brand) {

        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            DebugHelpers.log(DebugHelpers.WARN, 'No data to update');
            return;
        }
        
        if (!listingId) {
            DebugHelpers.log(DebugHelpers.WARN, 'Listing ID is required');
            return;
        }
        if (!values?.brand?.id) {
            DebugHelpers.log(DebugHelpers.WARN, 'Brand ID is required');
            return;
        }

        let response = null;
        let requestData: CreateBrand | UpdateBrand;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                DebugHelpers.log(DebugHelpers.DEBUG, 'edit requestData', requestData);

                if (!data?.id) {
                    throw new Error('Listing ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingBrand.replace(':listingId', listingId.toString()),
                        values.brand.id,
                        'update'
                    ]),
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                requestData = buildCreateData(values);
                DebugHelpers.log(DebugHelpers.DEBUG, 'create requestData', requestData);
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingBrand.replace(':listingId', listingId.toString()),
                        values.brand.id,
                        'create'
                    ]),
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            default:
                DebugHelpers.log(DebugHelpers.WARN, 'Invalid operation');
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
        dataTableContext.modal.close(EDIT_PAGE_MODAL_ID);

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
                        <EditBrandFields operation={operation} />
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
                                <EditBrandFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditBrand;