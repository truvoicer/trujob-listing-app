import store from "../store"
import {
    setError,
    setSite,
} from "../reducers/site-reducer";

export function setSiteErrorAction(error) {
    store.dispatch(setError(error));
}
export function setSiteAction(data) {
    store.dispatch(setSite(data));
}

