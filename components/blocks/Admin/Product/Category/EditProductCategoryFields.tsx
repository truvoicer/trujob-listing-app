import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageCategory from "../../Category/ManageCategory";

type EditProductCategoryFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductCategoryFields({
    operation
}: EditProductCategoryFields) {

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formHelpers = useFormikContext<FormikValues>() || {};

    return (
        <AccessControlComponent
        id="edit-product-category-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageCategory
                isChild={true}
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (items: Array<any>) => {
                    if (!Array.isArray(items)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checkedCategories = items.filter((item) => item?.checked);

                    const existingCategories = formHelpers?.values?.items || [];
                    formHelpers.setFieldValue('items', [
                        ...existingCategories,
                        ...checkedCategories.filter((item) => {
                            return !existingCategories.find((checkedItem) => checkedItem?.id === item?.id);
                        })
                    ]);
                }}
            />
        </AccessControlComponent>
    );
}
export default EditProductCategoryFields;