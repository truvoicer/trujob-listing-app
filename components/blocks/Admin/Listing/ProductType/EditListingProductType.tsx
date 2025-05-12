import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditListingProductTypeFields from "./EditListingProductTypeFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { CreateProductType, ProductType, UpdateProductType } from "@/types/ProductType";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export type EditListingProductTypeProps = {
    listingId?: number;
    data?: ProductType;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingProductType({
    listingId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingProductTypeProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: ProductType = {
        id: data?.id || 0,
        name: data?.name || '',
        label: data?.label || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildCreateData(values: ProductType) {

        let requestData: CreateProductType = {
            name: values?.name || '',
            label: values?.label || '',
        };
        return requestData;
    }
    function buildUpdateData(values: ProductType) {

        let requestData: UpdateProductType = {
            id: values?.id || 0,
            name: values?.name || '',
            label: values?.label || '',
        };

        return requestData;
    }
    async function handleSubmit(values: ProductType) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }


        if (!listingId) {
            console.warn('Listing ID is required');
            return;
        }
        if (!values?.product_type?.id) {
            console.warn('Product type ID is required');
            return;
        }

        let response = null;
        let requestData: CreateProductType | UpdateProductType;
        switch (operation) {
            case 'edit':
            case 'update':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingProductType.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.product_type?.id,
                        'update',
                    ]),
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                })
                break;
            case 'add':
            case 'create':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingProductType.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.product_type?.id,
                        'create',
                    ]),
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                })
                break;
            default:
                console.warn('Invalid operation');
                break;
        }
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
                            <EditListingProductTypeFields operation={operation} />
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
                                    <EditListingProductTypeFields operation={operation} />
                                )
                            }}
                        </Form>
                    )}
                </div>
            </div>
        );
    }
    export default EditListingProductType;