import { Dispatch, SetStateAction, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectDiscountType from "./SelectDiscountType";
import CurrencySelect from "../../Locale/Currency/CurrencySelect";
import DateTimePicker from "@/components/Date/DateTimePicker";
import moment from "moment";
import SelectDiscountScope from "./SelectDiscountScope";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageCategory from "../Category/ManageCategory";
import ManageProduct from "../Product/ManageProduct";
import { DataTableItem } from "@/components/Table/DataTable";
import ManageProductPrice from "../Product/Price/ManageProductPrice";
import { Price } from "@/types/Price";

type EditDiscountFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditDiscountFields({
    operation
}: EditDiscountFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<any>>([]);
    const [selectedProducts, setSelectedProducts] = useState<Array<any>>([]);
    const [selectedPrices, setSelectedPrices] = useState<Array<Price>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    function getProductComponentProps() {
        let componentProps: any = {
            operation: 'create',
            mode: 'selector'
        };
        if (values?.id) {
            componentProps.operation = 'edit';
        }
        return componentProps;
    }

    modalService.setUseStateHook(useState);
    modalService.setConfig([
        {
            id: 'categories',
            title: 'Select Category',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="manage-discount-categories"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageCategory
                        {...getProductComponentProps()}
                        data={values?.categories || []}
                        rowSelection={true}
                        multiRowSelection={true}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(categories: Array<any>) => {
                            console.log('categories', categories);
                            if (!Array.isArray(categories)) {
                                console.warn('Invalid values received from  ManageCategory:', categories);
                                return;
                            }
                            const checked = categories.filter((item) => item?.checked);
                            if (values?.id) {
                                setSelectedCategories(checked);
                                return;
                            }
                            setFieldValue('categories', checked);
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
            id: 'products',
            title: 'Select Product',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="productsProduct"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                        { name: 'user' },
                    ]}
                >
                    <ManageProduct
                        {...getProductComponentProps()}
                        // data={values?.categories || []}
                        rowSelection={true}
                        multiRowSelection={false}
                        onRowSelect={(
                            item: DataTableItem,
                            index: number,
                            dataTableContextState: any
                        ): boolean | Promise<boolean> => {
                            console.log('onRowSelect', item, index, dataTableContextState);
                            modalService.triggerLocalItem(
                                'productPrice',
                                {
                                    productId: item?.id || null
                                }
                            );
                            return true;
                        }}
                        enableEdit={true}
                        paginationMode="state"
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
            id: 'productPrice',
            title: 'Manage Price',
            size: 'lg',
            fullscreen: true,
            component: ({
                state,
                setState,
                configItem,
            }: {
                state: LocalModal,
                setState: Dispatch<SetStateAction<LocalModal>>,
                configItem: any,
            }) => {
                const productId = state?.props?.productId;
                if (!productId) {
                    return null;
                }
                return (
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
                            productId={productId || null}
                            rowSelection={true}
                            multiRowSelection={true}
                            enableEdit={true}
                            paginationMode="state"
                            onChange={(prices: Array<Price>) => {
                                if (!Array.isArray(prices)) {
                                    console.warn('Invalid values received from component');
                                    return;
                                }
                                const checked = prices.filter((item) => item?.checked);
                                const buildProductPrice = checked.map((price: Price) => {
                                    return {
                                        product_id: productId,
                                        product_type: 'product',
                                        price_id: price?.id,
                                    };
                                });
                                const existingProducts = values?.products || [];

                                // Merge existing products with new prices not already included
                                const mergedProducts = [
                                    ...existingProducts,
                                    ...buildProductPrice.filter((newPrice) => {
                                        return !existingProducts.some(
                                            (existingPrice: {
                                                price_id: number;
                                                product_id: number;
                                                product_type: string;
                                            }) =>
                                                existingPrice.price_id === newPrice.price_id &&
                                                existingPrice.product_id === newPrice.product_id &&
                                                existingPrice.product_type === newPrice.product_type
                                        );
                                    })
                                ];
                                //remove if it doesn't exist in checked 
                                const filteredProducts = mergedProducts.filter((product) => {
                                    return checked.some((price) => price.id === product.price_id);
                                });

                                setSelectedPrices(filteredProducts);
                                setFieldValue('products', filteredProducts);
                            }}
                        />
                    </AccessControlComponent>
                );
            },
            onOk: () => {
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
        }
    ]);
    
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                onChange={handleChange}
                                checked={values?.is_active || false} />
                            <label className="custom-control-label" htmlFor="is_active">
                                Is Active
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                name="is_code_required"
                                id="is_code_required"
                                onChange={handleChange}
                                checked={values?.is_code_required || false} />
                            <label className="custom-control-label" htmlFor="is_code_required">
                                Is Code Required
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
                                onChange={handleChange}
                                value={values?.name || ""} />
                            <label className="form-label" htmlFor="name">
                                Name
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
                                onChange={handleChange}
                                value={values?.description || ""} />
                            <label className="form-label" htmlFor="description">
                                Description
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectDiscountType name="type" />
                    </div>

                    {values?.type === 'fixed' && (
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="number"
                                name="amount"
                                id="amount"
                                onChange={handleChange}
                                value={values?.amount || 0} />
                            <label className="form-label" htmlFor="amount">
                                Amount
                            </label>
                        </div>
                    </div>
                    )}
                    {values?.type === 'percentage' && (
                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="rate"
                                    id="rate"
                                    onChange={handleChange}
                                    value={values?.rate || 0} />
                                <label className="form-label" htmlFor="rate">
                                    Rate
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="col-12 col-lg-6">
                        <label className="title">Select Currency</label>
                        <CurrencySelect
                            value={values?.currency ?
                                {
                                    value: values?.currency?.id,
                                    label: values?.currency?.name,
                                } : null}
                            isMulti={false}
                            showLoadingSpinner={true}
                            onChange={(value) => {
                                setFieldValue('currency', value);
                            }}
                            loadingMore={true}
                            loadMoreLimit={10}
                        />
                    </div>

                    <div className="col-12 col-lg-6 mt-3">
                        <div className="floating-input form-group">
                            <DateTimePicker
                                label="Starts At"
                                value={
                                    moment(values?.starts_at).isValid()
                                        ? moment(values?.starts_at).toDate()
                                        : ''
                                }
                                onChange={(value) => {
                                    console.log('starts_at', value);
                                    setFieldValue("starts_at", value);
                                }}
                                onSelect={(value => {
                                    console.log('starts_at', value);
                                    setFieldValue("starts_at", value);
                                })}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 mt-3">
                        <div className="floating-input form-group">
                            <DateTimePicker
                                label="Ends At"
                                value={
                                    moment(values?.ends_at).isValid()
                                        ? moment(values?.ends_at).toDate()
                                        : ''
                                }
                                onChange={(value) => {
                                    console.log('ends_at', value);
                                    setFieldValue("ends_at", value);
                                }}
                                onSelect={(value => {
                                    console.log('ends_at', value);
                                    setFieldValue("ends_at", value);
                                })}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="number"
                                name="usage_limit"
                                id="usage_limit"
                                onChange={handleChange}
                                value={values?.usage_limit || 0} />
                            <label className="form-label" htmlFor="usage_limit">
                                Usage Limit
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="number"
                                name="per_user_limit"
                                id="per_user_limit"
                                onChange={handleChange}
                                value={values?.per_user_limit || 0} />
                            <label className="form-label" htmlFor="per_user_limit">
                                Per User Limit
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="number"
                                name="min_order_amount"
                                id="min_order_amount"
                                onChange={handleChange}
                                value={values?.min_order_amount || 0} />
                            <label className="form-label" htmlFor="min_order_amount">
                                Min Order Amount
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="number"
                                name="min_items_quantity"
                                id="min_items_quantity"
                                onChange={handleChange}
                                value={values?.min_items_quantity || 0} />
                            <label className="form-label" htmlFor="min_items_quantity">
                                Min Items Quantity
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectDiscountScope name="scope" />
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="code"
                                id="code"
                                onChange={handleChange}
                                value={values?.code || ""} />
                            <label className="form-label" htmlFor="code">
                                Code
                            </label>
                        </div>
                    </div>

                    <div className="col-12 my-3">
                        <h4>Select Category</h4>
                        {modalService.renderLocalTriggerButton(
                            'categories',
                            'Select Category',
                        )}
                    </div>

                    <div className="col-12 my-3">
                        <h4>Select Product</h4>
                        {modalService.renderLocalTriggerButton(
                            'products',
                            'Select Product',
                        )}
                    </div>


                </div>
                {modalService.renderLocalModals()}
            </div>
        </div>
    );
}
export default EditDiscountFields;