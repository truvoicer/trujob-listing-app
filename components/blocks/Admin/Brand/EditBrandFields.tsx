import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import TextInput from "@/components/Elements/TextInput";

type EditBrandFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditBrandFields({
    operation
}: EditBrandFields) {
    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.label || ""}
                            onChange={handleChange}
                            placeholder="Enter label"
                            type="text"
                            name="label"
                            label="Label"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.name || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                            type="text"
                            name="name"
                            label="Name"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditBrandFields;