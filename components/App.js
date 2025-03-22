import React, { useEffect } from 'react';
import {ViewFactory} from "@/library/view/ViewFactory";
import { setPageAction } from '@/library/redux/actions/page-actions';
import { setSettingsAction } from '@/library/redux/actions/settings-actions';

function App({data, settings}) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(data, settings);
    console.log(data, settings)

    useEffect(() => {
        setPageAction(data);
    }, [data]);

    useEffect(() => {
        setSettingsAction(settings);
    }, [settings]);
    
    return (
        <div>
            {view? view : 'No view found'}
        </div>
    );
}

export default App;
