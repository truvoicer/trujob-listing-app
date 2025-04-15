'use client';
import React, { useEffect } from 'react';
import { ViewFactory } from "@/library/view/ViewFactory";
import { setPageAction } from '@/library/redux/actions/page-actions';
import { setSettingsAction } from '@/library/redux/actions/settings-actions';
import { connect } from 'react-redux';
import { PAGE_LOADED, PAGE_STATE } from '@/library/redux/constants/page-constants';
import { setSiteAction } from '@/library/redux/actions/site-actions';
import Loader from './Loader';
import { setAppModeAction } from '@/library/redux/actions/app-actions';
import ViewLayout from './Layout/ViewLayout';
import { isObject, isObjectEmpty } from '@/helpers/utils';

type Props = {
    data: any;
    settings: any;
    site: any;
    page: any;
}
function App({ data, settings, site, page }: Props) {
    function getAppMode() {
        const dark = localStorage.getItem('dark');
        return dark === 'true' ? 'dark' : 'light';
    }

    useEffect(() => {
        let pageData = {...data};
        pageData[PAGE_LOADED] = true;
        setPageAction(pageData);
    }, [data]);

    useEffect(() => {
        setSettingsAction(settings);
    }, [settings]);

    useEffect(() => {
        setSiteAction(site);
    }, [site]);

    useEffect(() => {
        setAppModeAction(getAppMode());
    }, []);


    return (
        <div>
            {(page[PAGE_LOADED])
                ? <ViewLayout />
                
                : <Loader fullScreen />
            }
        </div>
    );
}

export default connect(
    (state: any) => ({
        page: state[PAGE_STATE],
    })
)(App);
