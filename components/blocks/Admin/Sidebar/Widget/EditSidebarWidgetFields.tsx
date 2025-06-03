import { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import RoleForm from "@/components/blocks/Admin/Role/RoleForm";
import { Role } from "@/types/Role";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";


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
export type EditSidebarWidgetFields = {
    sidebarId?: number;
    operation: 'edit' | 'update' | 'add' | 'create';
};
function EditSidebarWidgetFields({
    sidebarId,
    operation,
}: EditSidebarWidgetFields) {
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
                            <TextInput
                                value={values?.name || ""}
                                onChange={handleChange}
                                placeholder="Enter name"
                                name="name"
                                type="text"
                                label="Name"
                            />
                        </div>

                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.title || ""}
                                onChange={handleChange}
                                placeholder="Enter title"
                                name="title"
                                type="text"
                                label="Title"
                            />
                        </div>

                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.description || ""}
                                onChange={handleChange}
                                placeholder="Enter description"
                                name="description"
                                type="text"
                                label="Description"
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.icon || ""}
                                onChange={handleChange}
                                placeholder="Enter icon"
                                name="icon"
                                type="text"
                                label="Icon"
                            />
                        </div>
                        <div className="col-12 col-lg-6">
                            <Checkbox
                                name={'has_container'}
                                placeholder="Has Container?"
                                label="Has Container?"
                                onChange={handleChange}
                                value={values?.has_container || false}
                            />
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
                                operation={operation}
                                data={values?.roles || []}
                                onChange={(roles) => {
                                    if (['add', 'create'].includes(operation || '')) {
                                        setFieldValue('roles', roles);
                                    }
                                }}
                                makeRequest={async () => {
                                    if (!operation) {
                                        console.log('No operation found');
                                        return false;
                                    }
                                    if (['edit', 'update'].includes(operation)) {
                                        if (!sidebarId) {
                                            return false;
                                        }
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString()) + '/' + values.id + '/role',
                                                method: ApiMiddleware.METHOD.GET,
                                                protectedReq: true,
                                            })
                                        if (!response) {
                                            console.log('No response from API when getting roles');
                                            return false;
                                        }
                                        if (!response?.data) {
                                            console.log('No data found');
                                            return false;
                                        }
                                        if (!Array.isArray(response?.data)) {
                                            console.log('Response is not an array');
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
                                        if (!sidebarId) {
                                            return false;
                                        }
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${values.id}/role/${role.id}/create`,
                                                method: ApiMiddleware.METHOD.POST,
                                                protectedReq: true,
                                            })
                                        if (!response) {
                                            console.log('No response from API when adding role');
                                            return false;
                                        }
                                        return true;
                                    } else if (['add', 'create'].includes(operation || '')) {
                                        let roles = values?.roles || [];
                                        setFieldValue('roles', [...roles, role]);
                                        return true;
                                    }
                                    return false;
                                }}
                                onDelete={async (role: Role) => {
                                    if (!role) {
                                        return false;
                                    }
                                    if (['edit', 'update'].includes(operation)) {
                                        if (!sidebarId) {
                                            return false;
                                        }
                                        const response = await TruJobApiMiddleware.getInstance()
                                            .resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${values.id}/role/${role.id}/delete`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true,
                                            })
                                        if (!response) {
                                            console.log('No response from API when adding role');
                                            return false;
                                        }
                                        return true;
                                    } else if (['add', 'create'].includes(operation)) {
                                        return true;
                                    }
                                    console.log('Invalid operation');
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
                </>

            </div>
        </div>
    );
}
export default EditSidebarWidgetFields;