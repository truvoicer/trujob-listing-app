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
import { useRouter } from 'next/navigation';

function AdminPageView({ data, page }) {
    const router = useRouter();
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
                        {...item.props} />;
                })}
            </>
        )
    }
    function renderView(blocks) {
        return (
            <AccessControlComponent
                roles={page?.roles}
                fallback={() => {
                    router.push('/login');
                    return null;
                }}
            >
                <AdminLayout>
                    {blocks}
                </AdminLayout>
            </AccessControlComponent>
        );
    }
    console.log('AdminPageView', data);
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
)(AdminPageView);
