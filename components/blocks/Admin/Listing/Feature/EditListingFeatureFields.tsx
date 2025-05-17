import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectListingFeature from "./SelectListingFeature";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../../User/ManageUser";
import ManageFeature from "../../Feature/ManageFeature";

type EditListingFeatureFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingFeatureFields({
    operation
}: EditListingFeatureFields) {
    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formHelpers = useFormikContext<FormikValues>() || {};

    return (
        <AccessControlComponent
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
                    const checkedFeatures = features.filter((item) => item?.checked);

                    // setSelectedBrands(prevState => {
                    //     let cloneState = [...prevState];
                    //     return [
                    //         ...cloneState,
                    //         ...checkedBrands.filter((item) => {
                    //             return !cloneState.find((checkedItem) => checkedItem?.id === item?.id);
                    //         })
                    //     ];
                    // });
                    const existingFeatures = data || [];
                    formHelpers.setFieldValue('features', [
                        ...existingFeatures,
                        ...checkedFeatures.filter((item) => {
                            return !existingFeatures.find((checkedItem) => checkedItem?.id === item?.id);
                        })
                    ]);
                }}
            />
        </AccessControlComponent>
    );
}
export default EditListingFeatureFields;