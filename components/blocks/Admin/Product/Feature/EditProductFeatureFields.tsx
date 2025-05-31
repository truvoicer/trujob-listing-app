import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectProductFeature from "./SelectProductFeature";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../../User/ManageUser";
import ManageFeature from "../../Feature/ManageFeature";

type EditProductFeatureFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductFeatureFields({
    operation
}: EditProductFeatureFields) {
    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formHelpers = useFormikContext<FormikValues>() || {};

    return (
        <AccessControlComponent
        id="edit-product-feature-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageFeature
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (features: Array<any>) => {
                    if (!Array.isArray(features)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checked = features.filter((item) => item?.checked);

                    const existing = formHelpers?.values?.features || [];
                    formHelpers.setFieldValue('features', [
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
export default EditProductFeatureFields;