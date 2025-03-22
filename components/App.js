import React, { useEffect } from 'react';
import {ViewFactory} from "@/library/view/ViewFactory";
import { setPageAction } from '@/library/redux/actions/page-actions';
import { setSettingsAction } from '@/library/redux/actions/settings-actions';
import { connect } from 'react-redux';
import { PAGE_STATE } from '@/library/redux/constants/page-constants';
import { SETTINGS_STATE } from '@/library/redux/constants/settings-constants';

function App({data, settings, pageState, settingsState}) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(data, settings);
    console.log(data, settings)

    useEffect(() => {
        setPageAction(data);
    }, [data]);

    useEffect(() => {
        setSettingsAction(settings);
    }, [settings]);
    console.log({pageState, settingsState})
    return (
        <div>
            {/* {view? view : 'No view found'} */}
        </div>
    );
}

export default connect(
    state => ({
        pageState: state[PAGE_STATE],
        settingsState: state[SETTINGS_STATE]
    })
)(App);
