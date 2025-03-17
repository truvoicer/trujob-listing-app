'use client';
import React from 'react';
import ListingsLayout from "@/components/layout/Listings/ListingsLayout";
import sidebarConfig from "@/components/listings/sidebar/config/sidebar-config";
import {BlockFactory} from "@/components/factories/block/BlockFactory";
import WidgetGroup from "@/components/listings/sidebar/partials/WidgetGroup";
import {Blocks} from "@/components/factories/block/Blocks";
const blockConfig = [
    {
        name: Blocks.HERO_BLOCK,
    },
    {
        name: Blocks.FEATURED_BLOCK,
    },
    {
        name: Blocks.ICON_GRID_BLOCK,
    },
    {
        name: Blocks.LISTINGS_GRID_BLOCK,
        props: {
            title: "Featured Listings",
            subTitle: 'Choose product you want',
            sidebarData: sidebarConfig,
            itemContainerClass: 'col-lg-6',
        }
    },
]
function PageView({data}) {
    const blockFactory = new BlockFactory();
    function buildBlocks(blockData) {
        return blockData.map((item, index) => {
            let itemProps = item?.props || {};
            const getBlock = blockFactory.renderBlock(item?.type);
            itemProps = {
                ...item,
            }
            if (getBlock?.props) {
                itemProps = {
                    ...getBlock.props,
                    ...itemProps,
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

                    if (!item?.component) {
                        return null;
                    }
                    const BlockComponent = item.component;
                    const blockProps = item?.props || {};

                    return <BlockComponent key={index} {...blockProps} />;
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
