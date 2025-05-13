import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { CreateListingReview, ListingReview, UpdateListingReview } from "@/types/Listing";
import EditListingReviewFields from "./EditListingReviewFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type EditListingReviewProps = {
    listingId?: number;
    data?: ListingReview;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingReview({
    listingId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingReviewProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: ListingReview = {
        id: data?.id || 0,
        user: data?.user || '',
        listing: data?.listing || '',
        rating: data?.rating || 0,
        review: data?.review || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildCreateData(values: ListingReview) {

        let requestData: CreateListingReview = {
            rating: values?.rating || 0,
            review: values?.review || '',
        };
        return requestData;
    }
    function buildUpdateData(values: ListingReview) {

        let requestData: UpdateListingReview = {
            id: values?.id || 0,
            rating: values?.rating || 0,
            review: values?.review || '',
        };

        return requestData;
    }
    async function handleSubmit(values: ListingReview) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            DebugHelpers.log(DebugHelpers.WARN, 'No data to update');
            return;
        }


        if (!listingId) {
            DebugHelpers.log(DebugHelpers.WARN, 'Listing ID is required');
            return;
        }
        if (!values?.review?.id) {
            DebugHelpers.log(DebugHelpers.WARN, 'Review ID is required');
            return;
        }

        let response = null;
        let requestData: CreateListingReview | UpdateListingReview;
        switch (operation) {
            case 'edit':
            case 'update':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingReview.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.review?.id,
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
                        truJobApiConfig.endpoints.listingReview.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.review?.id,
                        'create',
                    ]),
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                })
                break;
            default:
                DebugHelpers.log(DebugHelpers.WARN, 'Invalid operation');
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
                            <EditListingReviewFields operation={operation} />
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
                                    <EditListingReviewFields operation={operation} />
                                )
                            }}
                        </Form>
                    )}
                </div>
            </div>
        );
    }
    export default EditListingReview;