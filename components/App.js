'use client';
import React, { useEffect } from 'react';
import {ViewFactory} from "@/library/view/ViewFactory";
import { setPageAction } from '@/library/redux/actions/page-actions';
import { setSettingsAction } from '@/library/redux/actions/settings-actions';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import { setSiteAction } from '@/library/redux/actions/site-actions';

function App({data, settings, site, page}) {
    const viewFactory = new ViewFactory();

    useEffect(() => {
        setPageAction(data);
    }, [data]);

    useEffect(() => {
        setSettingsAction(settings);
    }, [settings]);

    useEffect(() => {
        setSiteAction(site);
    }, [site]);

    const view = viewFactory.renderView(page);
    
    return (
        <div>
            {view? view : 'No view found'}
        </div>
    );
}

export default connect(
    state => ({
        page: state[PAGE_STATE],
    })
)(App);
