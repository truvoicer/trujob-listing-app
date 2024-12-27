import React from 'react';
import IconGridItem from "@/components/listings/icon-grid/IconGridItem";
const iconGridConfig = [
    {
        icon: 'flaticon-car',
        caption: 'Cars & Vehicles',
        number: '1,921',
    },
    {
        icon: 'flaticon-closet',
        caption: 'Furniture',
        number: '2,339',
    },
    {
        icon: 'flaticon-home',
        caption: 'Real Estate',
        number: '4,398',
    },
    {
        icon: 'flaticon-open-book',
        caption: 'Books & Magazines',
        number: '3,298',
    },
    {
        icon: 'flaticon-tv',
        caption: 'Electronics',
        number: '2,932',
    },
    {
        icon: 'flaticon-pizza',
        caption: 'Other',
        number: '183',
    }
];
function IconGridSection(props) {
    return (
        <div className="site-section" data-aos="fade">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-md-7 text-center border-primary">
                        <h2 className="font-weight-light text-primary">Popular Categories</h2>
                        <p className="color-black-opacity-5">Lorem Ipsum Dolor Sit Amet</p>
                    </div>
                </div>
                <div className="overlap-category mb-5">
                    <div className="row align-items-stretch no-gutters">
                        {iconGridConfig.map((item, index) => {
                            return (
                                <div key={index} className="col-sm-6 col-md-4 mb-4 mb-lg-0 col-lg-2">
                                   <IconGridItem icon={item.icon} caption={item.caption} number={item.number} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IconGridSection;
