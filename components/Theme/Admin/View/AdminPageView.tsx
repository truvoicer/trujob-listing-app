'use client';
import React, { useEffect } from 'react';
import { BlockFactory } from "@/components/factories/block/BlockFactory";
import BlockComponent from '../../../blocks/BlockComponent';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import AdminLayout from '../Layouts/AdminLayout';
import AccessControlComponent from '@/components/AccessControl/AccessControlComponent';
import Loader from '@/components/Loader';
import ErrorView from '../Error/ErrorView';
import { useRouter, useSearchParams } from 'next/navigation';
import TabLayout, { TabItem } from '@/components/Layout/TabLayout';
import { Page } from '@/types/Page';
import { PageBlock } from '@/types/PageBlock';
import { SESSION_STATE } from '@/library/redux/constants/session-constants';
import { UrlHelpers } from '@/helpers/UrlHelpers';

type Props = {
    data: Page;
    page: Page;
    session: any;
}
type BlockData = {
    component: any;
    props: any;
}
function AdminPageView({ data, page, session }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const blockFactory = new BlockFactory();
    function buildBlocks(blockData: Array<PageBlock>) {
        return blockData.map((item, index) => {
            let itemProps = item?.props || {};
            const getBlock = blockFactory.renderBlock(item?.type);
            itemProps = {
                ...item,
            }
            if (typeof getBlock?.props === 'object') {
                itemProps = {
                    ...itemProps,
                    ...getBlock.props,
                }
            }
            return {
                component: getBlock?.component,
                props: itemProps,
            }
        });
    }
    function renderBlocks(blockData: Array<BlockData>) {
        return (
            <>
                {blockData.map((item, index) => {
                    if (!item) {
                        return null;
                    }
                    return <BlockComponent key={index}
                        firstBlock={index === 0}
                        lastBlock={index === blockData.length - 1}
                        component={item.component}
                        {...item.props} />;
                })}
            </>
        )
    }

    function buildTabbedBlocks(blockData: Array<BlockData>) {
        const tabbedBlocks: Array<TabItem> = [];
        blockData.forEach((item, index) => {
            const tabItem = {
                ...item.props,
                key: index.toString(),
                component: <BlockComponent
                    key={index}
                    firstBlock={index === 0}
                    lastBlock={index === blockData.length - 1}
                    component={item.component}
                    {...item.props}
                />,
            };
            tabbedBlocks.push(tabItem);
        });
        return tabbedBlocks;

    }

    function renderView(blocks: Array<BlockData>) {
        return (
            <AccessControlComponent
                roles={page?.roles}
                fallback={() => {
                    const redirectStr = UrlHelpers.createQueryString(
                        searchParams,
                        [
                            {
                                name: 'redirect',
                                value: window.location.pathname + window.location.search,
                            }
                        ]
                    );
                    router.push('/login' + '?' + redirectStr);
                    return null;
                }}
            >
                {data?.view === 'admin_page' && (
                    <AdminLayout>
                        {renderBlocks(blocks)}
                    </AdminLayout>
                )}
                {data?.view === 'admin_tab_page' && (
                    <AdminLayout>
                        <TabLayout
                            config={buildTabbedBlocks(blocks)}
                        />
                    </AdminLayout>
                )}
            </AccessControlComponent>
        );
    }
    

    return renderView(
        buildBlocks(Array.isArray(data?.blocks) ? data.blocks : [])
    );
}

export default connect(
    (state: any) => {
        return {
            page: state[PAGE_STATE],
            session: state[SESSION_STATE],
        }
    }
)(AdminPageView);
