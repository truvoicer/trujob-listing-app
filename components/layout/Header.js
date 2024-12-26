import React, {useContext, useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {APP_STATE} from "@/library/redux/constants/app-constants";
import {PAGE_STATE} from "@/library/redux/constants/page-constants";

const Header = ({app, page}) => {
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
            <header ref={ref} id="header" className="header">
                Hello World
            </header>
    )
}

export default connect(
    (state) => ({
        app: state[APP_STATE],
        page: state[PAGE_STATE],
    }),
    null
)(Header);
