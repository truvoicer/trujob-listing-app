import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectProductType from "./SelectProductType";
import ManageProductType from "../../ProductType/ManageProductType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";

type EditListingProductTypeFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingProductTypeFields({
    operation
}: EditListingProductTypeFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formHelpers = useFormikContext<FormikValues>() || {};


    return (

        <AccessControlComponent
        id="edit-listing-product-type-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageProductType
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (productTypes: Array<any>) => {
                    if (!Array.isArray(productTypes)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checkedProductTypes = productTypes.filter((item) => item?.checked);

                    const existingProductTypes = formHelpers?.values?.productTypes || [];
                    formHelpers.setFieldValue('productTypes', [
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
export default EditListingProductTypeFields;