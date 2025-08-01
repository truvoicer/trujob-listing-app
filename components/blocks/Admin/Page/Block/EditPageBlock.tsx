import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import { CreatePageBlock, PageBlock, PageBlockRequest, UpdatePageBlock } from "@/types/PageBlock";
import EditPageBlockFields from "./EditPageBlockFields";
import { Form } from "formik";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware, ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Role } from "@/types/Role";
import { Sidebar } from "@/types/Sidebar";
import { isObjectEmpty } from "@/helpers/utils";
import { DataTableContextType } from "@/components/Table/DataManager";
import { DataManagerService } from "@/library/services/data-manager/DataManagerService";


type EditPageBlockProps = {
    operation: 'edit' | 'update' | 'add' | 'create';
    inModal?: boolean;
    modalId?: string;
    pageId?: number;
    index?: number;
    data?: PageBlock;
        dataTable?: DataTableContextType;
}
function EditPageBlock({ 
    dataTable,
    data,
    index,
    pageId,
    operation,
    inModal = false,
    modalId,
 }: EditPageBlockProps) {

    const [alert, setAlert] = useState<{
        show: boolean;
        message: string | React.ReactNode | React.Component;
        type: string;
    } | null>(null);

    const truJobApiMiddleware = TruJobApiMiddleware.getInstance();

    const [initialValues, setInitialValues] = useState<PageBlock | null>(null);

    async function pageBlockRequest() {
        if (!pageId) {
            console.log('PageBlock ID is required');
            return;
        }
        if (!data?.id) {
            console.log('Page block ID is required');
            return;
        }
        const response = await truJobApiMiddleware.resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.pageBlockRel.replace('%s', pageId.toString())}/${data.id}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            return;
        }
        if (!response?.data) {
            console.log('No data found');
            return;
        }
        setInitialValues(response.data);
    }
    function buildSidebarIdData(sidebars: Array<Sidebar>): Array<number> {
        const filterSidebarData: Array<Sidebar> = sidebars
            .filter((sidebar: Sidebar | number) => {
                if (typeof sidebar === 'object') {
                    return sidebar.id;
                }
                return false;
            });
        return filterSidebarData.map((sidebar: Sidebar) => {
            return sidebar.id;
        });
    }
    function buildRoleIdData(roles: Array<Role>): Array<number> {
        const filterRoleData: Array<Role> = roles
            .filter((role: Role | number) => {
                if (typeof role === 'object') {
                    return role.id;
                }
                return false;
            });
        return filterRoleData.map((role: Role) => {
            return role.id;
        });
    }

    function buildRequestData(values: PageBlock) {
        let requestData: PageBlockRequest = {
            type: values?.type || '',
            default: values?.default || false,
        };
        if (values.hasOwnProperty('nav_title')) {
            requestData.nav_title = values.nav_title;
        }
        if (values.hasOwnProperty('title')) {
            requestData.title = values.title;
        }
        if (values.hasOwnProperty('subtitle')) {
            requestData.subtitle = values.subtitle;
        }
        if (values.hasOwnProperty('background_image')) {
            requestData.background_image = values.background_image;
        }
        if (values.hasOwnProperty('background_color')) {
            requestData.background_color = values.background_color;
        }
        if (values.hasOwnProperty('pagination_type')) {
            requestData.pagination_type = values.pagination_type;
        }
        if (values.hasOwnProperty('pagination')) {
            requestData.pagination = values.pagination;
        }
        if (values.hasOwnProperty('pagination_scroll_type')) {
            requestData.pagination_scroll_type = values.pagination_scroll_type;
        }
        if (values.hasOwnProperty('content')) {
            requestData.content = values.content;
        }
        if (values.hasOwnProperty('properties')) {
            requestData.properties = values.properties;
        }
        if (values.hasOwnProperty('has_sidebar')) {
            requestData.has_sidebar = values.has_sidebar;
        }
        return requestData;
    }

    function buildCreateData(values: PageBlock) {
        let requestData: CreatePageBlock = {
            type: values?.type || '',
            default: values?.default || false,
        };

        if (Array.isArray(values?.sidebars)) {
            requestData.sidebars = buildSidebarIdData(values.sidebars);
        }
        if (Array.isArray(values?.roles)) {
            requestData.roles = buildRoleIdData(values.roles);
        }
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };
        
        return requestData;
    }

    function buildUpdateData(values: PageBlock) {
        let requestData: UpdatePageBlock = {
            id: values.id,
            type: values?.type || '',
            default: values?.default || false,
        };
        
        requestData = {
            ...requestData,
            ...buildRequestData(values),
        };
        return requestData;
    }
    function getRequiredFields() {
        let requiredFields: any = {};
        if (operation === 'edit' || operation === 'update') {
            requiredFields = {
                id: true,
                sidebars: {
                    id: true,
                },
                roles: {
                    id: true,
                },
            };
        }
        return requiredFields;
    }
    async function handleSubmit(values: PageBlock) {
        if (['edit', 'update'].includes(operation) && isObjectEmpty(values)) {
            console.log('No data to update');
            return;
        }
        if (!pageId) {
            console.log('Page ID is required');
            return;
        }
        let response = null;
        let requestData: CreatePageBlock | UpdatePageBlock;
        switch (operation) {
            case 'edit':
            case 'update':
                requestData = buildUpdateData(values);
                console.log('edit requestData', requestData);
                // return;
                if (!requestData?.id) {
                    throw new Error('PageBlock ID is required');
                }
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.pageBlock.replace('%s', pageId.toString())}/${requestData.id}/update`,
                    method: ApiMiddleware.METHOD.PATCH,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            case 'add':
            case 'create':
                requestData = buildCreateData(values);
                console.log('create requestData', requestData);
                // return;
                response = await truJobApiMiddleware.resourceRequest({
                    endpoint: `${truJobApiConfig.endpoints.pageBlock.replace('%s', pageId.toString())}/create`,
                    method: ApiMiddleware.METHOD.POST,
                    protectedReq: true,
                    data: requestData,
                })
                break;
            default:
                console.log('Invalid operation');
                break;
        }
        if (!response) {
            setAlert({
                show: true,
                message: (
                    <div>
                        <strong>Error:</strong>
                        {truJobApiMiddleware.getErrors().map((error: ErrorItem, index: number) => {
                            return (
                                <div key={index}>{error.message}</div>
                            )
                        })}
                    </div>
                ),
                type: 'danger',
            });
            return;
        }
        if (dataTable) {
            dataTable.refresh();
        }
        dataTableContext.refresh();
    }
    const dataTableContext = useContext(DataTableContext);

    useEffect(() => {
        if (!data?.id) {
            return;
        }
        if (['add', 'create'].includes(operation)) {
            setInitialValues(data);
        } else if (['edit', 'update'].includes(operation)) {
            pageBlockRequest()
            return;
        }
    }, [data?.id]);
    useEffect(() => {
        if (!inModal) {
            return;
        }
        if (!modalId) {
            return;
        }

        dataTableContext.modal.update(
            {
                formProps: {
                    operation: operation,
                    initialValues: initialValues,
                    requiredFields: getRequiredFields(),
                    onSubmit: handleSubmit,
                }
            },
            modalId
        );
    }, [inModal, modalId, initialValues]);
    return (
        <div className="row">
            <div className="col-12">
                {alert && (
                    <div className={`alert alert-${alert.type}`} role="alert">
                        {alert.message}
                    </div>
                )}
            {inModal
                    ? (
                        <EditPageBlockFields
                            operation={operation}
                            pageId={pageId}
                        />
                    )
                    : (
                        <Form
                            operation={operation}
                            requiredFields={getRequiredFields()}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        >
                            {() => {
                                return (
                                    <EditPageBlockFields
                                        operation={operation}
                                        pageId={pageId}
                                    />
                                )
                            }}
                        </Form>
                    )}
            </div>
        </div>
    );
}
export default EditPageBlock;