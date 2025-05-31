import { AppModalContext } from "@/contexts/AppModalContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { Suspense, useContext } from "react";
import EditProductFeature from "./EditProductFeature";
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
import { Feature } from "@/types/Feature";
import { ModalItem } from "@/library/services/modal/ModalService";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";

export const CREATE_PRODUCT_FEATURE_MODAL_ID = 'create-features-modal';
export const DELETE_PRODUCT_FEATURE_MODAL_ID = 'delete-product-feature-modal';
export const EDIT_PRODUCT_FEATURE_MODAL_ID = 'edit-product-feature-modal';


export interface ManageProductFeatureProps extends DataManageComponentProps {
    data?: Array<Feature>;
    productId?: number;
}

function ManageProductFeature({
    mode = 'selector',
    data = [],
    operation,
    productId,
    rowSelection = true,
    multiRowSelection = true,
    onChange,
    paginationMode = 'router',
    enablePagination = true,
    enableEdit = true
}: ManageProductFeatureProps) {
    const appModalContext = useContext(AppModalContext);
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    function getProductFormModalProps(index?: number) {
        return {
            formProps: {
                operation: operation,
                initialValues: {
                    features: [],
                },
            },
            show: true,
            showFooter: true,
            onOk: async ({ formHelpers }: {
                formHelpers?: FormikProps<FormikValues>
            }) => {
                if (!formHelpers) {
                    return;
                }
                if (!operation) {
                    console.warn('Operation is required');
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
                            values: formHelpers?.values?.features,
                            index
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
                            title: 'Edit Product',
                            component: (
                                <EditProductFeature
                                    productId={productId}
                                    data={item}
                                    operation={'edit'}
                                    inModal={true}
                                    modalId={EDIT_PRODUCT_FEATURE_MODAL_ID}
                                />
                            ),
                            ...getProductFormModalProps(index),
                        }, EDIT_PRODUCT_FEATURE_MODAL_ID);
                    }}
                >
                    <i className="lar la-eye"></i>
                </Link>
                <Link className="badge bg-danger-light mr-2"
                    target="_blank"
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContext.modal.show({
                            title: 'Delete Product Feature',
                            component: (
                                <p>Are you sure you want to delete this feature ({item?.label})?</p>
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
                                    dataTableContext.modal.close(DELETE_PRODUCT_FEATURE_MODAL_ID);
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
                                    }, 'product-feature-delete-error');
                                    return;
                                }
                                if (!item?.id) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Feature ID is required</p>
                                        ),
                                    }, 'product-feature-delete-error');
                                    return;
                                }
                                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                    endpoint: UrlHelpers.urlFromArray([
                                        truJobApiConfig.endpoints.productFeature.replace(':productId', productId.toString()),
                                        item.id,
                                        'delete'
                                    ]),
                                    method: ApiMiddleware.METHOD.DELETE,
                                    protectedReq: true
                                })
                                if (!response) {
                                    notificationContext.show({
                                        variant: 'danger',
                                        type: 'toast',
                                        title: 'Error',
                                        component: (
                                            <p>Failed to delete product feature</p>
                                        ),
                                    }, 'product-feature-delete-error');
                                    return;
                                }
                                dataTableContextState.refresh();

                            },
                            show: true,
                            showFooter: true
                        }, DELETE_PRODUCT_FEATURE_MODAL_ID);
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
                                            <EditProductFeature
                                                productId={productId}
                                                data={item}
                                                operation={'edit'}
                                                inModal={true}
                                                modalId={EDIT_PRODUCT_FEATURE_MODAL_ID}
                                            />
                                        ),
                                        ...getProductFormModalProps(index),
                                    }, EDIT_PRODUCT_FEATURE_MODAL_ID);
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
                                            if (!productId) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Product ID is required</p>
                                                    ),
                                                }, 'product-feature-delete-error');
                                                return;
                                            }
                                            if (!item?.id) {
                                                notificationContext.show({
                                                    variant: 'danger',
                                                    type: 'toast',
                                                    title: 'Error',
                                                    component: (
                                                        <p>Product feature ID is required</p>
                                                    ),
                                                }, 'product-feature-delete-error');
                                                return;
                                            }

                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: UrlHelpers.urlFromArray([
                                                    truJobApiConfig.endpoints.productFeature.replace(
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
                                                        <p>Failed to delete product feature</p>
                                                    ),
                                                }, 'product-feature-delete-error');
                                                return;
                                            }
                                            dataTableContextState.refresh();
                                        },
                                        show: true,
                                        showFooter: true
                                    }, EDIT_PRODUCT_FEATURE_MODAL_ID);
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
        if (['add', 'create'].includes(operation)) {
            return;
        }
        if (!productId) {
            console.warn('Product ID is required');
            return;
        }
        let query = dataTableContextState?.query || {};
        const preparedQuery = await prepareSearch(searchParams);
        query = {
            ...query,
            ...preparedQuery
        }

        return await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.productFeature.replace(':productId', productId.toString()),
            ]),
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: query,
            data: dataTableContextState?.post || {},
        });
    }
    function renderAddNew(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { dataTableContextState, setDataTableContextState }: {
        dataTableContextState: DataTableContextType,
        setDataTableContextState: React.Dispatch<React.SetStateAction<DataTableContextType>>,
    }) {
        e.preventDefault();
        // e.stopPropagation();
        dataTableContext.modal.show({
            title: 'Add New Product Feature',
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
                    <EditProductFeature
                        productId={productId}
                        operation={operation}
                        inModal={true}
                        modalId={CREATE_PRODUCT_FEATURE_MODAL_ID}
                    />
                )
            },
            ...getProductFormModalProps(),
        }, CREATE_PRODUCT_FEATURE_MODAL_ID);
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
                title={'Manage Products Features'}
                rowSelectActions={getRowSelectActions()}
                renderAddNew={renderAddNew}
                renderActionColumn={renderActionColumn}
                request={productRequest}
                columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Label', key: 'label' },
                    { label: 'Name', key: 'name' }
                ]}
            />
        </Suspense>
    );
}
export default ManageProductFeature;