import store from "../store"
import {
    pageStateData,
    setPage,
    setPageError
} from "../reducers/page-reducer";
import { ReduxHelpers } from "../helpers/ReduxHelpers";

export function setPageErrorAction(error) {
    store.dispatch(setPageError(error))
}
export function setPageAction(data) {
    console.log(ReduxHelpers.buildValidatedObject(data, pageStateData));
    store.dispatch(setPage(ReduxHelpers.buildValidatedObject(data, pageStateData)));
}

