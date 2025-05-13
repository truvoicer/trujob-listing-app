import Reorder, { ReorderOnAdd, ReorderOnDelete, ReorderOnMove, ReorderOnOk } from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import SelectBlock from "./SelectBlock";
import { DataTableContext } from "@/contexts/DataTableContext";
import { PageBlock } from "@/types/PageBlock";
import EditPageBlock from "./Block/EditPageBlock";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { FormikProps, FormikValues } from "formik";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { RequestHelpers } from "@/helpers/RequestHelpers";
import { DebugHelpers } from "@/helpers/DebugHelpers";

type PageBlockFormProps = {
    pageId?: number;
    data?: Array<PageBlock> | undefined;
    onChange: (data: any) => void;
    operation: 'edit' | 'update' | 'add' | 'create';
}
function PageBlockForm({ pageId, data, onChange, operation }: PageBlockFormProps) {

    const [pageBlocks, setPageBlocks] = useState<Array<PageBlock>>([]);

    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const pageBlockSchema = {
        default: false,
        nav_title: '',
        title: '',
        subtitle: '',
        background_image: '',
        background_color: '',
        pagination_type: '',
        pagination: false,
        pagination_scroll_type: '',
        properties: [],
        content: '',
        has_sidebar: false,
        sidebar_widgets: [],
    };

    function handleChange(values: Array<PageBlock>) {
        setPageBlocks(values);
    }

    function validatePageId(): boolean {
        if (!pageId) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Page id not found
                    </p>
                ),
            }, 'page-block-form-validate-page-id-error');
            DebugHelpers.log(DebugHelpers.WARN, 'Page id not found', pageId);
            return false;
        }
        return true;
    }
    function handleAddPageBlock({
        reorderData,
        onChange,
    }: ReorderOnAdd) {
        dataTableContext.modal.show({
            component: (
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <SelectBlock name={'pageBlock'} />
                    </div>
                </div>
            ),
            showFooter: true,
            formProps: {
                operation: 'add',
                initialValues: { pageBlock: null },
            },
            onOk: async ({ formHelpers }: {
                formHelpers: FormikProps<FormikValues>;
            }) => {
                const selectedPageBlock = formHelpers?.values?.pageBlock;
                if (!selectedPageBlock) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                PageBlock not found
                            </p>
                        ),
                    }, 'pageBlock-form-select-pageBlock-error');
                    DebugHelpers.log(DebugHelpers.WARN, 'PageBlock not found', selectedPageBlock);
                    return false;
                }
                if (!selectedPageBlock?.id) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                PageBlock id not found
                            </p>
                        ),
                    }, 'pageBlock-form-select-pageBlock-id-error');
                    DebugHelpers.log(DebugHelpers.WARN, 'PageBlock id not found', selectedPageBlock);
                    return false;
                }

                if (['add', 'create'].includes(operation || '')) {
                    setPageBlocks(
                        [...pageBlocks, {
                            ...pageBlockSchema,
                            ...formHelpers?.values?.pageBlock
                        }]
                    );
                    return true;
                }

                if (!validatePageId() || !pageId) {
                    return false;
                }
                const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.pageBlock.replace('%s', pageId.toString())}/${selectedPageBlock.id}/create`,
                    method: TruJobApiMiddleware.METHOD.POST,
                    protectedReq: true,
                });
                if (!response) {
                    notificationContext.show({
                        variant: 'danger',
                        title: 'Error',
                        component: (
                            <p>
                                Page block add failed
                            </p>
                        ),
                    }, 'sidebar-pageBlock-add-error');
                    DebugHelpers.log(DebugHelpers.WARN, 'pageBlock add failed', response);
                    return false;
                }
                notificationContext.show({
                    variant: 'success',
                    title: 'Success',
                    component: (
                        <p>
                            pageBlock added successfully
                        </p>
                    ),
                }, 'sidebar-pageBlock-add-success');
                pageBlocksRequest();
                dataTableContext.modal.close('pageBlock-form-select-pageBlock');
                return true;
            }
        }, 'pageBlock-form-select-pageBlock');
    }

    async function handleMovePageBlock({
        direction,
        reorderData,
        onChange,
        itemSchema,
        newIndex,
        index,
        item
    }: ReorderOnMove) {
        if (!['up', 'down'].includes(direction)) {
            return false;
        }

        if (['add', 'create'].includes(operation || '')) {
            return true;
        }
        if (!validatePageId() || !pageId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${item.id}/reorder`,
            method: TruJobApiMiddleware.METHOD.POST,
            protectedReq: true,
            data: {
                direction
            }
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Page block moved successfully
                    </p>
                ),
            }, 'sidebar-item-move-success');
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Page block move failed
                </p>
            ),
        }, 'sidebar-item-move-error');
        return false;

    }

    async function handleDeletePageBlock({
        item,
    }: ReorderOnDelete) {

        if (['add', 'create'].includes(operation || '')) {
            setPageBlocks(
                pageBlocks.filter((pageBlock: PageBlock) => {
                    return pageBlock.id !== item.id;
                })
            );
            return true;
        }
        if (!validatePageId() || !pageId) {
            return;
        }

        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        Page block id not found
                    </p>
                ),
            }, 'sidebar-item-delete-error');
            DebugHelpers.log(DebugHelpers.WARN, 'Page block id not found', item);
            return false;
        }

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${item.id}/delete`,
            method: TruJobApiMiddleware.METHOD.DELETE,
            protectedReq: true,
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        Page block deleted successfully
                    </p>
                ),
            }, 'sidebar-item-delete-success');
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    Page block delete failed
                </p>
            ),
        }, 'sidebar-item-delete-error');

        return false;
    }

    async function handleOk({
        formHelpers
    }: ReorderOnOk) {
        if (!formHelpers) {
            return;
        }
        
        const item = { ...formHelpers.values };
        if (!item?.id) {
            notificationContext.show({
                variant: 'danger',
                title: 'Error',
                component: (
                    <p>
                        pageBlock id not found
                    </p>
                ),
            }, 'sidebar-pageBlock-update-error');
            DebugHelpers.log(DebugHelpers.WARN, 'pageBlock id not found', item);
            return false;
        }
        if (['add', 'create'].includes(operation || '')) {
            if (item.hasOwnProperty('index')) {
                setPageBlocks(prevState => {
                    let newState = [...prevState];
                    if (newState?.[item.index]) {
                        newState[item.index] = item;
                    }
                    return newState;
                });
            } else {
                setPageBlocks([...pageBlocks, item]);
            }
            return true;
        }
        if (['add', 'create'].includes(operation || '')) {
            if (Array.isArray(item?.roles)) {
                item.roles = RequestHelpers.extractIdsFromArray(item.roles);
            }
            if (Array.isArray(item?.sidebars)) {
                item.sidebars = RequestHelpers.extractIdsFromArray(item.sidebars);
            }
        } else if (['edit', 'update'].includes(operation || '')) {
            delete item?.roles;
            delete item?.sidebars;
        }
        if (!validatePageId() || !pageId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${item.id}/update`,
            method: TruJobApiMiddleware.METHOD.PATCH,
            protectedReq: true,
            data: item
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                title: 'Success',
                component: (
                    <p>
                        pageBlock updated successfully
                    </p>
                ),
            }, 'sidebar-pageBlock-update-success');
            pageBlocksRequest();
            return true;
        }
        notificationContext.show({
            variant: 'danger',
            title: 'Error',
            component: (
                <p>
                    pageBlock update failed
                </p>
            ),
        }, 'sidebar-pageBlock-update-error');
        return false;
    }

    async function pageBlocksRequest() {
        DebugHelpers.log(DebugHelpers.DEBUG, 'pageBlocksRequest', pageId);
        if (!validatePageId() || !pageId) {
            return;
        }
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlock.replace('%s', pageId.toString())}`,
            method: TruJobApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return;
        }
        const data = response?.data || [];
        setPageBlocks(data);
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(pageBlocks);
        }
    }, [pageBlocks]);

    useEffect(() => {
        if (['create', 'add'].includes(operation || '')) {
            return;
        }
        if (!pageId) {
            return;
        }
        pageBlocksRequest();
    }, [pageId]);
    useEffect(() => {
        if (!['create', 'add'].includes(operation || '')) {
            return;
        }
        if (!data) {
            return;
        }
        if (!Array.isArray(data)) {
            DebugHelpers.log(DebugHelpers.WARN, 'pageBlock data is not an array');
            return;
        }
        setPageBlocks(data);

    }, []);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    modalState={dataTableContext.modal}
                    itemSchema={pageBlockSchema}
                    itemHeader={(item, index) => {
                        return item?.type || 'Item type error'
                    }}
                    onChange={handleChange}
                    onAdd={handleAddPageBlock}
                    data={pageBlocks || []}
                    onDelete={handleDeletePageBlock}
                    onMove={handleMovePageBlock}
                    onOk={handleOk}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <>
                            <EditPageBlock
                                pageId={pageId}
                                data={{
                                    ...item,
                                    index: index,
                                }}
                                operation={operation}
                                inModal={true}
                                modalId={'reorder-modal'}
                                index={index}
                            />
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default PageBlockForm;