'use client';
import React from 'react';
import { BlockFactory } from "@/components/factories/block/BlockFactory";
import BlockComponent from '../../../blocks/BlockComponent';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import ListingLayoutFull from '@/components/Theme/Listing/ListingLayoutFull';
import ListingLayoutSidebar from '../ListingLayoutSidebar';
import SessionLayout from '../SessionLayout';

function PageView({ data }) {
    const blockFactory = new BlockFactory();
    function buildBlocks(blockData) {
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
    function renderBlocks(blockData) {
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
    function renderView(blocks) {
        if (data?.has_sidebar) {
            return (
                <SessionLayout>
                    <ListingLayoutSidebar>
                        {blocks}
                    </ListingLayoutSidebar>
                </SessionLayout>
            )
        }
        return (
            <SessionLayout>
                <ListingLayoutFull>
                    {blocks}
                </ListingLayoutFull>
            </SessionLayout>
        );
    }

    return renderView(
        renderBlocks(
            buildBlocks(Array.isArray(data?.blocks) ? data.blocks : [])
        )
    );
}

export default connect(
    (state) => {
        return {
            page: state[PAGE_STATE],
        }
    }
)(PageView);
