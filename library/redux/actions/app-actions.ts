import store from "../store"
import {
    setError,
    setAppCurrentRoute,
    setAppLoaded,
    setAppRequestedRoute,
    setAppMode,
    setAppSettings,
    setAppSidebarOpen,
    setAppModals,
    AppModalItem,
    addAppModal
} from "../reducers/app-reducer";

export function setAppErrorAction(error: { show: boolean; message: string; data: Record<string, unknown> }) {
    store.dispatch(setError(error))
}
export function setAppLoadedAction(appLoaded: boolean) {
    store.dispatch(setAppLoaded(appLoaded))
}

export function setAppCurrentRouteAction(route: string | null) {
    store.dispatch(setAppCurrentRoute(route))
}
export function setAppRequestedRouteAction(route: string | null) {
    store.dispatch(setAppRequestedRoute(route))
}

export function setAppSettingsAction(settings: Record<string, unknown>) {
    store.dispatch(setAppSettings(settings))
}
export function setAppModeAction(mode: "light" | "dark") {
    store.dispatch(setAppMode(mode))
}
export function setAppSidebarOpenAction(open: boolean) {
    store.dispatch(setAppSidebarOpen(open))
}

export function setAppModalsAction(modalItems: Array<AppModalItem>) {
    store.dispatch(setAppModals(modalItems))
}

export function addAppModalAction(modalItem: AppModalItem) {
    store.dispatch(addAppModal(modalItem))
}
