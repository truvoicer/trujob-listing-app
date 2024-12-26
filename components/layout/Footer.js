import {connect} from "react-redux";
import React, {useContext, useEffect, useState} from "react";
import {SESSION_AUTHENTICATED} from "@/truvoicer-base/redux/constants/session-constants";

const Footer = (props) => {
    const {session, fluidContainer = false} = props;

        return (
            <footer className={`footer ${!session[SESSION_AUTHENTICATED] ? "ml-0" : ""}`}>
                Fotter
            </footer>
        )
}

function mapStateToProps(state) {
    return {
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(Footer);
