import store from "../store"
import {
    setError,
    setAppCurrentRoute,
    setAppLoaded,
    setAppRequestedRoute,
    setAppMode,
    setAppSettings,
    setAppSidebarOpen
} from "../reducers/app-reducer";

export function setAppErrorAction(error) {
    store.dispatch(setError(error))
}
export function setAppLoadedAction(appLoaded) {
    store.dispatch(setAppLoaded(appLoaded))
}

export function setAppCurrentRouteAction(route) {
    store.dispatch(setAppCurrentRoute(route))
}
export function setAppRequestedRouteAction(route) {
    store.dispatch(setAppRequestedRoute(route))
}

export function setAppSettingsAction(settings) {
    store.dispatch(setAppSettings(settings))
}
export function setAppModeAction(mode) {
    store.dispatch(setAppMode(mode))
}
export function setAppSidebarOpenAction(open) {
    store.dispatch(setAppSidebarOpen(open))
}
