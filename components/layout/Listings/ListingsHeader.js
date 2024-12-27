import {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {APP_STATE} from "@/library/redux/constants/app-constants";
import {PAGE_STATE} from "@/library/redux/constants/page-constants";

const ListingsHeader = ({app, page}) => {
    const [isSticky, setSticky] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, [])

    const handleScroll = (e) => {
        if (ref.current) {
            // setSticky(ref.current.getBoundingClientRect().top <= -50);
        }
    }

    return (
        <>

            <div className="site-mobile-menu">
                <div className="site-mobile-menu-header">
                    <a href="#" className="site-menu-toggle js-menu-toggle text-white">
                        <span className="icon-menu h3"></span></a>
                </div>
                <div className="site-mobile-menu-body"></div>
            </div>
            <header className="site-navbar container py-0 " role="banner" ref={ref} id="header">
                <div className="row align-items-center">

                    <div className="col-6 col-xl-2">
                        <h1 className="mb-0 site-logo">
                            <a href="index.html" className="text-white mb-0">DirectoryAds</a>
                        </h1>
                    </div>
                    <div className="col-12 col-md-10 d-none d-xl-block">
                        <nav className="site-navigation position-relative text-right" role="navigation">

                            <ul className="site-menu js-clone-nav mr-auto d-none d-lg-block">
                                <li className="active"><a href="index.html">Home</a></li>
                                <li><a href="listings.html">Ads</a></li>
                                <li className="has-children">
                                    <a href="about.html">About</a>
                                    <ul className="dropdown">
                                        <li><a href="#">The Company</a></li>
                                        <li><a href="#">The Leadership</a></li>
                                        <li><a href="#">Philosophy</a></li>
                                        <li><a href="#">Careers</a></li>
                                    </ul>
                                </li>
                                <li><a href="blog.html">Blog</a></li>
                                <li className="mr-5"><a href="contact.html">Contact</a></li>

                                <li className="ml-xl-3 login"><a href="login.html"><span
                                    className="border-left pl-xl-4"></span>Log In</a></li>

                                <li>
                                    <a href="register.html" className="cta">
                                        <span className="bg-primary text-white rounded">Register</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>


                    <div className="d-inline-block d-xl-none ml-auto py-3 col-6 text-right"
                         style={{position: 'relative', top: '3px'}}>
                        <a href="#" className="site-menu-toggle js-menu-toggle text-white"><span
                            className="icon-menu h3"></span></a>
                    </div>
                </div>
            </header>
        </>
    )
}

export default connect(
    (state) => ({
        app: state[APP_STATE],
        page: state[PAGE_STATE],
    }),
    null
)(ListingsHeader);
