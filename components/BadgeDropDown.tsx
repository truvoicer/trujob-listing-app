import { isNotEmpty } from "@/helpers/utils";
import Link, { LinkProps } from "next/link";
import React from "react";
import { Dropdown, DropdownItemProps, DropdownProps } from "react-bootstrap";

export type BadgeDropDownProps = {
    data?: Array<BadgeDropDownItem>;
}
export type BadgeDropDownItem = {
    text: string;
    linkProps: LinkProps
}
export interface BadgeDropDownItemProps extends DropdownItemProps {
    linkProps: LinkProps;
}

const CustomDropdownItem = React.forwardRef(
    (atts: BadgeDropDownItemProps, ref: React.Ref<HTMLAnchorElement>) => {
        const { 
            children, 
            style, 
            className, 
            'aria-labelledby': 
            labeledBy,
             href, 
            linkProps 
        }: BadgeDropDownItemProps = atts;
        return (
            <Link
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
    ({ children, style, className, 'aria-labelledby': labeledBy }: DropdownProps, ref: React.Ref<HTMLDivElement>) => {
        if (typeof className === 'string') {
            className = className.replace('dropdown', '')
        }
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


function BadgeDropDown({
    data = []
}: BadgeDropDownProps) {
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