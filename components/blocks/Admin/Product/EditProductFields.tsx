import { Dispatch, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectProductType from "./SelectProductType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../User/ManageUser";
import ManageProductReview from "./Review/ManageProductReview";
import ManageProductFollow from "./Follow/ManageProductFollow";
import ManageMedia from "../Media/ManageMedia";

import ManageProductBrand from "./Brand/ManageProductBrand";
import ManageProductCategory from "./Category/ManageProductCategory";
import ManageProductFeature from "./Feature/ManageProductFeature";
import ManageProductColor from "./Color/ManageProductColor";
import ManageProductProductType from "./ProductType/ManageProductProductType";
import { Price } from "@/types/Price";
import ManageProductPrice from "./Price/ManageProductPrice";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

type EditProductFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductFields({
    operation
}: EditProductFields) {
    const [selectedUsers, setSelectedUsers] = useState<Array<any>>([]);
    const [selectedBrands, setSelectedBrands] = useState<Array<any>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<any>>([]);
    const [selectedColors, setSelectedColors] = useState<Array<any>>([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState<Array<any>>([]);
    const [selectedMedia, setSelectedMedia] = useState<Array<any>>([]);
    const [selectedReviews, setSelectedReviews] = useState<Array<any>>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<Array<any>>([]);
    const [selectedFollows, setSelectedFollows] = useState<Array<any>>([]);
    const [selectedPrices, setSelectedPrices] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    function getProductComponentProps() {
        const componentProps: Record<string, unknown> = {
            operation: 'create',
            mode: 'selector',
            isChild: true
        };
        if (values?.id) {
            componentProps.productId = values.id;
            componentProps.operation = 'edit';
        }
        return componentProps;
    }

    modalService.setUseStateHook(useState);
    modalService.setConfig([
        {
            id: 'productUser',
            title: 'Select User',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productUser"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageUser
                        {...getProductComponentProps()}
                        fixSessionUser={true}
                        values={values?.user ? [values?.user] : []}
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(users: Array<any>) => {
                            if (!Array.isArray(users)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }

                            if (users.length === 0) {
                                console.warn('Users is empty');
                                return true;
                            }
                            const checked = users.filter((item) => item?.checked);
                            if (checked.length === 0) {
                                console.warn('No user selected');
                                return true;
                            }
                            const selectedUser = checked[0];

                            if (values?.id) {
                                setSelectedUsers(checked);
                                return;
                            }
                            setFieldValue('user', selectedUser);
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
                return true;
            },
            onCancel: () => {
                return true;
            }
        },
        {
            id: 'productReviewModal',
            title: 'Manage Reviews',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productReviewModal"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductReview
                        {...getProductComponentProps()}
                        data={values?.reviews || []}
                        rowSelection={false}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(reviews: Array<any>) => {
                            console.log('reviews', reviews);
                            if (!Array.isArray(reviews)) {
                                console.warn('Invalid values received from ManageProductReview component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedReviews(
                                    reviews.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('reviews', reviews);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedReviews.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('reviews', selectedReviews);
                    return true;
                }
                return true;
            },
            onCancel: () => {
                return true;
            }
        },
        {
            id: 'productFeatureModal',
            title: 'Manage Features',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productFeatureModal"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductFeature
                        {...getProductComponentProps()}
                        data={values?.features || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(features: Array<any>) => {
                            console.log('features', features);
                            if (!Array.isArray(features)) {
                                console.warn('Invalid values received from ManageProductFeature component');
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
            id: 'productFollowModal',
            title: 'Manage Follows',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent

                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductFollow
                        {...getProductComponentProps()}
                        data={values?.follows || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(follows: Array<any>) => {
                            if (!Array.isArray(follows)) {
                                console.warn('Invalid values received from ManageProductFollow component');
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
                // if (['add', 'create'].includes(operation)) {
                //     setFieldValue('follows', selectedFollows);
                //     return true;
                // }
                return true;
            },
            onCancel: () => {
                return true;
            }
        },
        {
            id: 'productCategory',
            title: 'Manage Category',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productCategory"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductCategory
                        {...getProductComponentProps()}
                        data={values?.categories || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(categories: Array<any>) => {
                            if (!Array.isArray(categories)) {
                                console.warn('Invalid values received from ManageProductCategory component');
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
                    setFieldValue('categories', selectedCategories);
                    return true;
                }
                return true;
            },
            onCancel: () => {
                return true;
            }
        },
        {
            id: 'productBrand',
            title: 'Manage Brand',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productBrand"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductBrand
                        {...getProductComponentProps()}
                        data={values?.brands || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(brands: Array<any>) => {
                            if (!Array.isArray(brands)) {
                                console.warn('Invalid values received from ManageProductBrand component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedBrands(
                                    brands.filter((item) => item?.checked)
                                );
                                return;
                            }
                            console.log('brands', brands);
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
                    setFieldValue('brands', selectedBrands);
                    return true;
                }
                return true;
            },
            onCancel: () => {
                return true;
            }
        },
        {
            id: 'productColor',
            title: 'Manage Color',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productColor"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductColor
                        {...getProductComponentProps()}
                        data={values?.colors || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(colors: Array<any>) => {
                            if (!Array.isArray(colors)) {
                                console.warn('Invalid values received from ManageProductColor component');
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
                    setFieldValue('colors', selectedColors);
                    return true;
                }
                return true;
            },
            onCancel: () => {
                return true;
            }
        },
        {
            id: 'productProductType',
            title: 'Manage Product Type',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productProductType"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductProductType
                        {...getProductComponentProps()}
                        data={values?.product_types || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(productTypes: Array<any>) => {
                            if (!Array.isArray(productTypes)) {
                                console.warn('Invalid values received from ManageProductProductType component');
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
                    setFieldValue('product_types', selectedProductTypes);
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
                    id="Media"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageMedia
                        data={values?.media || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(media: Array<any>) => {
                            if (!Array.isArray(media)) {
                                console.warn('Invalid values received from ManageMedia component');
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
                    setFieldValue('media', selectedMedia);
                    return true;
                }
                return true;
            },
            onCancel: () => {
                console.log('cancel');
                return true;
            }
        },
        {
            id: 'productPrice',
            title: 'Manage Price',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productPrice"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductPrice
                        {...getProductComponentProps()}
                        data={values?.prices || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(prices: Array<Price>) => {
                            if (!Array.isArray(prices)) {
                                console.warn('Invalid values received from ManageProductPrice component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedPrices(
                                    prices.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('prices', prices);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                console.log('ok');
                if (selectedPrices.length === 0) {
                    console.warn('No prices selected');
                    return true;
                }

                if (['add', 'create'].includes(operation)) {
                    setFieldValue('prices', selectedPrices);
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

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <SelectProductType
                            name="type"
                        />
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


                    <div className="col-12 my-3">
                        <h4>Select User</h4>
                        {modalService.renderLocalTriggerButton(
                            'productUser',
                            'Select User',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Reviews</h4>
                        {modalService.renderLocalTriggerButton(
                            'productReviewModal',
                            'View Reviews',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Features</h4>
                        {modalService.renderLocalTriggerButton(
                            'productFeatureModal',
                            'Manage Features',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Follows</h4>
                        {modalService.renderLocalTriggerButton(
                            'productFollowModal',
                            'Manage Follows',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Categories</h4>
                        {modalService.renderLocalTriggerButton(
                            'productCategory',
                            'Manage Category',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Brands</h4>
                        {modalService.renderLocalTriggerButton(
                            'productBrand',
                            'Manage Brand',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Colors</h4>
                        {modalService.renderLocalTriggerButton(
                            'productColor',
                            'Manage Color',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Product Types</h4>
                        {modalService.renderLocalTriggerButton(
                            'productProductType',
                            'Manage Product Type',
                        )}
                    </div>
                    <div className="col-12 my-3">
                        <h4>Manage Price</h4>
                        {modalService.renderLocalTriggerButton(
                            'productPrice',
                            'Manage Price',
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
export default EditProductFields;