import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../../User/ManageUser";

type EditListingFollowFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingFollowFields({
    operation
}: EditListingFollowFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    modalService.setUseStateHook(useState)
    modalService.setConfig([
        {
            id: 'listingUser',
            title: 'Select User',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageUser
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                setFieldValue('follows', selectedTableRows);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
    ]);
    

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 my-3">
                        <h4>Select User</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingUser',
                            'Select User',
                        )}
                    </div>
                </div>

                {modalService.renderLocalModals()}
            </div>
        </div>
    );
}
export default EditListingFollowFields;