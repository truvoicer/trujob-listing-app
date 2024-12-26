import React, {useContext} from 'react';
import Head from "next/head";
import {isNotEmpty} from "../../library/utils";
import {getHeadScripts} from "../../library/helpers/pages";
import {connect} from "react-redux";
import Script from "next/script";
import {APP_STATE} from "@/library/redux/constants/app-constants";
import {PAGE_STATE} from "@/library/redux/constants/page-constants";

function HtmlHead({app, page}) {

    return (
        <>
        </>
    );
}

function mapStateToProps(state) {
    return {
        app: state[APP_STATE],
        page: state[PAGE_STATE],
    };
}

export default connect(
    mapStateToProps,
    null
)(HtmlHead);
