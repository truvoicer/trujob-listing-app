'use client';
import React, { useEffect } from 'react';
import { ViewFactory } from "@/library/view/ViewFactory";
import { setPageAction } from '@/library/redux/actions/page-actions';
import { setSettingsAction } from '@/library/redux/actions/settings-actions';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import { setSiteAction } from '@/library/redux/actions/site-actions';
import Loader from './Loader';
import { setAppModeAction } from '@/library/redux/actions/app-actions';

function App({ data, settings, site, page }) {
    const viewFactory = new ViewFactory();
    function getAppMode() {
        const dark = localStorage.getItem('dark');
        return dark === 'true' ? 'dark' : 'light';
    }

    useEffect(() => {
        setPageAction(data);
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

    const view = viewFactory.renderView(page);
    
    return (
        <div>
            {view
                ? view
                : <Loader fullScreen />
            }
        </div>
    );
}

export default connect(
    state => ({
        page: state[PAGE_STATE],
    })
)(App);
