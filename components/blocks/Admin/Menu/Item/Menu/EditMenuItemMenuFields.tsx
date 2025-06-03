import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal } from "@/library/services/modal/ModalService";
import { Role } from "@/types/Role";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { MenuItem } from "@/types/Menu";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

type EditMenuItemMenuFieldsProps = {
    menuId?: number;
    index?: number;
    pageId?: number;
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditMenuItemMenuFields({
    menuId,
    index = 0,
    pageId,
    operation,
}: EditMenuItemMenuFieldsProps) {

    const [roleModal, setRoleModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [menuItemModal, setMenuItemModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });

    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState<Array<MenuItem>>([]);

    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'active'}
                            placeholder="Active?"
                            label="Active?"
                            onChange={handleChange}
                            value={values?.active || false}
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
                    <div className="col-12 col-lg-6">

                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="ul_class"
                                id={"ul_class" + index}
                                onChange={handleChange}
                                value={values?.ul_class || ""} />
                            <label className="form-label" htmlFor={'ul_class' + index}>UL Class</label>
                        </div>
                        <TextInput
                            value={values?.ul_class || ""}
                            onChange={handleChange}
                            placeholder="Enter UL Class"
                            type="text"
                            name="ul_class"
                            label="UL Class"
                        />
                    </div>
                </div>
                
            </div>
        </div>
    );
}
export default EditMenuItemMenuFields;