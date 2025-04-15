import { isNotEmpty } from "@/helpers/utils";
import Link from "next/link";
import React from "react";
import { Dropdown } from "react-bootstrap";

const CustomDropdownItem = React.forwardRef(
    (atts, ref) => {
        const { children, style, className, 'aria-labelledby': labeledBy, href, linkProps } = atts;
        return (
            <Link
                href={href}
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}

                {...linkProps}
            >
                {children}
            </Link>
        );
    },
);
const CustomDropdown = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        className = className.replace('dropdown', '')
        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                {children}
            </div>
        );
    },
);

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        return (
            <div
                ref={ref}
                style={style}
                className={className + " iq-sub-dropdown user-dropdown"}
                aria-labelledby={labeledBy}
            >
                <div className="card m-0">
                    <div className="card-body p-0">
                        <div className="py-3">
                            {children}
                        </div>

                        <a
                            className="right-ic p-3 border-top btn-block position-relative text-center"
                            href="/logout"
                            role="button">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        );
    },
);
function BadgeDropDown({
    data = []
}) {
    return (
        <span className="badge bg-primary-light pointer"
            style={{
                cursor: 'pointer',
            }}>
            <Dropdown as={CustomDropdown} className="dropdown">
                <Dropdown.Toggle
                    className="text-primary dropdown-toggle action-item"
                    as={'span'}
                />
                <Dropdown.Menu className="dropdown-menu">
                    {Array.isArray(data) && data.map((item, index) => {
                        if (!isNotEmpty(item?.text)) {
                            console.warn('BadgeDropDown: text is empty', {index, item});
                            return null;
                        }
                        if (!isNotEmpty(item?.linkProps)) {
                            console.warn('BadgeDropDown: linkProps is empty', {index, item});
                            return null;
                        }
                        if (typeof item.linkProps !== 'object') {
                            console.warn('BadgeDropDown: linkProps is not an object', {index, item});
                            return null;
                        }
                        return (
                            <Dropdown.Item
                                as={CustomDropdownItem}
                                className={"dropdown-item"}
                                linkProps={item.linkProps}
                                key={index}>
                                {item.text}
                            </Dropdown.Item>
                        )
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </span>
    );
}

export default BadgeDropDown;