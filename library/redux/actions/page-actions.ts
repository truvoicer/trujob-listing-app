import store from "../store"
import {
    setPage,
    setPageError
} from "../reducers/page-reducer";

export function setPageErrorAction(error) {
    store.dispatch(setPageError(error))
}
export function setPageAction(data) {
    store.dispatch(setPage(data));
}

