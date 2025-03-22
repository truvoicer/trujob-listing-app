export class ReduxHelpers {
    
    static buildValidatedObject(data, pageData) {
        let newData = {};
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                newData[key] = ReduxHelpers.buildValidatedObject(data[key], pageData[key]);
                return;
            }
            if (pageData.hasOwnProperty(key)) {
                newData[key] = data[key];
            }
        })
        return newData;
    }
}