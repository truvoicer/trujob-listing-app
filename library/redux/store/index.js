import {
    configureStore,
} from "@reduxjs/toolkit";

import {thunk}  from "redux-thunk";
import {pageReducer} from "@/library/redux/reducers/page-reducer";
import {sessionReducer} from "@/library/redux/reducers/session-reducer";
import {APP_STATE} from "@/library/redux/constants/app-constants";
import {appReducer} from "@/library/redux/reducers/app-reducer";
import {SESSION_STATE} from "@/library/redux/constants/session-constants";
import {PAGE_STATE} from "@/library/redux/constants/page-constants";
import { SETTINGS_STATE } from "../constants/settings-constants";
import { settingsReducer } from "../reducers/settings-reducer";
import { SITE_STATE } from "../constants/site-constants";
import { siteReducer } from "../reducers/site-reducer";

const middleware = [
    thunk
];
const reducer = {
    [APP_STATE]: appReducer,
    [PAGE_STATE]: pageReducer,
    [SESSION_STATE]: sessionReducer,
    [SETTINGS_STATE]: settingsReducer,
    [SITE_STATE]: siteReducer
};
const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});

export default store;
