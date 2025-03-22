import store from "../store"
import {
    setError,
    setSettings,
    settingsStateData
} from "../reducers/settings-reducer";
import { ReduxHelpers } from "../helpers/ReduxHelpers";

export function setSettingsErrorAction(error) {
    store.dispatch(setError(error));
}
export function setSettingsAction(data) {
    store.dispatch(setSettings(ReduxHelpers.buildValidatedObject(data, settingsStateData)));
}

