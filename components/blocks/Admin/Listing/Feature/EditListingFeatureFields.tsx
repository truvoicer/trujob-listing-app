import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectListingFeature from "./SelectListingFeature";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../../User/ManageUser";

type EditListingFeatureFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingFeatureFields({
    operation
}: EditListingFeatureFields) {
    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <SelectListingFeature
                            name="feature"
                            value={values?.feature}
                        />
                    </div>

                </div>

                {modalService.renderLocalModals()}
            </div>
        </div>
    );
}
export default EditListingFeatureFields;