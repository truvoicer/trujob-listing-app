import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_PAGE_MODAL_ID } from "./ManageListingFollow";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Listing } from "@/types/Listing";
import { Sidebar } from "@/types/Sidebar";
import EditListingFollowFields from "./EditListingFollowFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";

export type EditListingFollowProps = {
    data?: Listing;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingFollow({
    data,
    operation,
    inModal = false,
    modalId,
}: EditListingFollowProps) {

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

    function buildRequestData(values: Listing) {
        let requestData: Listing = {
        };
        if (values.hasOwnProperty('active')) {
            requestData.active = values.active;
        }
        if (values.hasOwnProperty('name')) {
            requestData.name = values.name;
        }
        if (values.hasOwnProperty('title')) {
            requestData.title = values.title;
        }
        if (values.hasOwnProperty('description')) {
            requestData.description = values.description;
        }
        if (values.hasOwnProperty('allow_offers')) {
            requestData.allow_offers = values.allow_offers;
        }
        if (values.hasOwnProperty('quantity')) {
            requestData.quantity = values.quantity;
        }
        if (values.hasOwnProperty('type')) {
            requestData.type = values.type.id;
        }
        if (values.hasOwnProperty('user')) {
            requestData.user = values.user.id;
        }
        if (Array.isArray(values?.follow_users)) {
            requestData.follows = RequestHelpers.extractIdsFromArray(values.follow_users);
        }
        if (Array.isArray(values?.features)) {
            requestData.features = RequestHelpers.extractIdsFromArray(values.features);
        }
        if (Array.isArray(values?.reviews)) {
            requestData.reviews = values.reviews;
        }
        if (Array.isArray(values?.categories)) {
            requestData.categories = RequestHelpers.extractIdsFromArray(values.categories);
        }
        if (Array.isArray(values?.brands)) {
            requestData.brands = RequestHelpers.extractIdsFromArray(values.brands);
        }
        if (Array.isArray(values?.colors)) {
            requestData.colors = RequestHelpers.extractIdsFromArray(values.colors);
        }
        if (Array.isArray(values?.product_types)) {
            requestData.product_types = RequestHelpers.extractIdsFromArray(values.product_types);
        }
        if (Array.isArray(values?.media)) {
            requestData.media = [];
        }
        return requestData;
    }

    function buildCreateData(values: Listing) {

        let requestData: CreateMenuItem = {
            type: values?.type || '',
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }

    function buildUpdateData(values: Listing) {

        let requestData: CreateMenuItem = {
            type: values?.type || '',
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }
    async function handleSubmit(values: Listing) {

        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }
        // if (Array.isArray(values?.roles)) {
        //     requestData.roles = RequestHelpers.extractIdsFromArray(values.roles);
        // }
        // if (Array.isArray(requestData?.sidebars)) {
        //     requestData.sidebars = requestData?.sidebars.filter((sidebar: Sidebar) => {
        //         return sidebar?.id;
        //     })
        //         .map((sidebar: Sidebar) => {
        //             return sidebar.id;
        //         });
        // }
        // if (Array.isArray(requestData?.blocks)) {
        //     requestData.blocks = requestData?.blocks.map((block: ListingBlock) => {
        //         if (Array.isArray(block?.sidebars)) {
        //             block.sidebars = RequestHelpers.extractIdsFromArray(block.sidebars);
        //         }
        //         if (Array.isArray(block?.roles)) {
        //             block.roles = RequestHelpers.extractIdsFromArray(block.roles);
        //         }
        //         return block;
        //     });
        // }

        let response = null;
        let requestData: CreateMenu | UpdateMenu;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', requestData);
                if (!data?.id) {
                    throw new Error('Listing ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.listing}/${data.id}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                requestData = buildCreateData(values);
                console.log('create requestData', requestData);
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.listing}/create`,
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
        dataTableContext.modal.close(EDIT_PAGE_MODAL_ID);

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
                        <EditListingFollowFields operation={operation} />
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
                                <EditListingFollowFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditListingFollow;