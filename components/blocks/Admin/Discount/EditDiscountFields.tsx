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
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

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
                        <Checkbox
                            name={'is_active'}
                            placeholder="Is Active"
                            label="Is Active"
                            onChange={handleChange}
                            value={values?.is_active || false}
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'is_code_required'}
                            placeholder="Is Code Required"
                            label="Is Code Required"
                            onChange={handleChange}
                            value={values?.is_code_required || false}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.name || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                            type="text"
                            name="name"
                            label="Name"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.description || ""}
                            onChange={handleChange}
                            placeholder="Enter description"
                            type="text"
                            name="description"
                            label="Description"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectDiscountType name="type" />
                    </div>

                    {values?.type === 'fixed' && (
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.amount || 0}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                type="number"
                                name="amount"
                                label="Amount"
                            />
                        </div>
                    )}
                    {values?.type === 'percentage' && (
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.rate || 0}
                                onChange={handleChange}
                                placeholder="Enter rate"
                                type="number"
                                name="rate"
                                label="Rate"
                            />
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
                        <TextInput
                            value={values?.usage_limit || 0}
                            onChange={handleChange}
                            placeholder="Enter usage limit"
                            type="number"
                            name="usage_limit"
                            label="Usage Limit"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.per_user_limit || 0}
                            onChange={handleChange}
                            placeholder="Enter per user limit"
                            type="number"
                            name="per_user_limit"
                            label="Per User Limit"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.min_order_amount || 0}
                            onChange={handleChange}
                            placeholder="Enter min order amount"
                            type="number"
                            name="min_order_amount"
                            label="Min Order Amount"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.min_items_quantity || 0}
                            onChange={handleChange}
                            placeholder="Enter min items quantity"
                            type="number"
                            name="min_items_quantity"
                            label="Min Items Quantity"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectDiscountScope name="scope" />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.code || ""}
                            onChange={handleChange}
                            placeholder="Enter code"
                            type="text"
                            name="code"
                            label="Code"
                        />
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