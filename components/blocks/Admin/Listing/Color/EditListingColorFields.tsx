import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectColor from "./SelectColor";
import ManageColor from "../../Color/ManageColor";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";

type EditListingColorFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingColorFields({
    operation
}: EditListingColorFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const formHelpers = useFormikContext<FormikValues>() || {};


    return (
        <AccessControlComponent
        id="edit-listing-color-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageColor
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (colors: Array<any>) => {
                    if (!Array.isArray(colors)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checked = colors.filter((item) => item?.checked);

                    const existing = formHelpers?.values?.colors || [];
                    formHelpers.setFieldValue('colors', [
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
export default EditListingColorFields;