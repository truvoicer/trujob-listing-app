import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import QuantityInput from "@/components/QuantityInput";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

type EditShippingMethodFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditShippingMethodFields({
    operation
}: EditShippingMethodFields) {
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
                            value={values?.carrier || ""}
                            onChange={handleChange}
                            placeholder="Enter carrier"
                            name="carrier"
                            type="text"
                            label="Carrier"
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
                        <div className="">
                            <label className="form-label" htmlFor="icon">
                                Procesing Time (Days)
                            </label>
                            <QuantityInput
                                value={values?.processing_time_days || 1}
                                min={1}
                                max={365}
                                onChange={(val) => setFieldValue('processing_time_days', val)}
                            />
                        </div>
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

                </div>
            </div>
        </div>
    );
}
export default EditShippingMethodFields;