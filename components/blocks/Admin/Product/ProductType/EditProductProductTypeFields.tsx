import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectProductType from "./SelectProductType";
import ManageProductType from "../../ProductType/ManageProductType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";

type EditProductProductTypeFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductProductTypeFields({
    operation
}: EditProductProductTypeFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formHelpers = useFormikContext<FormikValues>() || {};


    return (

        <AccessControlComponent
        id="edit-product-product-type-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageProductType
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
                    const checkedProductTypes = items.filter((item) => item?.checked);

                    const existingProductTypes = formHelpers?.values?.items || [];
                    formHelpers.setFieldValue('items', [
                        ...existingProductTypes,
                        ...checkedProductTypes.filter((item) => {
                            return !existingProductTypes.find((checkedItem) => checkedItem?.id === item?.id);
                        })
                    ]);
                }}
            />
        </AccessControlComponent>
    );
}
export default EditProductProductTypeFields;