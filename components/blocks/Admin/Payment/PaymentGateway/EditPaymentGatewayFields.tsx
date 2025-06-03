import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

type EditPaymentGatewayFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditPaymentGatewayFields({
    operation
}: EditPaymentGatewayFields) {
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
                        <TextInput
                            value={values?.name || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                            type="text"
                            name="name"
                            label="Name"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.description || ""}
                            onChange={handleChange}
                            placeholder="Enter description"
                            name="description"
                            type="text"
                            label="Description"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.icon || ""}
                            onChange={handleChange}
                            placeholder="Enter icon"
                            name="icon"
                            type="text"
                            label="Icon"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'is_active'}
                            placeholder="Is Active?"
                            label="Is Active?"
                            onChange={handleChange}
                            value={values?.is_active || false}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'is_default'}
                            placeholder="Is Default?"
                            label="Is Default?"
                            onChange={handleChange}
                            value={values?.is_default || false}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
export default EditPaymentGatewayFields;