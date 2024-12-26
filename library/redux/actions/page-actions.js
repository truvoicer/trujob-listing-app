import store from "../store"
import {
    setPageData,
    setPageStatus,
    setPageSettings,
    setSearchParamPage,
    setSearchParamSortBy,
    setSearchParamQuery,
    setSearchParamSortOrder,
    setSearchParamPageSize,
    setPageError
} from "../reducers/page-reducer";

export function setPageStatusAction(pageStatus) {
    store.dispatch(setPageStatus(pageStatus))
}
export function setPageErrorAction(error) {
    store.dispatch(setPageError(error))
}

export function setPageSettingsAction(data) {
    store.dispatch(setPageSettings(data))
}

export function setSearchParamPageAction(data) {
    store.dispatch(setSearchParamPage(data));
}
export function setSearchParamSortByAction(data) {
    store.dispatch(setSearchParamSortBy(data));
}
export function setSearchParamQueryAction(data) {
    store.dispatch(setSearchParamQuery(data));
}
export function setSearchParamSortOrderAction(data) {
    store.dispatch(setSearchParamSortOrder(data));
}
export function setSearchParamPageSizeAction(data) {
    store.dispatch(setSearchParamPageSize(data));
}

export function setPageDataAction(data) {
    store.dispatch(setPageData(data))
}


