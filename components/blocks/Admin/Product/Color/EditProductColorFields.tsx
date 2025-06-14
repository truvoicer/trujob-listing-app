import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectColor from "./SelectColor";
import ManageColor from "../../Color/ManageColor";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";

type EditProductColorFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductColorFields({
    operation
}: EditProductColorFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formHelpers = useFormikContext<FormikValues>() || {};


    return (
        <AccessControlComponent
        id="edit-product-color-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageColor
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
export default EditProductColorFields;