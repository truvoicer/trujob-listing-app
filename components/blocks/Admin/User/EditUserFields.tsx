import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";

import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

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
                        <Checkbox
                            name={'active'}
                            placeholder="Active?"
                            label="Active?"
                            onChange={handleChange}
                            value={values?.active || false}
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'allow_offers'}
                            placeholder="Allow Offers?"
                            label="Allow Offers?"
                            onChange={handleChange}
                            value={values?.allow_offers || false}
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
                            value={values?.description || ""}
                            onChange={handleChange}
                            placeholder="Enter description"
                            name="description"
                            label="Description"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.quantity || ""}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            name="quantity"
                            type="text"
                            label="Quantity"
                        />
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