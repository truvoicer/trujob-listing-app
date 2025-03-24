'use client';
import React from 'react';
import sidebarConfig from "@/components/listings/sidebar/config/sidebar-config";
import { BlockFactory } from "@/components/factories/block/BlockFactory";
import WidgetGroup from "@/components/listings/sidebar/partials/WidgetGroup";
import { Blocks } from "@/components/factories/block/Blocks";
import BlockComponent from '../blocks/BlockComponent';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import ListingLayoutFull from '@/components/Theme/Listing/ListingLayoutFull';
import ListingLayoutSidebar from '../Theme/Listing/ListingLayoutSidebar';

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
                    if (Array.isArray(item) && item.length > 0) {
                        return (
                            <WidgetGroup key={index} widgets={item} />
                        )
                    }

                    if (!item) {
                        return null;
                    }

                    return <BlockComponent key={index} component={item.component} {...item.props} />;
                })}
            </>
        )
    }
    function renderView(blocks) {
        if (data?.has_sidebar) {
            return (
                <ListingLayoutSidebar>
                    {blocks}
                </ListingLayoutSidebar>
            )
        }
        return (
            <ListingLayoutFull>
                {blocks}
            </ListingLayoutFull>
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
