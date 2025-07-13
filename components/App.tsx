'use client';
import React, { useEffect } from 'react';
import { setPageAction } from '@/library/redux/actions/page-actions';
import { setSettingsAction } from '@/library/redux/actions/settings-actions';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import { setSiteAction } from '@/library/redux/actions/site-actions';
import Loader from './Loader';
import { setAppModeAction } from '@/library/redux/actions/app-actions';
import ViewLayout from './Layout/ViewLayout';
import { isObject, isObjectEmpty } from '@/helpers/utils';
import { usePathname } from 'next/navigation';
import { RootState } from '@/library/redux/store';
import { Page } from '@/types/Page';

type Props = {
    data: Page;
    settings: Record<string, unknown>;
    site: Record<string, unknown>;
    page: Page;
}
function App({ data, settings, site, page }: Props) {

    const pathname = usePathname();

    function getAppMode() {
        const dark = localStorage.getItem('dark');
        return dark === 'true' ? 'dark' : 'light';
    }

    function isPageLoaded() {
        if (!isObject(page) || isObjectEmpty(page)) {
            return false;
        }
        if (page?.permalink === pathname) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        const pageData: Page = { ...data };
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
            {isPageLoaded()
                ? <ViewLayout />

                : <Loader />
            }
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        page: state[PAGE_STATE],
    })
)(App);
