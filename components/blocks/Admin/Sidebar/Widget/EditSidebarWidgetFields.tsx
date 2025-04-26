import { FormContext } from "@/components/form/Form";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import RoleForm from "@/components/blocks/Admin/Role/RoleForm";
import { Role } from "@/types/Role";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";

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
    makeRequest?: () => Promise<void>;
};
function EditSidebarWidgetFields({
    sidebarId,
    makeRequest,
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
        onChange,
    } = useContext(FormContext);
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
                                    onChange={onChange}
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
                                    onChange={onChange}
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
                                    onChange={onChange}
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
                                    onChange={onChange}
                                    value={values?.icon || ""} />
                                <label className="form-label" htmlFor="icon">
                                    Icon
                                </label>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="custom-control custom-checkbox mb-3 text-left">
                                <input
                                    onChange={e => {
                                        onChange(e);
                                    }}
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="has_container"
                                    name="has_container"
                                    checked={values?.has_container || false} />
                                <label className="custom-control-label" htmlFor="has_container">
                                    Has Container?
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
                                onAdd={async (role: Role) => {
                                    if (!sidebarId) {
                                        return false;
                                    }
                                    if (!role) {
                                        return false;
                                    }
                                    const response = await TruJobApiMiddleware.getInstance()
                                        .resourceRequest({
                                            endpoint: `${truJobApiConfig.endpoints.sidebarWidgetRel.replace('%s', sidebarId.toString())}/${values.id}/role/${role.id}/create`,
                                            method: ApiMiddleware.METHOD.POST,
                                            protectedReq: true,
                                        })
                                    if (!response) {
                                        console.warn('No response from API when adding role');
                                        return false;
                                    }
                                    // if  (typeof makeRequest === 'function') {
                                    //     await makeRequest();
                                    // }
                                    return true;
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
                                    console.log('selectedRoles', sidebarId, selectedRoles);
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
export default EditSidebarWidgetFields;