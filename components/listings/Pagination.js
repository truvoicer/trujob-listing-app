import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListingsContext } from './contexts/ListingsContext';
import { ListingsFetch } from "@/library/services/listings/ListingsFetch";
import { Core } from "@/library/services/core/Core";
import { SESSION_USER } from "@/library/redux/constants/session-constants";

const Pagination = (props) => {
    const {
        showIndicator = true,
        children
    } = props;
    const [padding, setPadding] = useState(2);
    const [pageNumber, setPageNumber] = useState(1);
    const searchParams = useSearchParams();
    const pageQueryVal = searchParams.get('page');

    const core = Core.getInstance();
    const listingsService = core.getListingsService(useContext(ListingsContext));

    const lastPageNumber = getLastPageNumber();

    const paginationClickHandler = (e, pageNumber) => {
        // e.preventDefault();
        listingsService.contextService.updateContext({
            query: {
                ...listingsService.contextService.context.query,
                [ListingsFetch.PAGINATION.PAGE]: pageNumber
            }
        });
    }

    function getLastPageNumber() {
        if (listingsService.contextService.context.results.meta?.[ListingsFetch.PAGINATION.LAST_PAGE]) {
            return listingsService.contextService.context.results.meta[ListingsFetch.PAGINATION.LAST_PAGE];
        }
        if (listingsService.contextService.context.results.meta[ListingsFetch.PAGINATION.TOTAL_PAGES] && listingsService.contextService.context.results.meta[ListingsFetch.PAGINATION.TOTAL_ITEMS]) {
            const calculate = Math.ceil(
                listingsService.contextService.context.results.meta[ListingsFetch.PAGINATION.TOTAL_ITEMS] / listingsService.contextService.context.results.meta[ListingsFetch.PAGINATION.PAGE_SIZE]
            );
            return calculate;
        }
        return 1;
    }

    function getCurrentPageNumber() {
        const pageQueryVal = searchParams.get('page');
        if (pageQueryVal) {
            return parseInt(pageQueryVal);
        }
        const pageControls = listingsService.contextService.context.results.meta;
        return pageControls?.[ListingsFetch.PAGINATION.CURRENT_PAGE] || 1;
    }

    const getpadding = (currentPage) => {
        let right = [];
        let left = [];
        if (currentPage >= lastPageNumber) {
            right = [];
            for (let i = currentPage - padding; i < currentPage; i++) {
                if (i > 1 && i < lastPageNumber) {
                    left.push(i)
                }
            }
        } else if (currentPage <= 1) {
            left = [];
            for (let i = currentPage; i < currentPage + padding + 1; i++) {
                if (i > 1 && i < lastPageNumber) {
                    right.push(i)
                }
            }
        } else {
            for (let i = currentPage - padding; i <= currentPage; i++) {
                if (i > 1 && i < lastPageNumber) {
                    left.push(i)
                }
            }
            for (let i = currentPage + 1; i < currentPage + padding + 1; i++) {
                if (i > 1 && i < lastPageNumber) {
                    right.push(i)
                }
            }
        }
        return {
            left,
            right
        };
    }

    function getPageLinkProps(page) {
        return {
            scroll: false,
            href: {
                query: {
                    page: page
                }
            },
            onClick: (e) => {
                paginationClickHandler(e, page)
            }
        }
    }

    useEffect(() => {
        setPageNumber(getCurrentPageNumber());
    }, [listingsService.contextService.context.results.meta?.[ListingsFetch.PAGINATION.PAGE], pageQueryVal]);

    let { left, right } = getpadding(pageNumber);
    
    return (
        <>
            {children}

            <div className="custom-pagination text-center">
                <Link
                    className={""}
                    {...getPageLinkProps(1)}
                >
                    <span>1</span>
                </Link>
                {left.length > 1 &&
                <span className="more-page">...</span>
                }
                {left.map((num, index) => (
                    <Link
                        key={index}
                        className={""}
                        {...getPageLinkProps(num)}
                    >
                        <span>{num}</span>
                    </Link>
                ))}
                {right.map((num, index) => (
                    <Link
                        key={index}
                        className={""}
                        {...getPageLinkProps(num)}
                    >
                        <span>{num}</span>
                    </Link>
                ))}
                {right.length > 1 &&
                    <span className="more-page">...</span>
                }
                {lastPageNumber > 1 &&
                    <Link
                        {...getPageLinkProps(lastPageNumber)}
                    >
                        <span>{lastPageNumber}</span>
                    </Link>
                }
                {showIndicator &&
                    <span className="page-numbers">
                        {`Page ${pageNumber} of ${lastPageNumber}`}
                    </span>
                }
            </div>
        </>
    );
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(Pagination);
