import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Core } from "@/library/services/core/Core";
import { BlockContext } from "@/contexts/BlockContext";
import { ProductsContext } from "./contexts/ProductsContext";
import { PAGE_CONTROL_HAS_MORE, SEARCH_REQUEST_IDLE, SEARCH_STATUS_COMPLETED } from "@/library/redux/constants/search-constants";
import { ProductsFetch } from "@/library/services/products/ProductsFetch";

const InfiniteScroll = ({ children }) => {
    const productsContext = useContext(ProductsContext);
    const blockContext = useContext(BlockContext);
    const productsService = Core.getInstance().getProductsService(productsContext);

    const loadMore = (searchObj) => {
        if (!searchObj?.results?.meta?.[PAGE_CONTROL_HAS_MORE]) {
            return false;
        }
        if (searchObj?.loading) {
            return false;
        }
        if (![ ProductsFetch.STATUS.SUCCESS, ProductsFetch.STATUS.IDLE].includes(searchObj.status)) {
            return false;
        }
        
        productsService.getContextService().updateContext({
            query: {
                ...searchObj.query,
                page: searchObj?.results?.meta?.[ProductsFetch.PAGINATION.CURRENT_PAGE] + 1
            },
            options: {
                [ProductsFetch.FETCH_TYPE]: ProductsFetch.FETCH_TYPE_APPEND
            },
            loading: true
        });
    }
    const handleBlockScroll = (searchObj, blockContext) => {
        const ele = blockContext?.ref?.current;
        const bottom = Math.ceil(ele.scrollTop) >= ele.scrollHeight - ele.clientHeight;
        if (bottom) {
            loadMore(searchObj);
        }
    };
    const handleWindowScroll = (searchObj, blockContext) => {
        const ele = blockContext?.ref?.current;
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= ele.scrollHeight;
        if (bottom) {
            loadMore(searchObj);
        }
    };

    useEffect(() => {
        if (!blockContext?.pagination_scroll_type) {
            return;
        }

        let windowListener = (e) => {
            e.stopImmediatePropagation();
            handleWindowScroll(productsContext, blockContext);
        };
        let blockListener = (e) => {
            e.stopImmediatePropagation();
            handleBlockScroll(productsContext, blockContext);
        };
        switch (blockContext.pagination_scroll_type) {
            case 'document':
                document.addEventListener("scroll", windowListener);
                break;
            case 'block':
                blockContext.ref.current.addEventListener("scroll", blockListener);
                break;
            default:
                break;
        }
        return () => {
            switch (blockContext?.pagination_scroll_type) {
                case 'document':
                    document.removeEventListener("scroll", windowListener);
                    break;
                case 'block':
                    blockContext.ref.current.removeEventListener("scroll", blockListener);
                    break;
                default:
                    break;
            }
        }
    }, [blockContext?.pagination_scroll_type, productsContext]);

    return (
        <>
            {children}
            {productsContext?.loading && <p>Loading more...</p>}
            {!productsContext?.loading && productsContext?.results?.meta?.[PAGE_CONTROL_HAS_MORE] && <p>Scroll down to load more...</p>}
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.session.user,
    };
}

export default connect(
    mapStateToProps,
    null
)(InfiniteScroll);
