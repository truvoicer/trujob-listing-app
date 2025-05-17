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
                    const checkedCategories = colors.filter((item) => item?.checked);

                    // setSelectedBrands(prevState => {
                    //     let cloneState = [...prevState];
                    //     return [
                    //         ...cloneState,
                    //         ...checkedBrands.filter((item) => {
                    //             return !cloneState.find((checkedItem) => checkedItem?.id === item?.id);
                    //         })
                    //     ];
                    // });
                    const existingCategories = data || [];
                    formHelpers.setFieldValue('colors', [
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
export default EditListingColorFields;