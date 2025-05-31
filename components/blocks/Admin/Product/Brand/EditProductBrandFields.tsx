import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectBrand from "./SelectBrand";
import ManageBrand from "../../Brand/ManageBrand";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";

type EditProductBrandFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductBrandFields({
    operation
}: EditProductBrandFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formContext = useFormikContext<FormikValues>() || {};

    return (
        <AccessControlComponent
        id="edit-product-brand-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageBrand
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (brands: Array<any>) => {
                    if (!Array.isArray(brands)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checkedBrands = brands.filter((item) => item?.checked);
                    const existingBrands = formContext?.values?.brands || [];
                    formContext.setFieldValue('brands', [
                        ...existingBrands,
                        ...checkedBrands.filter((item) => {
                            return !existingBrands.find((checkedItem) => checkedItem?.id === item?.id);
                        })
                    ]);
                }}
            />
        </AccessControlComponent>
    );
}
export default EditProductBrandFields;