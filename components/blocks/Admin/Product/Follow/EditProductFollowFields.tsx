import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../../User/ManageUser";


type EditProductFollowFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductFollowFields({
    operation
}: EditProductFollowFields) {
   
    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};
    const formHelpers = useFormikContext<FormikValues>() || {};
    console.log('values', values);

    return (
        <AccessControlComponent
        id="edit-product-follow-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
            ]}
        >
            <ManageUser
                isChild={true}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={(items: Array<any>) => {
                    if (!Array.isArray(items)) {
                        console.warn('Invalid values received from ManageUser component');
                        return;
                    }
                    const checked = items.filter((item) => item?.checked);
                    const existing = formHelpers?.values?.items || [];
                    formHelpers.setFieldValue('items', [
                        ...existing,
                        ...checked.filter((item) => {
                            return !existing.find((checkedItem) => checkedItem?.id === item?.id);
                        })
                    ]);
                }}
            />
        </AccessControlComponent>
    );
}
export default EditProductFollowFields;