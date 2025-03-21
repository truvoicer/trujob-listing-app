import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Core } from "@/library/services/core/Core";
import { BlockContext } from "@/contexts/BlockContext";
import { ListingsContext } from "./contexts/ListingsContext";
import { PAGE_CONTROL_HAS_MORE, SEARCH_REQUEST_IDLE, SEARCH_STATUS_COMPLETED } from "@/library/redux/constants/search-constants";
import { ListingsFetch } from "@/library/services/listings/ListingsFetch";

const InfiniteScroll = ({ children }) => {
    const listingsContext = useContext(ListingsContext);
    const blockContext = useContext(BlockContext);
    const listingsService = Core.getInstance().getListingsService(listingsContext);

    const loadMore = (searchObj) => {
        if (!searchObj?.results?.meta?.[PAGE_CONTROL_HAS_MORE]) {
            return false;
        }
        if (searchObj?.loading) {
            return false;
        }
        if (![ ListingsFetch.STATUS.SUCCESS, ListingsFetch.STATUS.IDLE].includes(searchObj.status)) {
            return false;
        }
        listingsService.getContextService().updateContext({
            query: {
                ...searchObj.query,
                page: searchObj?.results?.meta?.[ListingsFetch.PAGINATION.CURRENT_PAGE] + 1
            },
            options: {
                [ListingsFetch.FETCH_TYPE]: ListingsFetch.FETCH_TYPE_APPEND
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
            handleWindowScroll(listingsContext, blockContext);
        };
        let blockListener = (e) => {
            e.stopImmediatePropagation();
            handleBlockScroll(listingsContext, blockContext);
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
    }, [blockContext?.pagination_scroll_type, listingsContext]);

    return (
        <>
            {children}
            {listingsContext?.loading && <p>Loading more...</p>}
            {!listingsContext?.loading && listingsContext?.results?.meta?.[PAGE_CONTROL_HAS_MORE] && <p>Scroll down to load more...</p>}
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
