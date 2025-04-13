import Form from "@/components/form/Form";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { EDIT_MENU_MODAL_ID } from "./ManageMenu";
import { DataTableContext } from "@/contexts/DataTableContext";
import { isObjectEmpty } from "@/helpers/utils";
import MenuItemForm from "./MenuItemForm";
import RoleForm from "../Role/RoleForm";

function EditMenu({ data, operation }) {
    const [rolesModal, setRolesModal] = useState({
        show: false,
        title: '',
        footer: true,
    });
    const [menuItemsModal, setMenuItemsModal] = useState({
        show: false,
        title: '',
        footer: true,
    });

    const initialValues = {
        'name': data?.name || '',
        'has_parent': data?.has_parent || false,
        'ul_class': data?.ul_class || '',
        'active': data?.active || false,
        'roles': data?.roles || [],
        'menu_items': data?.menu_items || [],
    };
    function hideModal(setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    }
    function showModal(setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.show = true;
            return newState;
        });
    }
    function setModalTitle(title, setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.title = title;
            return newState;
        });
    }
    function setModalFooter(hasFooter = false, setter) {
        setter(prevState => {
            let newState = { ...prevState };
            newState.footer = hasFooter;
            return newState;
        });
    }

    const dataTableContext = useContext(DataTableContext);
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <Form
                    operation={operation}
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        let requestData = { ...values };
                        console.log('requestData', requestData);
                        return;
                        if (['edit', 'update'].includes(operation) && isObjectEmpty(requestData)) {
                            console.warn('No data to update');
                            return;
                        }
                        if (Array.isArray(requestData?.sidebars)) {
                            requestData.sidebars = requestData?.sidebars.filter((sidebar) => {
                                return sidebar?.id;
                            })
                                .map((sidebar) => {
                                    return parseInt(sidebar.id);
                                });
                        }
                        if (Array.isArray(requestData?.blocks)) {
                            requestData.blocks = requestData?.blocks.map((block) => {
                                if (Array.isArray(block?.sidebars)) {
                                    block.sidebars = block.sidebars
                                        .filter((sidebar) => {
                                            return sidebar?.id;
                                        })
                                        .map((sidebar) => {
                                            return parseInt(sidebar.id);
                                        });
                                }
                                return block;
                            });
                        }


                        let response = null;
                        switch (operation) {
                            case 'edit':
                            case 'update':
                                if (!data?.id || data?.id === '') {
                                    throw new Error('Page ID is required');
                                }
                                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: `${truJobApiConfig.endpoints.page}/${data.id}/update`,
                                    method: ApiMiddleware.METHOD.PATCH,
                                    protectedReq: true,
                                    data: requestData,
                                })
                                break;
                            case 'add':
                            case 'create':
                                response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: `${truJobApiConfig.endpoints.page}/create`,
                                    method: ApiMiddleware.METHOD.POST,
                                    protectedReq: true,
                                    data: requestData,
                                })
                                break;
                            default:
                                console.warn('Invalid operation');
                                break;
                        }
                        if (!response) {
                            return;
                        }
                        dataTableContext.refresh();
                        dataTableContext.modal.close(EDIT_MENU_MODAL_ID);

                    }}
                >
                    {({
                        values,
                        errors,
                        setFieldValue,
                        onChange,
                    }) => {
                        return (
                            <>
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <div className="custom-control custom-checkbox mb-3 text-left">
                                            <input
                                                onChange={e => {
                                                    onChange(e);
                                                }}
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="active"
                                                name="active"
                                                checked={values?.active || false} />
                                            <label className="custom-control-label" htmlFor="active">
                                                Active
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <div className="floating-input form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                id="name"
                                                required=""
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
                                                name="ul_class"
                                                id="ul_class"
                                                required=""
                                                onChange={onChange}
                                                value={values?.ul_class || ""} />
                                            <label className="form-label" htmlFor="ul_class">
                                                UL Class
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
                                                setModalFooter(false, setRolesModal);
                                                showModal(setRolesModal);
                                            }}
                                        >
                                            Manage Roles
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary mr-2"
                                            onClick={(e) => {
                                                setModalTitle('Manage Menu Items', setMenuItemsModal);
                                                setModalFooter(false, setMenuItemsModal);
                                                showModal(setMenuItemsModal);
                                            }}
                                        >
                                            Manage Menu Items
                                        </button>
                                    </div>

                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary mr-2"
                                        >
                                            Save
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
                                            onChange={(roles) => {
                                                setFieldValue('roles', roles);
                                            }}
                                        />
                                    </Modal.Body>
                                    {rolesModal.footer &&
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => hideModal(setRolesModal)}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => hideModal(setRolesModal)}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    }
                                </Modal>
                                <Modal show={menuItemsModal.show} onHide={() => hideModal(setMenuItemsModal)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{menuItemsModal?.title || ''}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <MenuItemForm
                                            data={values?.menu_items || []}
                                            onChange={(menuItems) => {
                                                console.log('menuItems', menuItems);
                                                setFieldValue('menu_items', menuItems);
                                            }}
                                        />
                                    </Modal.Body>
                                    {menuItemsModal.footer &&
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => hideModal(setMenuItemsModal)}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => hideModal(setMenuItemsModal)}>
                                                Save Changes
                                            </Button>
                                        </Modal.Footer>
                                    }
                                </Modal>
                            </>
                        )
                    }}
                </Form>
            </div>
        </div>
    );
}
export default EditMenu;