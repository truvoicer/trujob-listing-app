import { StyleBuilder } from '@/library/StyleBuilder';
import React from 'react';

function HeroSection(props) {
    return (
        <div className=""
            style={StyleBuilder.getInstance().addBackgroundImage(props?.properties?.background_image)}
            data-aos="fade"
            data-stellar-background-ratio="0.5">

            {/*<div className="site-blocks-cover inner-page-cover overlay"*/}
            {/*     style={{backgroundImage: 'url(/images/hero_2.jpg)'}}*/}
            {/*     data-aos="fade" data-stellar-background-ratio="0.5">*/}
            {/*    <div className="container">*/}
            {/*        <div className="row align-items-center justify-content-center text-center">*/}

            {/*            <div className="col-md-10" data-aos="fade-up" data-aos-delay="400">*/}


            {/*                <div className="row justify-content-center mt-5">*/}
            {/*                    <div className="col-md-8 text-center">*/}
            {/*                        <h1>{title}</h1>*/}
            {/*                        <p className="mb-0">{subTitle}</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}


            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="container">
                <div className="row align-items-center justify-content-center text-center z-index-1">

                    <div className="col-md-12">


                        <div className="row justify-content-center mb-4">
                            <div className="col-md-8 text-center">
                                {props?.properties?.title &&
                                    <h1 className="" data-aos="fade-up">
                                        {props.properties.title}
                                    </h1>
                                }
                                {props?.properties?.subtitle &&
                                <p data-aos="fade-up" data-aos-delay="100">
                                    {props.properties.subtitle}
                                    </p>
}
                            </div>
                        </div>

                        <div className="form-search-wrap mb-3" data-aos="fade-up" data-aos-delay="200">
                            <form method="post">
                                <div className="row align-items-center">
                                    <div className="col-lg-12 mb-4 mb-xl-0 col-xl-4">
                                        <input type="text" className="form-control rounded"
                                            placeholder="What are you looking for?" />
                                    </div>
                                    <div className="col-lg-12 mb-4 mb-xl-0 col-xl-3">
                                        <div className="wrap-icon">
                                            <span className="icon icon-room"></span>
                                            <input type="text" className="form-control rounded"
                                                placeholder="Location" />
                                        </div>

                                    </div>
                                    <div className="col-lg-12 mb-4 mb-xl-0 col-xl-3">
                                        <div className="select-wrap">
                                            <span className="icon"><span
                                                className="icon-keyboard_arrow_down"></span></span>
                                            <select className="form-control rounded" name="" id="">
                                                <option value="">All Categories</option>
                                                <option value="">Real Estate</option>
                                                <option value="">Books &amp;  Magazines</option>
                                                <option value="">Furniture</option>
                                                <option value="">Electronics</option>
                                                <option value="">Cars &amp; Vehicles</option>
                                                <option value="">Others</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-xl-2 ml-auto text-right">
                                        <input type="submit" className="btn btn-primary btn-block rounded"
                                            value="Search" />
                                    </div>

                                </div>
                            </form>
                        </div>

                        <div className="row text-left trending-search" data-aos="fade-up" data-aos-delay="300">
                            <div className="col-12">
                                <h2 className="d-inline-block">Trending Search:</h2>
                                <a href="#">iPhone</a>
                                <a href="#">Cars</a>
                                <a href="#">Flowers</a>
                                <a href="#">House</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
