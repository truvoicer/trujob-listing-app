import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { MANAGE_MEDIA_ID } from "./ManageMedia";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Product } from "@/types/Product";
import EditMediaFields from "./EditMediaFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


export type EditMediaProps = {
    data?: Product;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditMedia({
    dataTable,
    data,
    operation,
    inModal = false,
    modalId,
}: EditMediaProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Product = {
        id: data?.id || 0,
        name: data?.name || '',
        title: data?.title || '',
        description: data?.description || '',
        active: data?.active || false,
        allow_offers: data?.allow_offers || false,
        quantity: data?.quantity || 0,
        product_type: data?.product_type || {
            id: data?.product_type?.id || 0,
            name: data?.product_type?.name || '',
            label: data?.product_type?.label || '',
            description: data?.product_type?.description || '',
        },
        product_user: data?.product_user || {
            id: data?.product_user?.id || 0,
            first_name: data?.product_user?.first_name || '',
            last_name: data?.product_user?.last_name || '',
            username: data?.product_user?.username || '',
            email: data?.product_user?.email || '',
            created_at: data?.product_user?.created_at || '',
            updated_at: data?.product_user?.updated_at || '',
        },
        product_follow: data?.product_follow || [],
        product_feature: data?.product_feature || [],
        product_review: data?.product_review || [],
        product_category: data?.product_category || [],
        product_brand: data?.product_brand || [],
        product_color: data?.product_color || [],
        product_product_type: data?.product_product_type || [],
        media: data?.media || [],
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildRequestData(values: Product) {
        let requestData: Product = {
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

    function buildCreateData(values: Product) {

        let requestData: CreateMenuItem = {
            type: values?.type || '',
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }

    function buildUpdateData(values: Product) {

        let requestData: CreateMenuItem = {
            type: values?.type || '',
        };
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };

        return requestData;
    }
    async function handleSubmit(values: Product) {

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
        //     requestData.blocks = requestData?.blocks.map((block: ProductBlock) => {
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
                    throw new Error('Product ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.product}/${data.id}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.product}/create`,
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
        if (dataTable) {
            dataTable.refresh();
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_MEDIA_ID, 'edit'));
        dataTableContext.modal.close(DataManagerService.getId(MANAGE_MEDIA_ID, 'create'));

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
                        <EditMediaFields operation={operation} />
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
                                <EditMediaFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditMedia;