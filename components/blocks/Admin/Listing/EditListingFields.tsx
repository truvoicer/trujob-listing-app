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
import { stat } from "fs";
import { objectMerge } from "@/helpers/utils";

type EditListingFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingFields({
    operation
}: EditListingFields) {
    const [selectedUsers, setSelectedUsers] = useState<Array<any>>([]);
    const [selectedBrands, setSelectedBrands] = useState<Array<any>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<any>>([]);
    const [selectedColors, setSelectedColors] = useState<Array<any>>([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState<Array<any>>([]);
    const [selectedMedia, setSelectedMedia] = useState<Array<any>>([]);
    const [selectedReviews, setSelectedReviews] = useState<Array<any>>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<Array<any>>([]);
    const [selectedFollows, setSelectedFollows] = useState<Array<any>>([]);
    const [selectedListingTypes, setSelectedListingTypes] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    function getListingComponentProps() {
        let componentProps: any = {
            operation: 'create',
        };
        if (values?.id) {
            componentProps.listingId = values.id;
            componentProps.operation = 'edit';
        }
        return componentProps;
    }
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
                        {...getListingComponentProps()}
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(users: Array<any>) => {
                            if (!Array.isArray(users)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedUsers(
                                users.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: ({ state }: {
                state: LocalModal,
                setState: Dispatch<React.SetStateAction<LocalModal>>,
                configItem: any,
            },
                e?: React.MouseEvent | null
            ) => {
                if (selectedUsers.length === 0) {
                    console.warn('No user selected');
                    return true;
                }
                const selectedUser = selectedUsers[0];
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_user', selectedUser);
                    return true;
                }
            },
            onCancel: () => {
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
                        {...getListingComponentProps()}
                        data={values?.reviews || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(values: Array<any>) => {
                            if (!Array.isArray(values)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            setSelectedReviews(
                                values.filter((item) => item?.checked)
                            );
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedReviews.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_reviews', selectedReviews);
                    return true;
                }
                return true;
            },
            onCancel: () => {
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
                        {...getListingComponentProps()}
                        data={values?.features || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(features: Array<any>) => {
                            if (!Array.isArray(features)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedFeatures(
                                    features.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('features', features);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedFeatures.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {

                    setFieldValue('features', selectedFeatures);
                    return true;
                }
                return true;
            },
            onCancel: () => {
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
                        {...getListingComponentProps()}
                        data={values?.follows || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(follows: Array<any>) => {
                            if (!Array.isArray(follows)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedFollows(
                                    follows.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('follows', follows);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedFollows.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_follows', selectedFollows);
                    return true;
                }
                return true;
            },
            onCancel: () => {
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
                        {...getListingComponentProps()}
                        data={values?.categories || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(categories: Array<any>) => {
                            if (!Array.isArray(categories)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedCategories(
                                    categories.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('categories', categories);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedCategories.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_categories', selectedCategories);
                    return true;
                }
                return true;
            },
            onCancel: () => {
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
                        {...getListingComponentProps()}
                        data={values?.brands || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(brands: Array<any>) => {
                            if (!Array.isArray(brands)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedBrands(
                                    brands.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('brands', brands);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedBrands.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_brands', selectedBrands);
                    return true;
                }
                return true;
            },
            onCancel: () => {
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
                        {...getListingComponentProps()}
                        data={values?.colors || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(colors: Array<any>) => {
                            if (!Array.isArray(colors)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedColors(
                                    colors.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('colors', colors);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedColors.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_colors', selectedColors);
                    return true;
                }
                return true;
            },
            onCancel: () => {
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
                        {...getListingComponentProps()}
                        data={values?.product_types || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(productTypes: Array<any>) => {
                            if (!Array.isArray(productTypes)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedProductTypes(
                                    productTypes.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('product_types', productTypes);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedProductTypes.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_product_types', selectedProductTypes);
                    return true;
                }
                return true;
            },
            onCancel: () => {
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
                        data={values?.media || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(media: Array<any>) => {
                            if (!Array.isArray(media)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedMedia(
                                    media.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('media', media);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedMedia.length === 0) {
                    console.warn('No user selected');
                    return true;
                }

                if (['add', 'create'].includes(operation)) {
                    setFieldValue('listing_media', selectedMedia);
                    return true;
                }
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
    ]);
    console.log('modalService', values);

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
                        <h4>Manage Reviews</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingReviewModal',
                            'View Reviews',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Features</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingFeatureModal',
                            'Manage Features',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Follows</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingFollowModal',
                            'Manage Follows',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Categories</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingCategory',
                            'Manage Category',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Brands</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingBrand',
                            'Manage Brand',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Colors</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingColor',
                            'Manage Color',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Product Types</h4>
                        {modalService.renderLocalTriggerButton(
                            'listingProductType',
                            'Manage Product Type',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Media</h4>
                        {modalService.renderLocalTriggerButton(
                            'Media',
                            'Manage Media',
                        )}
                    </div>
                </div>
            </div>

            {modalService.renderLocalModals()}
        </div>
    );
}
export default EditListingFields;