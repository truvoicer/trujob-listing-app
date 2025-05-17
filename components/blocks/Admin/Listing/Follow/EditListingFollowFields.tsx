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
    const formHelpers = useFormikContext<FormikValues>() || {};
    console.log('values', values);

    return (
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
                onChange={(users: Array<any>) => {
                    if (!Array.isArray(users)) {
                        console.warn('Invalid values received from ManageUser component');
                        return;
                    }
                    formHelpers.setFieldValue('users', users.filter((item) => item?.checked));
                }}
            />
        </AccessControlComponent>
    );
}
export default EditListingFollowFields;