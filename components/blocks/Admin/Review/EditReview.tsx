import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_REVIEW_MODAL_ID } from "./ManageReview";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import EditReviewFields from "./EditReviewFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { Review, CreateReview, UpdateReview } from "@/types/Review";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";


export type EditReviewProps = {
    data?: Review;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    dataTable?: DataTableContextType;
    modalId?: string;
}
function EditReview({
    dataTable,
    data,
    operation = 'create',
    inModal = false,
    modalId,
}: EditReviewProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Review = {
        id: data?.id || 0,
        review: data?.review || '',
        rating: data?.rating || 1,
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };


    function buildCreateData(values: Review) {

        let requestData: CreateReview = {
            review: values?.review || '',
            rating: values?.rating || 1,
        };

        return requestData;
    }

    function buildUpdateData(values: Review) {

        let requestData: UpdateReview = {
            id: data?.id || 0,
        };
        if (values?.review) {
            requestData.review = values?.review || '';
        }
        if (values.hasOwnProperty('rating')) {
            requestData.rating = values?.rating || 1;
        }

        return requestData;
    }
    async function handleSubmit(values: Review) {

        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return;
        }

        if (!values?.id) {
            console.log('Review ID is required');
            return;
        }

        let response = null;
        let requestData: CreateReview | UpdateReview;
        switch (operation) {
            case 'edit':
            case 'update':
                if (!data?.id) {
                    throw new Error('Product ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.review,
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
                if (Array.isArray(values?.reviews)) {
                    return;
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.review,
                        values.id,
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
        dataTableContext.modal.close(EDIT_REVIEW_MODAL_ID);

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
                        <EditReviewFields operation={operation} />
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
                                <EditReviewFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditReview;