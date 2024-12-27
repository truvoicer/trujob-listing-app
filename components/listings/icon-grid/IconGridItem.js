import React from 'react';

function IconGridItem({
    icon = 'flaticon-car',
    caption = 'Cars & Vehicles',
    number = '1,921',
}) {
    return (
        <a href="#" className="popular-category h-100">
            <span className="icon"><span className={icon}></span></span>
            <span className="caption mb-2 d-block">{caption}</span>
            <span className="number">{number}</span>
        </a>
    );
}

export default IconGridItem;
