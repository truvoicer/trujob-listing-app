import { useContext, useState } from "react";
import SidebarForm from "../../Sidebar/SidebarForm";
import SelectPaginationTypes from "../SelectPaginationType";
import SelectPaginationScrollTypes from "../SelectPaginationScrollType";
import { DataTableContext } from "@/contexts/DataTableContext";
import { Sidebar } from "@/types/Sidebar";
import { FormikValues, useFormikContext } from "formik";
import { Button, Modal } from "react-bootstrap";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import RoleForm from "../../Role/RoleForm";

export type RoleModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export type SidebarModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
type EditPageBlockFieldsProps = {
    index: number;
    pageId?: number;
}
function EditPageBlockFields({
    index = 0,
    pageId
}: EditPageBlockFieldsProps) {

    const [roleModal, setRoleModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [sidebarModal, setSidebarModal] = useState<LocalModal>({
        show: false,
        title: '',
        footer: true,
    });
    

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};
    console.log("EditPageBlockFields", values);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="default"
                                id={"default" + index}
                                checked={values?.default || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'default' + index}>
                                Default?
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="nav_title"
                                id={"nav_title" + index}
                                onChange={handleChange}
                                value={values?.nav_title || ""} />
                            <label className="form-label" htmlFor={'nav_title' + index}>Nav Title</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="title"
                                id={"title" + index}
                                onChange={handleChange}
                                value={values?.title || ""} />
                            <label className="form-label" htmlFor={'title' + index}>Title</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="subtitle"
                                id={"subtitle" + index}
                                onChange={handleChange}
                                value={values?.subtitle || ""} />
                            <label className="form-label" htmlFor={'subtitle' + index}>Subtitle</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="background_image"
                                id={"background_image" + index}
                                onChange={handleChange}
                                value={values?.background_image || ""} />
                            <label className="form-label" htmlFor={'background_image' + index}>Background Image</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="background_color"
                                id={"background_color" + index}
                                onChange={handleChange}
                                value={values?.background_color || ""} />
                            <label className="form-label" htmlFor={'background_color' + index}>Background Color</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="pagination"
                                id={"pagination" + index}
                                checked={values?.pagination || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'pagination' + index}>
                                Pagination
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <SelectPaginationTypes
                            name="pagination_type"
                            value={values?.pagination_type}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <SelectPaginationScrollTypes
                            name="pagination_scroll_type"
                            value={values?.pagination_scroll_type}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <textarea
                                className="form-control"
                                name="content"
                                id={"content" + index}
                                onChange={handleChange}
                                value={values?.content || ""}></textarea>
                            <label className="form-label" htmlFor={'content' + index}>Content</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                name="has_sidebar"
                                id={"has_sidebar" + index}
                                checked={values?.has_sidebar || false}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label" htmlFor={'has_sidebar' + index}>
                                Has Sidebar
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <h4>Manage</h4>
                        <button
                            type="button"
                            className="btn btn-primary mr-2"
                            onClick={(e) => {
                                setModalTitle('Manage Roles', setRoleModal);
                                setModalFooter(true, setRoleModal);
                                showModal(setRoleModal);
                            }}
                        >
                            Manage Roles
                        </button>
                    </div>
                </div>

                <Modal show={roleModal.show} onHide={() => ModalService.hideModal(setRoleModal)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{roleModal?.title || ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RoleForm
                            data={values?.roles || []}
                            onChange={(roles: Array<Role>) => {
                                setSelectedRoles(roles);
                            }}
                            makeRequest={async () => {
                                if (!operation) {
                                    console.warn('No operation found');
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: truJobApiConfig.endpoints.widget + '/' + values.id + '/role',
                                            method: ApiMiddleware.METHOD.GET,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when getting roles');
                                        return false;
                                    }
                                    if (!response?.data) {
                                        console.warn('No data found');
                                        return false;
                                    }
                                    if (!Array.isArray(response?.data)) {
                                        console.warn('Response is not an array');
                                        return false;
                                    }
                                    setFieldValue('roles', response?.data);
                                    return true;
                                } else if (['create', 'add'].includes(operation)) {
                                    return true;
                                }
                                return false;
                            }}
                            onAdd={async (role: Role) => {
                                if (['edit', 'update'].includes(operation)) {
                                    if (!values?.id) {
                                        console.warn('Widget ID is required');
                                        return false;
                                    }
                                    if (!role) {
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.widget}/${values.id}/role/${role.id}/create`,
                                            method: ApiMiddleware.METHOD.POST,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    return true;
                                } else if (['add', 'create'].includes(operation)) {
                                    const buildRoles = [...values?.roles, role];
                                    setFieldValue('roles', buildRoles);
                                    return true;
                                }
                                console.warn('Invalid operation');
                                return false;
                            }}
                            onDelete={async (role: Role) => {
                                if (!role) {
                                    return false;
                                }
                                if (['edit', 'update'].includes(operation)) {
                                    if (!values?.id) {
                                        console.warn('Widget ID is required');
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.widget}/${values.id}/role/${role.id}/delete`,
                                            method: ApiMiddleware.METHOD.DELETE,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    return true;
                                } else if (['add', 'create'].includes(operation)) {
                                    const buildRoles = values.roles.filter((r: Role) => {
                                        return r.id !== role.id;
                                    });
                                    setFieldValue('roles', buildRoles);
                                    return true;
                                }
                                console.warn('Invalid operation');
                                return false;
                            }}
                        />
                    </Modal.Body>
                    {roleModal.footer &&
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => ModalService.hideModal(setRoleModal)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => {
                                // setFieldValue('roles', selectedRoles);
                                ModalService.hideModal(setRoleModal)
                            }}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>
            </div>
        </div>
    );
}
export default EditPageBlockFields;