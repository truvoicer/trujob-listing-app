'use client';
import React from 'react';
import { BlockFactory } from "@/components/factories/block/BlockFactory";
import BlockComponent from '../../../blocks/BlockComponent';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import ListingLayoutFull from '@/components/Theme/Listing/ListingLayoutFull';
import ListingLayoutSidebar from '../ListingLayoutSidebar';
import AccessControlComponent from '@/components/AccessControl/AccessControlComponent';
import ErrorView from '../Error/ErrorView';
import Loader from '@/components/Loader';
import { Page } from '@/types/Page';
import { PageBlock } from '@/types/PageBlock';

type Props = {
    data: Page;
    page: Page;
}
type BlockData = {
    component: any;
    props: any;
}
function PageView({ 
    data, 
    page 
}: Props) {
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
                        className={'site-blocks-cover overlay'}
                        {...item.props} />;
                })}
            </>
        )
    }
    
    function renderView(blocks: React.ReactNode) {
        if (data?.has_sidebar) {
            return (
                <ListingLayoutSidebar>
                    <AccessControlComponent
                    roles={page?.roles}
                        loader={() => <Loader fullScreen />}
                        fallback={() => <ErrorView message={"1You do not have permission to view this page."} />}
                    >
                        {blocks}
                    </AccessControlComponent>
                </ListingLayoutSidebar>
            )
        }
        return (
            <ListingLayoutFull>
                <AccessControlComponent
                    roles={page?.roles}
                    loader={() => <Loader fullScreen />}
                    fallback={() => <ErrorView message={"2You do not have permission to view this page."} />}
                >
                    {blocks}
                </AccessControlComponent>
            </ListingLayoutFull>
        );
    }
    
    return renderView(
        renderBlocks(
            buildBlocks(data?.blocks || [])
        )
    );
}

export default connect(
    (state: any) => {
        return {
            page: state[PAGE_STATE],
        }
    }
)(PageView);
