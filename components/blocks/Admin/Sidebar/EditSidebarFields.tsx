import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import RoleForm from "../Role/RoleForm";
import { Role } from "@/types/Role";
import { Widget } from "@/types/Widget";
import SidebarWidgetForm from "../Sidebar/Widget/SidebarWidgetForm";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { isObjectEmpty } from "@/helpers/utils";
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
export type EditMenuFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
};
function EditSidebarFields({
    operation
}: EditMenuFields) {
    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [rolesModal, setRolesModal] = useState<RolesModal>({
        show: false,
        title: '',
        footer: true,
    });
    const [widgetModal, setWidgetModal] = useState<WidgetModal>({
        show: false,
        title: '',
        footer: true,
    });

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
                            <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={(e) => {
                                    setModalTitle('Manage Widgets', setWidgetModal);
                                    setModalFooter(true, setWidgetModal);
                                    showModal(setWidgetModal);
                                }}
                            >
                                Manage Widgets
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
                                    if (['edit', 'update'].includes(operation)) {
                                        if (!values?.id) {
                                            console.warn('Sidebar ID is required');
                                            return false;
                                        }
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: truJobApiConfig.endpoints.sidebar + '/' + values.id + '/role',
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
                                        setFieldValue('roles', response.data);
                                        return true;
                                    } else if (['add', 'create'].includes(operation)) {
                                        return true;
                                    }
                                    return false;
                                }}

                                onAdd={async (role: Role) => {
                                    if (!role) {
                                        return false;
                                    }
                                    if (['edit', 'update'].includes(operation)) {
                                        if (!values?.id) {
                                            console.warn('Sidebar ID is required');
                                            return false;
                                        }
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.sidebar}/${values.id}/role/${role.id}/create`,
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
                                        console.log('buildRoles', buildRoles);
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
                                            console.warn('Sidebar ID is required');
                                            return false;
                                        }
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.sidebar}/${values.id}/role/${role.id}/delete`,
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
                            </Modal.Footer>
                        }
                    </Modal>
                    <Modal show={widgetModal.show} onHide={() => hideModal(setWidgetModal)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{widgetModal?.title || ''}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <SidebarWidgetForm
                                operation={operation}
                                sidebarId={values?.id}
                                data={values?.widgets || []}
                                onChange={(widget: Array<Widget>) => {
                                    setFieldValue('widgets', widget);
                                }}
                            />
                        </Modal.Body>
                        {widgetModal.footer &&
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => hideModal(setWidgetModal)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        }
                    </Modal>
                </>

            </div>
        </div>
    );
}
export default EditSidebarFields;