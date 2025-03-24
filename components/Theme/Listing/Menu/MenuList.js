import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function MenuList({ name }) {
    const [data, setData] = useState([]);

    async function menuItemsInit(name) {
        const menuFetch = await TruJobApiMiddleware.getInstance().menuRequest(name);
        if (!Array.isArray(menuFetch?.data?.menuItems)) {
            console.warn(`Menu data is not an array | name: ${name}`);
            return;
        }
        setData(menuFetch.data.menuItems);
    }

    function renderMenus(item, root = true) {
        return (
            <li className="has-children">
                <Link href={item?.url || '#'}>
                    {item?.title || ''}
                </Link>
                <ul className="dropdown">
                {Array.isArray(item?.menus) && item.menus.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            {renderMenuItems(item?.menuItems, root)}
                        </React.Fragment>
                    );
                })}
                </ul>
            </li>
        );
    }
    function renderMenuItems(items, root = true) {
        return (
            <>
                {Array.isArray(items) && items.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            {renderMenuItem(item, root)}
                        </React.Fragment>
                    );
                })}
            </>
        );
    }

    function renderMenuItem(item) {
        if (Array.isArray(item?.menus) && item.menus.length > 0) {
            return renderMenus(item, false);
        }
        let liClass = item?.li_class || '';
        const aClass = item?.a_class || '';
        switch (item?.type) {
            case 'register':
                return (
                    <li className={liClass}>
                        <Link
                            href={item?.url || '#'}
                            className={aClass}
                        >
                            <span className="bg-primary text-white rounded">{item.title}</span>
                        </Link>
                    </li>
                );
        }
        return (
            <li className={liClass}>
                <Link
                    href={item?.url || '#'}
                    className={aClass}
                >
                    {item.title}
                </Link>
            </li>
        )

    }

    useEffect(() => {
        if (!name || name === '') {
            return;
        }
        menuItemsInit(name);
    }, [name]);
    
    return (
        <ul className="site-menu js-clone-nav mr-auto d-none d-lg-block">
            {renderMenuItems(data, true)}
        </ul>
    );
}
export default MenuList;