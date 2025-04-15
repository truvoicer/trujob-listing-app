import React from 'react';
import FeaturedCard from "@/components/blocks/featured/FeaturedCard";

function FeaturedSection(props) {
    return (
        <div className="site-section bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2 className="h5 mb-4 text-black">Featured Ads</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12  block-13">
                        <div className="owl-carousel nonloop-block-13 row">
                            {Array.from({length: 4}).map((_, index) => {
                                return (
                                    <div key={index} className="col-lg-3 mb-4 mb-lg-0">
                                        <FeaturedCard/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeaturedSection;
