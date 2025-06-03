import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import TextInput from "@/components/Elements/TextInput";

type EditReviewFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditReviewFields({
    operation
}: EditReviewFields) {
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
                            value={values?.review || ""}
                            onChange={handleChange}
                            placeholder="Enter review"
                            name="review"
                            type="text"
                            label="Review"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.rating || ""}
                            onChange={handleChange}
                            placeholder="Enter rating"
                            name="rating"
                            type="tel"
                            label="Rating"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
export default EditReviewFields;