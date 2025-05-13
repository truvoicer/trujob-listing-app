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
import { User } from "@/types/User";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { DebugHelpers } from "@/helpers/DebugHelpers";

export type EditListingFollowProps = {
    listingId?: number;
    data?: Array<User>;
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
}
function EditListingFollow({
    listingId,
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
        const initialValues: {
            users: Array<User>;
        } = {
            users: data || [],
        };
    
        async function handleSubmit(values: User) {
            if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
                DebugHelpers.log(DebugHelpers.WARN, 'No data to update');
                return;
            }
            
            
            if (!listingId) {
                DebugHelpers.log(DebugHelpers.WARN, 'Listing ID is required');
                return;
            }
            if (!values?.id) {
                DebugHelpers.log(DebugHelpers.WARN, 'Brand ID is required');
                return;
            }
    
            let response = null;
            switch (operation) {
                case 'edit':
                case 'update':
                    response = await truJobApiMiddleware.resourceRequest({
                        endpoint: UrlHelpers.urlFromArray([
                            truJobApiConfig.endpoints.listingFollow.replace(
                                ':listingId',
                                listingId.toString()
                            ),
                            values?.id,
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
                            truJobApiConfig.endpoints.listingFollow.replace(
                                ':listingId',
                                listingId.toString()
                            ),
                            values?.id,
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