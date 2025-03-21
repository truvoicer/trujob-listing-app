'use client';
import React from 'react';
import ListingsLayout from "@/components/layout/Listings/ListingsLayout";
import sidebarConfig from "@/components/listings/sidebar/config/sidebar-config";
import { BlockFactory } from "@/components/factories/block/BlockFactory";
import WidgetGroup from "@/components/listings/sidebar/partials/WidgetGroup";
import { Blocks } from "@/components/factories/block/Blocks";
import BlockComponent from '../blocks/BlockComponent';

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
    return (
        <ListingsLayout>
            {renderBlocks(buildBlocks(
                Array.isArray(data?.blocks) ? data.blocks : []
            ))}
        </ListingsLayout>
    );
}

export default PageView;
