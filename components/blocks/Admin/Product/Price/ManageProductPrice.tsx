import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext, useState } from "react";
import EditProductPrice from "./EditProductPrice";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager, { DataManageComponentProps, DataTableContextType, DatatableSearchParams, DMOnRowSelectActionClick } from "@/components/Table/DataManager";
import { isNotEmpty } from "@/helpers/utils";
import { SORT_BY, SORT_ORDER } from "@/library/redux/constants/search-constants";
import { Product } from "@/types/Product";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ModalItem } from "@/library/services/modal/ModalService";
import { Price } from "@/types/Price";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export interface ManageProductPriceProps extends DataManageComponentProps {
    data?: Array<Price>;
    productId?: number;
}
export const EDIT_PRODUCT_PRICE_MODAL_ID = 'edit-product-price-modal';
export const DELETE_PRODUCT_PRICE_MODAL_ID = 'delete-product-price-modal';
export const CREATE_PRODUCT_PRICE_MODAL_ID = 'create-product-price-modal';

function ManageProductPrice({
    mode = 'selector',
    data,
    operation,
    productId,
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageProductPriceProps) {
    const [selectedPrices, setSelectedPrices] = useState<Array<Price>>([]);
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    function getAddNewModalInitialValues() {
        switch (mode) {
            case 'selector':
                return {
                    prices: [],
                };
            case 'edit':
                return {};
            default:
                return {};
        }
    }
    function getProductFormModalProps(index?: number) {
        return {
            formProps: {
                operation: operation,
                initialValues: getAddNewModalInitialValues(),
            },
            show: true,
            showFooter: true,
            onOk: async ({ formHelpers }: {
                formHelpers?: FormikProps<FormikValues>
            }) => {
                if (!formHelpers) {
                    return;
                }
                if (typeof formHelpers?.submitForm !== 'function') {
                    console.warn('submitForm is not a function');
                    return;
                }
                
                switch (mode) {
                    case 'selector':
                        DataManagerService.selectorModeHandler({
                            onChange,
                            data,
                            values: formHelpers?.values,
                            index,
                            format: 'object'
                        });
                        break;
                    case 'edit':
                        DataManagerService.editModeCreateHandler({
                            onChange,
                            data,
                            values: formHelpers?.values,
                        });
                        break;
                    default:
                        console.warn('Invalid mode');
                        return;
                }

                return await formHelpers.submitForm();
            },
            fullscreen: true
        }
    }

    function renderActionColumn(item: Product, index: number, dataTableContextState: DataTableContextType) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContextState.modal.show({
                            title: 'Edit Product Price',
                            component: (
                                <EditProductPrice
                                    productId={productId}
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_PRODUCT_PRICE_MODAL_ID}
                                />
                            ),
                            ...getProductFormModalProps(index),
                        }, EDIT_PRODUCT_PRICE_MODAL_ID);
                    }}
                >
                    <i className="lar la-eye"></i>
                </Link>
                <Link className="badge bg-danger-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContext.modal.show({
                            title: 'Delete Product',
                            component: (
                                <p>Are you sure you want to delete this price ({item?.label})?</p>
                            ),
                            onOk: async () => {
                                if (!operation) {
                                    console.warn('Operation is required');
                                    return;
                                }
                                if (['add', 'create'].includes(operation)) {
                                    let cloneData = [...data];
                                    cloneData.splice(index, 1);
                                    if (typeof onChange === 'function') {
                                        onChange(cloneData);
                                    }
                                    dataTableContext.modal.close(DELETE_PRODUCT_PRICE_MODAL_ID);
                                    return;
                                }
                                if (!productId) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Product ID is required</p>
                                        ),
                                    }, 'product-price-delete-error');
                                    return;
                                }
                                if (!item?.id) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Product price ID is required</p>
                                        ),
                                    }, 'product-price-delete-error');
                                    return;
                                }

                                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: UrlHelpers.urlFromArray([
                                        truJobApiConfig.endpoints.productPrice.replace(
                                            ':productId',
                                            productId.toString()
                                        ),
                                        item.id,
                                        'delete'
                                    ]),
                                    method: ApiMiddleware.METHOD.DELETE,
                                    protectedReq: true
                                });

                                if (!response) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Failed to delete product price</p>
                                        ),
                                    }, 'product-price-delete-error');
                                    return;
                                }
                                dataTableContextState.refresh();

                            },
                            show: true,
                            showFooter: true
                        }, DELETE_PRODUCT_PRICE_MODAL_ID);
                    }}
                >
                    <i className="lar la-eye"></i>
                </Link>
                <BadgeDropDown
                    data={[
                        {
                            text: 'Edit',
                            linkProps: {
                                href: '#',
                                onClick: e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    dataTableContextState.modal.show({
                                        title: 'Edit Product',
                                        component: (
                                            <EditProductPrice
                                                productId={productId}
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_PRODUCT_PRICE_MODAL_ID}
                                            />
                                        ),
                                        ...getProductFormModalProps(index),
                                    }, EDIT_PRODUCT_PRICE_MODAL_ID);
                                }
                            }
                        },
                        {
                            text: 'Delete',
                            linkProps: {
                                href: '#',
                                onClick: e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    appModalContext.show({
                                        title: 'Delete Product',
                                        component: (
                                            <p>Are you sure you want to delete this product ({item?.title})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Product ID is required</p>
                                                    ),
                                                }, 'product-price-delete-error');
                                                return;
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.product}/${item.id}/delete`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true
                                            })
                                            if (!response) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Failed to delete product</p>
                                                    ),
                                                }, 'product-price-delete-error');
                                                return;
                                            }
                                            dataTableContextState.refresh();
                                        },
                                        show: true,
                                        showFooter: true
                                    }, EDIT_PRODUCT_PRICE_MODAL_ID);
                                }
                            }
                        }
                    ]}
                />
            </div>
        )
    }
    async function prepareSearch(searchParams: DatatableSearchParams = {}) {

        let query: any = {};

        if (isNotEmpty(searchParams?.sort_by)) {
            query[SORT_BY] = searchParams?.sort_by;
        }

        if (isNotEmpty(searchParams?.sort_order)) {
            query[SORT_ORDER] = searchParams?.sort_order;
        }

        // if (isNotEmpty(searchParams?.product_size)) {
        //     query[fetcherApiConfig.productSizeKey] = parseInt(searchParams.product_size);
        // }
        if (isNotEmpty(searchParams?.product)) {
            query['product'] = searchParams.product;
        }
        return query;
    }
    async function productRequest({ dataTableContextState, setDataTableContextState, searchParams }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
        searchParams: any
    }) {
        if (!operation) {
            console.warn('Operation is required');
            return;
        }
        if (mode !== 'selector' && ['add', 'create'].includes(operation)) {
            return;
        }
        if (!productId) {
            console.warn('Product ID is required');
            return;
        }
        let query = dataTableContextState?.query || {};
        let post = dataTableContextState?.post || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.productPrice.replace(':productId', productId.toString()),
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query,
            data: post,
        });
    }
    function renderAddNew(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { dataTableContextState, setDataTableContextState }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
    }) {
        e.preventDefault();
        // e.stopPropagation();
        console.log('Add New Product Price', dataTableContext.modal);
        dataTableContext.modal.show({
            title: 'Add New Product Price',
            component: ({
                modal,
                index,
                formHelpers
            }: {
                modal: ModalItem,
                index: number,
                formHelpers?: any
            }) => {
                return (
                    <EditProductPrice
                        productId={productId}
                        operation={'create'}
                        inModal={true}
                        modalId={CREATE_PRODUCT_PRICE_MODAL_ID}
                    />
                )
            },
            ...getProductFormModalProps(),
        }, CREATE_PRODUCT_PRICE_MODAL_ID);
    }

    function getRowSelectActions() {
        let actions = [];
        actions.push({
            label: 'Delete',
            name: 'delete',
            onClick: ({
                action,
                data,
                dataTableContextState,
            }: DMOnRowSelectActionClick) => {

                dataTableContextState.confirmation.show({
                    title: 'Edit Menu',
                    message: 'Are you sure you want to delete selected products?',
                    onOk: async () => {
                        console.log('Yes')
                        if (!data?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>No products selected</p>
                                ),
                            }, 'product-bulk-delete-error');
                            return;
                        }
                        const ids = RequestHelpers.extractIdsFromArray(data);
                        if (!ids?.length) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Product IDs are required</p>
                                ),
                            }, 'product-bulk-delete-error');
                            return;
                        }
                        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                            endpoint: `${truJobApiConfig.endpoints.product}/bulk/delete`,
                            method: ApiMiddleware.METHOD.DELETE,
                            protectedReq: true,
                            data: {
                                ids: ids
                            }
                        })
                        if (!response) {
                            notificationContext.show({
                                variant: 'danger',
                                type: 'toast',
                                title: 'Error',
                                component: (
                                    <p>Failed to delete products</p>
                                ),
                            }, 'product-bulk-delete-error');
                            return;
                        }

                        notificationContext.show({
                            variant: 'success',
                            type: 'toast',
                            title: 'Success',
                            component: (
                                <p>Products deleted successfully</p>
                            ),
                        }, 'product-bulk-delete-success');
                        dataTableContextState.refresh();
                    },
                    onCancel: () => {
                        console.log('Cancel delete');
                    },
                }, 'delete-bulk-product-confirmation');
            }
        });
        return actions;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataManager
                data={data}
                rowSelection={rowSelection}
                multiRowSelection={multiRowSelection}
                onChange={onChange}
                enableEdit={enableEdit}
                paginationMode={paginationMode}
                enablePagination={enablePagination}
                title={'Manage Product Prices'}
                rowSelectActions={getRowSelectActions()}
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={productRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Price Type', key: 'price_type.label' },
                    { label: 'Label', key: 'label' },
                    { label: 'Amount', key: 'amount' },
                    { label: 'Currency', key: 'currency.name' },
                    { label: 'Country', key: 'country.name' },
                    { label: 'Valid From', key: 'valid_from' },
                    { label: 'Valid To', key: 'valid_to' },
                    { label: 'Is Active', key: 'is_active' },
                    { label: 'Is Default', key: 'is_default' },
                    { label: 'Created At', key: 'created_at' },
                    { label: 'Updated At', key: 'updated_at' },
                ]}
            />
        </Suspense>
    );
}
export default ManageProductPrice;