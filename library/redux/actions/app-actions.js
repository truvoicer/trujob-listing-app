import store from "../store"
import {
    setError,
    setAppCurrentRoute,
    setAppLoaded,
    setAppRequestedRoute
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
