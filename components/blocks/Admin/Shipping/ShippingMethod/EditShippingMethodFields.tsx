import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import QuantityInput from "@/components/QuantityInput";

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
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="carrier"
                                id="carrier"
                                onChange={handleChange}
                                value={values?.carrier || ""} />
                            <label className="form-label" htmlFor="carrier">
                                Carrier
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="description"
                                id="description"
                                onChange={handleChange}
                                value={values?.description || ""} />
                            <label className="form-label" htmlFor="description">
                                Description
                            </label>
                        </div>
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
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                onChange={handleChange}
                                checked={values?.is_active || false} />
                            <label className="custom-control-label" htmlFor="is_active">
                                Is Active
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default EditShippingMethodFields;