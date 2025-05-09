import { Dispatch, useContext, useState } from "react";
import { FormikProps, FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import RoleForm from "../Role/RoleForm";
import { Role } from "@/types/Role";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { title } from "process";
import SelectListingType from "./SelectListingType";
import SelectUser from "../User/SelectUser";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../User/ManageUser";
import ManageListingReview from "./Review/ManageListingReview";
import ManageListingFeature from "./Feature/ManageListingFeature";
import ManageListingFollow from "./Follow/ManageListingFollow";
import ManageListingCategory from "./Category/ManageListingCategory";
import ManageListingBrand from "./Brand/ManageListingBrand";
import ManageListingColor from "./Color/ManageListingColor";
import ManageListingProductType from "./ProductType/ManageListingProductType";
import ManageMedia from "../Media/ManageMedia";

type EditListingFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingFields({
    operation
}: EditListingFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    modalService.setUseStateHook(useState)
    modalService.setConfig([
        {
            id: 'listingUser',
            title: 'Select User',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageUser
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'listingReviewModal',
            title: 'Manage Reviews',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageListingReview
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'listingFeatureModal',
            title: 'Manage Features',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageListingFeature
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'listingFollowModal',
            title: 'Manage Follows',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageListingFollow
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'listingCategory',
            title: 'Manage Category',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageListingCategory
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'listingBrand',
            title: 'Manage Brand',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageListingBrand
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'listingColor',
            title: 'Manage Color',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageListingColor
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'listingProductType',
            title: 'Manage Product Type',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageListingProductType
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'Media',
            title: 'Manage Media',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageMedia
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedTableRows(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedTableRows.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedTableRows[0];
                setFieldValue('listing_user', selectedUser);
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
    ]);
    

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <SelectListingType
                            name="listing_type"
                        />
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


                    <div className="col-12 my-3">
                        <h4>Select User</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingUser',
                            'Select User',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingReviewModal',
                            'Manage Reviews',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'listingFeatureModal',
                            'Manage Features',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'listingFollowModal',
                            'Manage Follows',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'listingCategory',
                            'Manage Category',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'listingBrand',
                            'Manage Brand',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'listingColor',
                            'Manage Color',
                        )}
                        {modalService.renderLocalTriggerButton(
                            'listingProductType',
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
export default EditListingFields;