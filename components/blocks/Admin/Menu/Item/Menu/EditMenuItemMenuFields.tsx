import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { Button, Modal } from "react-bootstrap";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import RoleForm from "../../../Role/RoleForm";
import MenuItemForm from "../ManageMenuItems";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Role } from "@/types/Role";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { MenuItem } from "@/types/Menu";

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
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="active"
                                id={"active" + index}
                                checked={values?.active || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'active' + index}>
                                Active?
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">

                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                id={"name" + index}
                                onChange={handleChange}
                                value={values?.name || ""} />
                            <label className="form-label" htmlFor={'name' + index}>
                                Name
                            </label>
                        </div>
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
                    </div>
                </div>
                
            </div>
        </div>
    );
}
export default EditMenuItemMenuFields;