import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectFeature from "./SelectFeature";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../User/ManageUser";

type EditFeatureFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditFeatureFields({
    operation
}: EditFeatureFields) {
    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <SelectFeature
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
export default EditFeatureFields;