import React from 'react';

function FeaturedCard(props) {
    return (
        <div className="d-block d-md-flex product vertical">
            <a className="img d-block"
               style={{backgroundImage: "url('/images/img_1.jpg')"}}
            ></a>
            <div className="lh-content">
                <span className="category">Cars &amp; Vehicles</span>
                <a href="#" className="bookmark"><span className="icon-heart"></span></a>
                <h3><a href="products-single.html">New Black Car</a></h3>
                <address>Don St, Brooklyn, New York</address>
                <p className="mb-0">
                    <span className="icon-star text-warning"></span>
                    <span className="icon-star text-warning"></span>
                    <span className="icon-star text-warning"></span>
                    <span className="icon-star text-warning"></span>
                    <span className="icon-star text-secondary"></span>
                    <span className="review">(3 Reviews)</span>
                </p>
            </div>
        </div>
    );
}

export default FeaturedCard;
