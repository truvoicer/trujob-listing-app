import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectCategory from "./SelectCategory";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageCategory from "../../Category/ManageCategory";

type EditProductCategoryFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductCategoryFields({
    operation
}: EditProductCategoryFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

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
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (categories: Array<any>) => {
                    if (!Array.isArray(categories)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checkedCategories = categories.filter((item) => item?.checked);

                    const existingCategories = formHelpers?.values?.categories || [];
                    formHelpers.setFieldValue('categories', [
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