import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { APP_STATE } from "@/library/redux/constants/app-constants";
import { PAGE_STATE } from "@/library/redux/constants/page-constants";
import MenuList from "./Menu/MenuList";
import Branding from "@/components/Branding/Branding";

const ListingHeader = ({ app, page }) => {
    const [isSticky, setSticky] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const ref = useRef(null);

    function toggleMobile() {
        console.log('toggleMobile')
        setShowMobileMenu(!showMobileMenu);
    }

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
    console.log(showMobileMenu)
    return (
        <>
            <div className={`site-mobile-menu ${showMobileMenu ? 'show' : ''}`}>
                <div className={`site-mobile-menu-header`}>
                    <a
                        href="#"
                        className="site-menu-toggle js-menu-toggle text-black"
                        onClick={() => toggleMobile()}
                    >
                        <span className="icon-menu h3"></span></a>
                </div>
                <div className="site-mobile-menu-body">
                    <MenuList name="header-menu" className="site-nav-wrap" />
                </div>
            </div>
            <header className="site-navbar container py-0 " role="banner" ref={ref} id="header">
                <div className="row align-items-center">
                    <div className="col-6 col-xl-2">
                        <Branding />
                    </div>
                    <div className="col-12 col-md-10 d-none d-xl-block">

                        <nav className="site-navigation position-relative text-right" role="navigation">
                            <MenuList name="header-menu" className="site-menu js-clone-nav mr-auto" />
                        </nav>
                    </div>


                    <div
                        className="d-inline-block d-xl-none ml-auto py-3 col-6 text-right"
                        style={{ position: 'relative', top: '3px' }}
                    >
                        <a
                            href="#"
                            className={`site-menu-toggle js-menu-toggle text-white float-end ${showMobileMenu ? 'd-none' : 'd-block'}`}
                            onClick={() => toggleMobile()}
                        >
                            <span className="icon-menu h3"></span>
                        </a>
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
)(ListingHeader);
