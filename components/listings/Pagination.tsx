import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListingsFetch } from "@/library/services/listings/ListingsFetch";
import { SESSION_USER } from "@/library/redux/constants/session-constants";


export type PaginationProps = {
    paginationMode?: 'router' | 'state';
    data: any;
    onPageClick: null | ((e: React.MouseEvent, pageNumber: number) => void);
    showIndicator?: boolean;
    children?: React.ReactNode | React.Component | null;
}

const Pagination = ({
    paginationMode = 'router',
    data = null,
    onPageClick = null,
    showIndicator = true,
    children
}: PaginationProps) => {
    const [padding, setPadding] = useState<number>(2);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const searchParams = useSearchParams();
    const pageQueryVal = searchParams.get('page');

    const lastPageNumber = getLastPageNumber();

    const paginationClickHandler = (e: React.MouseEvent, pageNumber: number) => {
        if (typeof onPageClick === 'function') {
            onPageClick(e, pageNumber);
        }
    }

    function getLastPageNumber() {
        if (data?.[ListingsFetch.PAGINATION.LAST_PAGE]) {
            return data[ListingsFetch.PAGINATION.LAST_PAGE];
        }
        if (data?.[ListingsFetch.PAGINATION.TOTAL_PAGES] && data?.[ListingsFetch.PAGINATION.TOTAL_ITEMS]) {
            const calculate = Math.ceil(
                data[ListingsFetch.PAGINATION.TOTAL_ITEMS] / data[ListingsFetch.PAGINATION.PAGE_SIZE]
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
        return data?.[ListingsFetch.PAGINATION.CURRENT_PAGE] || 1;
    }

    const getpadding = (currentPage: number) => {
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

    function getPageLinkProps(page: number) {
        return {
            scroll: false,
            href: {
                query: {
                    page: page
                }
            },
            onClick: (e: React.MouseEvent) => {
                if (paginationMode === 'state') {
                    e.preventDefault();
                }
                paginationClickHandler(e, page)
            }
        }
    }

    useEffect(() => {
        setPageNumber(getCurrentPageNumber());
    }, [data?.[ListingsFetch.PAGINATION.PAGE], pageQueryVal]);

    let { left, right } = getpadding(pageNumber);
    // console.log({pageNumber, left, right, lastPageNumber});
    return (
        <>
            {children}

            {showIndicator &&
                    <span className="page-numbers">
                        {`Page ${pageNumber} of ${lastPageNumber}`}
                    </span>
                }
            <nav aria-label="Page navigation example">
                <ul className="pagination mb-0">
                    <li className="page-item">
                        <Link
                            className={"page-link"}
                            {...getPageLinkProps(1)}
                        >
                            <span aria-hidden="true">&laquo;</span>
                        </Link>
                    </li>
                    <li className="page-item">
                        <Link
                            className={"page-link"}
                            {...getPageLinkProps(1)}
                        >
                            <span aria-hidden="true">1</span>
                        </Link>
                    </li>
                    {left.map((num, index) => (
                        <li key={index} className="page-item">
                            <Link
                                className="page-link"
                                {...getPageLinkProps(num)}
                            >
                                <span>{num}</span>
                            </Link>
                        </li>
                    ))}
                    {right.map((num, index) => (
                        <li key={index} className="page-item">
                            <Link
                                className="page-link"
                                {...getPageLinkProps(num)}
                            >
                                <span>{num}</span>
                            </Link>
                        </li>
                    ))}

                    <li className="page-item">
                        <Link
                            className={"page-link"}
                            {...getPageLinkProps(lastPageNumber)}
                        >
                            <span aria-hidden="true">{lastPageNumber}</span>
                        </Link>
                    </li>
                    <li className="page-item">
                        <Link
                            className={"page-link"}
                            {...getPageLinkProps(lastPageNumber)}
                        >
                            <span aria-hidden="true">&raquo;</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

function mapStateToProps(state: any) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(Pagination);
