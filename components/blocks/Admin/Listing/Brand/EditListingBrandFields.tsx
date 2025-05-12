import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectBrand from "./SelectBrand";

type EditListingBrandFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingBrandFields({
    operation
}: EditListingBrandFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <SelectBrand
                            name="brand"
                            value={values?.brand}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
export default EditListingBrandFields;