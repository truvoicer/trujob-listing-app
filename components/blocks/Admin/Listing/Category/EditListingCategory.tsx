import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_LISTING_CATEGORY_MODAL_ID, EDIT_LISTING_CATEGORY_MODAL_ID } from "./ManageListingCategory";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Listing } from "@/types/Listing";
import { Sidebar } from "@/types/Sidebar";
import EditListingCategoryFields from "./EditListingCategoryFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { Category } from "@/types/Category";

export type EditListingCategoryProps = {
    data?: Listing;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingCategory({
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingCategoryProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Listing = {
        id: data?.id || 0,
        name: data?.name || '',
        title: data?.title || '',
        description: data?.description || '',
        active: data?.active || false,
        allow_offers: data?.allow_offers || false,
        quantity: data?.quantity || 0,
        listing_type: data?.listing_type || {
            id: data?.listing_type?.id || 0,
            name: data?.listing_type?.name || '',
            label: data?.listing_type?.label || '',
            description: data?.listing_type?.description || '',
        },
        listing_user: data?.listing_user || {
            id: data?.listing_user?.id || 0,
            first_name: data?.listing_user?.first_name || '',
            last_name: data?.listing_user?.last_name || '',
            username: data?.listing_user?.username || '',
            email: data?.listing_user?.email || '',
            created_at: data?.listing_user?.created_at || '',
            updated_at: data?.listing_user?.updated_at || '',
        },
        listing_follow: data?.listing_follow || [],
        listing_feature: data?.listing_feature || [],
        listing_review: data?.listing_review || [],
        listing_category: data?.listing_category || [],
        listing_brand: data?.listing_brand || [],
        listing_color: data?.listing_color || [],
        listing_product_type: data?.listing_product_type || [],
        media: data?.media || [],
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    async function handleSubmit(values: {categories: Array<Category>}) {
            if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
                console.warn('No data to update');
                return;
            }
            if (!data?.id) {
                console.log('Listing type ID is required');
                return;
            }
            if (!Array.isArray(values?.categories)) {
                return;
            }
            let response = null;
            let requestData = {
                ids: RequestHelpers.extractIdsFromArray(values?.categories),
            }
            switch (operation) {
                case 'add':
                case 'create':
                    console.log('create requestData', requestData);
                    response = await truJobApiMiddleware.resourceRequest({
                        endpoint: UrlHelpers.urlFromArray([
                            truJobApiConfig.endpoints.listingCategory.replace(
                                ':listingId',
                                data.id.toString(),
                            ),
                            'create',
                        ]),
                        method: ApiMiddleware.METHOD.POST,
                        protectedReq: true,
                        data: requestData,
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
            dataTableContext.modal.close(EDIT_LISTING_CATEGORY_MODAL_ID);
            dataTableContext.modal.close(CREATE_LISTING_CATEGORY_MODAL_ID);
    
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
                        <EditListingCategoryFields operation={operation} />
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
                                <EditListingCategoryFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditListingCategory;