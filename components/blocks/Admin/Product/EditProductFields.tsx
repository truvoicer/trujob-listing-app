import { Dispatch, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import SelectProductType from "./SelectProductType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageUser from "../User/ManageUser";
import ManageProductReview from "./Review/ManageProductReview";
import ManageProductFollow from "./Follow/ManageProductFollow";
import ManageMedia from "../Media/ManageMedia";

import ManageProductBrand from "./Brand/ManageProductBrand";
import ManageCategoryProduct from "./Category/ManageCategoryProduct";
import ManageProductFeature from "./Feature/ManageProductFeature";
import ManageProductColor from "./Color/ManageProductColor";
import ManageProductProductCategory from "./ProductCategory/ManageProductProductCategory";
import { Price } from "@/types/Price";
import ManageProductPrice from "./Price/ManageProductPrice";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import SelectProductUnit from "./SelectProductUnit";
import SelectProductWeightUnit from "./SelectProductWeightUnit";

export type EditProductFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductFields({
    operation
}: EditProductFields) {
    const [selectedUsers, setSelectedUsers] = useState<Array<any>>([]);
    const [selectedBrands, setSelectedBrands] = useState<Array<any>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<any>>([]);
    const [selectedColors, setSelectedColors] = useState<Array<any>>([]);
    const [selectedProductCategories, setSelectedProductCategories] = useState<Array<any>>([]);
    const [selectedMedia, setSelectedMedia] = useState<Array<any>>([]);
    const [selectedReviews, setSelectedReviews] = useState<Array<any>>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<Array<any>>([]);
    const [selectedFollows, setSelectedFollows] = useState<Array<any>>([]);
    const [selectedPrices, setSelectedPrices] = useState<Array<any>>([]);

    const modalService = new ModalService();

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
            id: 'categoryProduct',
            title: 'Manage Category',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="categoryProduct"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageCategoryProduct
                        {...getProductComponentProps()}
                        data={values?.categories || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(categories: Array<any>) => {
                            if (!Array.isArray(categories)) {
                                console.warn('Invalid values received from ManageCategoryProduct component');
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
            id: 'productProductCategory',
            title: 'Manage Product Category',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productProductCategory"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProductProductCategory
                        {...getProductComponentProps()}
                        data={values?.product_categories || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(productCategories: Array<unknown>) => {
                            if (!Array.isArray(productCategories)) {
                                console.warn('Invalid values received from ManageProductProductCategory component');
                                return;
                            }
                            if (values?.id) {
                                setSelectedProductCategories(
                                    productCategories.filter((item) => item?.checked)
                                );
                                return;
                            }
                            setFieldValue('product_categories', productCategories);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: () => {
                if (selectedProductCategories.length === 0) {
                    return true;
                }
                if (['add', 'create'].includes(operation)) {
                    setFieldValue('product_categories', selectedProductCategories);
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
                            value={values?.type || null}
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


                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="has_weight"
                            value={values?.has_weight || false}
                            onChange={handleChange}
                            label="Has Weight?"
                            placeholder="Has Weight?"
                        />
                    </div>
                    {values?.has_weight && (
                        <>
                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.weight || 0}
                                    onChange={handleChange}
                                    placeholder="Enter weight"
                                    name="weight"
                                    type="number"
                                    label="Weight"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <SelectProductWeightUnit
                                    name="weight_unit"
                                    value={values?.weight_unit || ''} />
                            </div>
                        </>
                    )}


                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="has_height"
                            value={values?.has_height || false}
                            onChange={handleChange}
                            label="Has Height?"
                            placeholder="Has Height?"
                        />
                    </div>
                    {values?.has_height && (
                        <>
                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.height || 0}
                                    onChange={handleChange}
                                    placeholder="Enter height"
                                    name="height"
                                    type="number"
                                    label="Height"
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <SelectProductUnit
                                    name="height_unit"
                                    value={values?.height_unit || ''} />
                            </div>
                        </>
                    )}


                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="has_length"
                            value={values?.has_length || false}
                            onChange={handleChange}
                            label="Has Length?"
                            placeholder="Has Length?"
                        />
                    </div>
                    {values?.has_length && (
                        <>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.length || 0}
                                    onChange={handleChange}
                                    placeholder="Enter length"
                                    name="length"
                                    type="number"
                                    label="Length"
                                />
                            </div>
                            
                            <div className="col-12 col-md-4">
                                <SelectProductUnit
                                    name="length_unit"
                                    value={values?.length_unit || ''} />
                            </div>
                        </>
                    )}


                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="has_width"
                            value={values?.has_width || false}
                            onChange={handleChange}
                            label="Has Width?"
                            placeholder="Has Width?"
                        />
                    </div>
                    {values?.has_width && (
                        <>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.width || 0}
                                    onChange={handleChange}
                                    placeholder="Enter width"
                                    name="width"
                                    type="number"
                                    label="Width"
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <SelectProductUnit
                                    name="width_unit"
                                    value={values?.width_unit || ''} />
                            </div>
                        </>
                    )}


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
                            'categoryProduct',
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
                        <h4>Manage Product Categories</h4>
                        {modalService.renderLocalTriggerButton(
                            'productProductCategory',
                            'Manage Product Category',
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