import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { CreateProductReview, ProductReview, UpdateProductReview } from "@/types/Product";
import EditProductReviewFields from "./EditProductReviewFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { UrlHelpers } from "@/helpers/UrlHelpers";

import { FormikValues } from "formik";
import { ADD_PRODUCT_REVIEW_MODAL_ID, EDIT_PRODUCT_REVIEW_MODAL_ID } from "./ManageProductReview";

export type EditProductReviewProps = {
    productId?: number;
    data?: ProductReview;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditProductReview({
    productId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditProductReviewProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: ProductReview = {
        id: data?.id || 0,
        user: data?.user || '',
        product: data?.product || '',
        rating: data?.rating || 0,
        review: data?.review || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildCreateData(values: ProductReview) {

        let requestData: CreateProductReview = {
            rating: values?.rating || 0,
            review: values?.review || '',
        };
        return requestData;
    }
    function buildUpdateData(values: ProductReview) {

        let requestData: UpdateProductReview = {
            id: values?.id || 0,
            rating: values?.rating || 0,
            review: values?.review || '',
        };

        return requestData;
    }
    async function handleSubmit(values: ProductReview) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }


        if (!productId) {
            console.warn('Product ID is required');
            return;
        }

        let response = null;
        
        switch (operation) {
            case 'edit':
            case 'update':
                if (!values?.id) {
                    console.warn('Product review ID is required');
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.productReview.replace(
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
                        truJobApiConfig.endpoints.productReview.replace(
                            ':productId',
                            productId.toString()
                        ),
                        values?.id,
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
                        <strong>Success!</strong> Product review has been updated.
                    </div>
                ),
                type: 'success',
            });
        } 
        dataTableContext?.modal?.close(ADD_PRODUCT_REVIEW_MODAL_ID);
        dataTableContext?.modal?.close(EDIT_PRODUCT_REVIEW_MODAL_ID);
        dataTableContext?.refresh();
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
            requiredFields: getRequiredFields(),
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
                        <EditProductReviewFields operation={operation} />
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
                                <EditProductReviewFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditProductReview;