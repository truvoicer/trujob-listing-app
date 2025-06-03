import Form from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { CREATE_PRODUCT_FEATURE_MODAL_ID, EDIT_PRODUCT_FEATURE_MODAL_ID } from "./ManageProductFeature";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Product, ProductFeature } from "@/types/Product";
import { Sidebar } from "@/types/Sidebar";
import EditProductFeatureFields from "./EditProductFeatureFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { Feature } from "@/types/Feature";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DataTableContextType } from "@/components/Table/DataManager";

export type EditProductFeatureProps = {
    productId?: number;
    data?: Product;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    dataTable?: DataTableContextType;
}
function EditProductFeature({
    dataTable,
    productId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditProductFeatureProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: {
        features: Array<Feature>;
    } = {
        features: data?.features || [],
    };

    async function handleSubmit(values: { features: Array<Feature> }) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.warn('No data to update');
            return;
        }

        if (!productId) {
            console.log('Product ID is required');
            return;
        }
        if (!Array.isArray(values?.features)) {
            console.warn('Invalid values received');
            return;
        }
        let response = null;
        let requestData = {
            ids: RequestHelpers.extractIdsFromArray(values?.features),
        }
        switch (operation) {
            case 'add':
            case 'create':
            case 'edit':
            case 'update':
                console.log('create requestData', requestData);
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.productFeature.replace(
                            ':productId',
                            productId.toString(),
                        ),
                        'store',
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
        if (dataTable) {
            dataTable.refresh();
        }
        dataTableContext.refresh();
        dataTableContext.modal.close(EDIT_PRODUCT_FEATURE_MODAL_ID);
        dataTableContext.modal.close(CREATE_PRODUCT_FEATURE_MODAL_ID);
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

        dataTableContext.modal.update(
            {
                formProps: {
                    operation: operation,
                    initialValues: initialValues,
                    requiredFields: getRequiredFields(),
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
                        <EditProductFeatureFields operation={operation} />
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
                                <EditProductFeatureFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditProductFeature;