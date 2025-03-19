import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ListingsContext } from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import { SearchContext } from "@/truvoicer-base/library/listings/contexts/SearchContext";
import { ListingsManager } from "@/truvoicer-base/library/listings/listings-manager";
import { TemplateManager } from "@/truvoicer-base/library/template/TemplateManager";
import { TemplateContext } from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import { ListingsGrid } from "@/truvoicer-base/library/listings/grid/listings-grid";
import ListingsItemsLoader from "../items/ListingsItemsLoader";
import { BlockContext } from "../../contexts/BlockContext";
import { PAGE_CONTROL_HAS_MORE, PAGINATION_PAGE_NUMBER, SEARCH_REQUEST_APPEND, SEARCH_STATUS_COMPLETED } from "@/truvoicer-base/redux/constants/search-constants";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import { set } from "date-fns";
import { siteConfig } from "@/config/site-config";
import { objStringToArray } from "@/truvoicer-base/library/utils";

const InfiniteScroll = ({ children }) => {
    const [scrollType, setScrollType] = useState(null);
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const blockContext = useContext(BlockContext);

    const listingsManager = new ListingsManager(listingsContext, searchContext)
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const itemsContext = useContext(ListingsItemsContext);
    const listingsGrid = new ListingsGrid();
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const grid = listingsContext?.listingsGrid;

    const loadMore = (searchObj) => {
        if (!searchObj?.pageControls[PAGE_CONTROL_HAS_MORE]) {
            return false;
        }
        if (searchObj.pageControls.loading) {
            return false;
        }
        if (searchObj.searchStatus !== SEARCH_STATUS_COMPLETED) {
            return false;
        }

        listingsManager.getSearchEngine().updatePageControls({ key: 'loading', value: true });
        listingsManager.getSearchEngine().setSearchEntity('listingsInfiniteScroll');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_APPEND);
        listingsManager.loadNextPageNumberMiddleware(searchObj.pageControls[PAGINATION_PAGE_NUMBER] + 1);
    }
    const handleBlockScroll = (searchObj, blockContext, listingsObj) => {
        const ele = blockContext?.ref?.current;
        const bottom = Math.ceil(ele.scrollTop) >= ele.scrollHeight - ele.clientHeight;
        if (bottom) {
            loadMore(searchObj, listingsObj);
        }
    };
    const handleWindowScroll = (searchObj, blockContext, listingsObj) => {
        const ele = blockContext?.ref?.current;
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= ele.scrollHeight;
        if (bottom) {
            loadMore(searchObj, listingsObj);
        }
    };
    
    function getScrollType() {
        const scrollClassNames = listingsManager.configStrToArray('overflow_classes');
        const scrollStyles = listingsManager.configStrToArray('overflow_styles');
        
        const blockClassNames = blockContext?.ref?.current?.classList;
        const hasScrollClass = scrollClassNames.some((className) => blockClassNames.contains(className));
        const hasScrollStyle = scrollStyles.some((style) => blockContext?.ref?.current?.style[style] === 'scroll');
        if (!hasScrollClass && !hasScrollStyle) {
            setScrollType('document');
        } else {
            setScrollType('block');
        }
    }

    useEffect(() => {
        if (!blockContext?.ref?.current) {
            return;
        }

        getScrollType();

    }, [blockContext]);

    useEffect(() => {
        if (!scrollType) {
            return;
        }

        let windowListener = (e) => {
            e.stopImmediatePropagation();
            handleWindowScroll(searchContext, blockContext, listingsContext);
        };
        let blockListener = (e) => {
            e.stopImmediatePropagation();
            handleBlockScroll(searchContext, blockContext, listingsContext);
        };
        switch (scrollType) {
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
            switch (scrollType) {
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
    }, [searchContext, listingsContext, scrollType]);


    return (
        <>
            {/* {searchContext?.pageControls?.loading && <LoaderComponent key={"loader"}/>} */}
            {children}
            {searchContext?.pageControls?.loading && <p>Loading more...</p>}
            {!searchContext?.pageControls?.loading && searchContext?.pageControls[PAGE_CONTROL_HAS_MORE] && <p>Scroll down to load more...</p>}
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
