import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";

type EditListingReviewFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingReviewFields({
    operation
}: EditListingReviewFields) {
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
                                name="review"
                                id="review"
                                onChange={handleChange}
                                value={values?.review || ""} />
                            <label className="form-label" htmlFor="title">
                                Review
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="rating"
                                id="rating"
                                onChange={handleChange}
                                value={values?.rating || ""} />
                            <label className="form-label" htmlFor="rating">
                                Rating
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditListingReviewFields;