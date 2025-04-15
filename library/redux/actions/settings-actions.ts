import store from "../store"
import {
    setError,
    setSettings,
} from "../reducers/settings-reducer";

export function setSettingsErrorAction(error) {
    store.dispatch(setError(error));
}
export function setSettingsAction(data) {
    store.dispatch(setSettings(data));
}

