import { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import RoleForm from "../Role/RoleForm";
import { Role } from "@/types/Role";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { FormikValues, useFormikContext } from "formik";

export type RolesModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export type WidgetModal = {
    show: boolean;
    title: string;
    footer: boolean;
};
export type EditWidgetFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
};
function EditWidgetFields({
    operation,
}: EditWidgetFields) {
    const [rolesModal, setRolesModal] = useState<RolesModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    function hideModal(setter: Dispatch<SetStateAction<{
        show: boolean;
        title: string;
        footer: boolean;
    }>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }
    function showModal(setter: Dispatch<SetStateAction<RolesModal | WidgetModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }
    function setModalTitle(title: string, setter: Dispatch<SetStateAction<RolesModal | WidgetModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }
    function setModalFooter(hasFooter: boolean = false, setter: Dispatch<SetStateAction<RolesModal | WidgetModal>>) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }
    const {
        values,
        errors,
        setFieldValue,
        handleChange,
    } = useFormikContext<FormikValues>() || {};
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <>
                    <div className="row">

                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={handleChange}
                                    value={values?.name || ""} />
                                <label className="form-label" htmlFor="name">Name</label>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    id="title"
                                    onChange={handleChange}
                                    value={values?.title || ""} />
                                <label className="form-label" htmlFor="title">
                                    Title
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
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="icon"
                                    id="icon"
                                    onChange={handleChange}
                                    value={values?.icon || ""} />
                                <label className="form-label" htmlFor="icon">
                                    Icon
                                </label>
                            </div>
                        </div>

                        <div className="col-12 my-3">
                            <h4>Manage</h4>
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    setModalTitle('Manage Roles', setRolesModal);
                                    setModalFooter(true, setRolesModal);
                                    showModal(setRolesModal);
                                }}
                            >
                                Manage Roles
                            </button>
                        </div>
                    </div>

                    <Modal show={rolesModal.show} onHide={() => hideModal(setRolesModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{rolesModal?.title || ''}</Modal.Title>
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
                        {rolesModal.footer &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => hideModal(setRolesModal)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => {
                                    setFieldValue('roles', selectedRoles);
                                    hideModal(setRolesModal)
                                }}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        }
                    </Modal>
                </>

            </div>
        </div>
    );
}
export default EditWidgetFields;