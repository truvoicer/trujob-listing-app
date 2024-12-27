import React from 'react';
import {ViewFactory} from "@/library/view/ViewFactory";

function App({data, settings}) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(data, settings);
    return (
        <div>
            {view? view : 'No view found'}
        </div>
    );
}

export default App;
