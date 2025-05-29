import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";

import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";

type EditUserFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditUserFields({
    operation
}: EditUserFields) {
    const modalService = new ModalService();
    modalService.setUseStateHook(useState)
    modalService.setConfig([
        {
            id: 'userReviewModal',
            title: 'Manage Reviews',
        },
        {
            id: 'userFeatureModal',
            title: 'Manage Features',
        },
        {
            id: 'userFollowModal',
            title: 'Manage Follows',
        },
        {
            id: 'userCategory',
            title: 'Manage Category',
        },
        {
            id: 'userBrand',
            title: 'Manage Brand',
        },
        {
            id: 'userColor',
            title: 'Manage Color',
        },
        {
            id: 'userProductType',
            title: 'Manage Product Type',
        },
        {
            id: 'Media',
            title: 'Manage Media',
        },
    ]);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        {/* <SelectUserType
                            name="user_type"
                        /> */}
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                onChange={handleChange}
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
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="allow_offers"
                                name="allow_offers"
                                onChange={handleChange}
                                checked={values?.allow_offers || false} />
                            <label className="custom-control-label" htmlFor="allow_offers">
                                Allow Offers
                            </label>
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
                            <label className="form-label" htmlFor="title">Title</label>
                        </div>
                    </div>
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
                            <textarea
                                className="form-control"
                                name="description"
                                id="description"
                                onChange={handleChange}
                                value={values?.description || ""}></textarea>
                            <label className="form-label" htmlFor="description">Description</label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="quantity"
                                id="quantity"
                                onChange={handleChange}
                                value={values?.quantity || ""} />
                            <label className="form-label" htmlFor="quantity">
                                Quantity
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        {/* <AccessControlComponent
                        id="user_user"
                            roles={[
                                { name: 'admin' },
                                { name: 'superuser' },
                            ]}
                        >
                            <SelectUser
                                name="user_user"
                            />
                        </AccessControlComponent> */}
                    </div>

                    <div className="col-12 my-3">
                        <h4>Manage</h4>
                        {modalService.renderLocalTriggerButton(
                            'userReviewModal',
                            'Manage Reviews',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'userFeatureModal',
                            'Manage Features',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'userFollowModal',
                            'Manage Follows',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'userCategory',
                            'Manage Category',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'userBrand',
                            'Manage Brand',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'userColor',
                            'Manage Color',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'userProductType',
                            'Manage Product Type',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'Media',
                            'Manage Media',
                        )}
                    </div>
                </div>

                {modalService.renderLocalModals()}
            </div>
        </div>
    );
}
export default EditUserFields;