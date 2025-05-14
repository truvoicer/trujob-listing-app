import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import { Listing } from "@/types/Listing";
import EditColorFields from "./EditColorFields";
import { ModalService } from "@/library/services/modal/ModalService";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { CreateColor, UpdateColor } from "@/types/Color";
import { Color } from "react-bootstrap/esm/types";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type EditColorProps = {
    listingId?: number;
    data?: Listing;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditColor({
    listingId,
    data,
    operation,
    inModal = false,
    modalId,
}: EditColorProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();
    const initialValues: Color = {
        id: data?.id || 0,
        name: data?.name || '',
        label: data?.label || '',
        created_at: data?.created_at || '',
        updated_at: data?.updated_at || '',
    };

    function buildCreateData(values: Color) {

        let requestData: CreateColor = {
            name: values?.name || '',
            label: values?.label || '',
        };
        return requestData;
    }
    function buildUpdateData(values: Color) {

        let requestData: UpdateColor = {
            id: values?.id || 0,
            name: values?.name || '',
            label: values?.label || '',
        };

        return requestData;
    }
    async function handleSubmit(values: Color) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            DebugHelpers.log(DebugHelpers.WARN, 'No data to update');
            return;
        }


        if (!listingId) {
            DebugHelpers.log(DebugHelpers.WARN, 'Listing ID is required');
            return;
        }
        if (!values?.color?.id) {
            DebugHelpers.log(DebugHelpers.WARN, 'Brand ID is required');
            return;
        }

        let response = null;
        let requestData: CreateColor | UpdateColor;
        switch (operation) {
            case 'edit':
            case 'update':
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: UrlHelpers.urlFromArray([
                        truJobApiConfig.endpoints.listingColor.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.color?.id,
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
                        truJobApiConfig.endpoints.listingColor.replace(
                            ':listingId',
                            listingId.toString()
                        ),
                        values?.color?.id,
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
                        <EditColorFields operation={operation} />
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
                                <EditColorFields operation={operation} />
                            )
                        }}
                    </Form>
                )}
            </div>
        </div>
    );
}
export default EditColor;