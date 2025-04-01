function MenuListItem({ item, onClick }) {
    
    function renderMenus(item, root = true) {
        return (
            <AccessControlComponent
                roles={item?.roles}
            >
                <li>
                    <Link href={item?.url || '#'} className="collapsed">
                        <span>{item?.label || ''}</span>
                    </Link>
                    <ul className="iq-submenu sub-scrll collapse">
                        {Array.isArray(item?.menus) && item.menus.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    {renderMenuItems(item?.menuItems, root)}
                                </React.Fragment>
                            );
                        })}
                    </ul>
                </li>
            </AccessControlComponent>
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
        
        if (
            !session[SESSION_IS_AUTHENTICATING] &&
            session[SESSION_AUTHENTICATED] &&
            siteConfig.site.menu.types.auth.unauthenticated.includes(item?.type)
        ) {
            return null;
        }
        switch (item?.type) {
            case 'register':
                return (
                    <AccessControlComponent
                        roles={item?.roles}
                    >
                        <li className={liClass}>
                            <Link
                                href={item?.url || '#'}
                                className={aClass}
                            >
                                <span className="bg-primary text-white rounded">{item.label}</span>
                            </Link>
                        </li>
                    </AccessControlComponent>
                );
        }
        return (
            <AccessControlComponent
                roles={item?.roles}
            >
                <li className={liClass}>
                    <Link
                        href={item?.url || '#'}
                        className={aClass}
                    >
                        <span>{item.label}</span>
                    </Link>
                </li>
            </AccessControlComponent>
        );
    }
  return (
    <li className="menu-list-item">
      <button type="button" onClick={onClick} className="menu-list-item-button">
        {item.icon && <item.icon />}
        {item.label}
      </button>
    </li>
  );
}

export default MenuListItem;