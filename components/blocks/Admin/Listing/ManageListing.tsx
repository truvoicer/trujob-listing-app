import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import BadgeDropDown from "@/components/BadgeDropDown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import DataManager from "@/components/Table/DataManager";

export const EDIT_LISTING_MODAL_ID = 'edit-listing-modal';

function ManageListing() {
    function renderActionColumn(item, index, dataTableContextState) {
        return (
            <div className="d-flex align-items-center list-action">
                <Link className="badge bg-success-light mr-2"
                    target="_blank"
                    href="http://google.com"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        dataTableContextState.modal.show({
                            title: 'Edit Listing',
                            // component: (
                            //     <EditPage
                            //         data={item}
                            //         operation={'edit'}
                            //     />
                            // ),
                            show: true,
                            showFooter: false,
                            fullscreen: true
                        }, EDIT_LISTING_MODAL_ID);
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
                                        title: 'Edit Listing',
                                        // component: (
                                        //     <EditPage
                                        //         data={item}
                                        //         operation={'edit'}
                                        //     />
                                        // ),
                                        show: true,
                                        showFooter: false
                                    }, EDIT_LISTING_MODAL_ID);
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
                                        title: 'Delete Page',
                                        component: (
                                            <p>Are you sure you want to delete this page ({item?.title})?</p>
                                        ),
                                        onOk: async () => {
                                            if (!item?.id || item?.id === '') {
                                                throw new Error('Page ID is required');
                                            }
                                            const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                                                endpoint: `${truJobApiConfig.endpoints.page}/${item.id}`,
                                                method: ApiMiddleware.METHOD.DELETE,
                                                protectedReq: true
                                            })
                                            if (!response) {
                                                return;
                                            }
                                        },
                                        show: true,
                                        showFooter: true
                                    }, EDIT_LISTING_MODAL_ID);
                                }
                            }
                        }
                    ]}
                />
            </div>
        )
    }
    async function pageRequest({ dataTableContextState, setDataTableContextState }) {
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.page}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
            query: dataTableContextState?.query || {},
            post: dataTableContextState?.post || {},
        })
        if (!response) {
            return;
        }
        setDataTableContextState(prevState => {
            let newState = { ...prevState };
            newState.data = response.data;
            newState.links = response.links;
            newState.meta = response.meta;
            return newState;
        });
    }
    function renderAddNew(e, { dataTableContextState, setDataTableContextState }) {
        e.preventDefault();
        // e.stopPropagation();
        console.log('Add New Page', dataTableContextState.modal);
        dataTableContextState.modal.show({
            title: 'Add New Page',
            // component: (
            //     <EditPage
            //         operation={'add'}
            //     />
            // ),
            show: true,
            showFooter: false
        }, EDIT_LISTING_MODAL_ID);
    }
    return (
        <DataManager
            renderAddNew={renderAddNew}
            renderActionColumn={renderActionColumn}
            request={pageRequest}
            columns={[
                { label: 'ID', key: 'id' },
                { label: 'Title', key: 'title' },
                { label: 'Permalink', key: 'permalink' }
            ]}
        />
    );
}
export default ManageListing;