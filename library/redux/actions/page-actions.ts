import store from "../store"
import {
    setPage,
    setPageError,
    setPageIsLoaded
} from "../reducers/page-reducer";
import { Page } from "@/types/Page";

export function setPageErrorAction(error) {
    store.dispatch(setPageError(error))
}
export function setPageAction(data: Page) {
    store.dispatch(setPage(data));
}

export function setPageIsLoadedAction(isLoaded: boolean) {
    store.dispatch(setPageIsLoaded(isLoaded));
}