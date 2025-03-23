export class ReduxHelpers {

    static buildValidatedObject(data, origData, stateData) {
        if (!data || !origData || !stateData) {
            return {};
        }

        Object.keys(data).forEach(key => {
            if (data[key] === null) {
                stateData[key] = null;
                return;
            }
            if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                stateData[key] = ReduxHelpers.buildValidatedObject(data[key], origData[key], stateData[key]);
                return;
            }
            if (origData.hasOwnProperty(key) && data.hasOwnProperty(key)) {
                stateData[key] = data[key];
            }
        })
        return stateData;
    }
}