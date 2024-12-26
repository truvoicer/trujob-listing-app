import React from 'react';
import {ViewFactory} from "@/library/view/ViewFactory";

function App({data, settings}) {

    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(data?.view, settings);
    return (
        <div>
            <h1>App</h1>
            {view? view : 'No view found'}
        </div>
    );
}

export default App;
