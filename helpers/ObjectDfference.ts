import { compareValues } from "./utils";

export class ObjectDifference {

    static getDifference<T>(obj1: any, obj2: any, requiredFields?: any): Partial<T> {
        const diff: Partial<T> = {};
        for (const key in obj1) {
            if (!obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
                continue;
            }
            if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                obj1[key].forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        const nestedDiff = this.getDifference(item, obj2[key][index], requiredFields?.[key]);
                        console.log('nestedDiff', nestedDiff, requiredFields?.[key]);
                        if (!Object.keys(nestedDiff).length) {
                            return;
                        }
                        
                        if (!Array.isArray(diff[key])) {
                            diff[key] = [];
                        }
                        diff[key].push(nestedDiff);
                        
                    } else {
                        if (
                            !compareValues(item, obj2[key][index])
                        ) {
                            if (!Array.isArray(diff[key])) {
                                diff[key] = [];
                            }
                            diff[key].push(item);
                        }
                    }
                });
            } else if (
                typeof obj1[key] === 'object' &&
                obj1[key] !== null
            ) {
                const nestedDiff = this.getDifference(obj1[key], obj2[key], requiredFields?.[key]);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } else if (typeof obj1 === 'object' && obj1.hasOwnProperty(key)) {
                if (
                    (
                        typeof requiredFields === 'object' &&
                        Object.keys(requiredFields).includes(key)
                    ) ||
                    !compareValues(obj1?.[key], obj2?.[key])
                ) {
                    diff[key] = obj1[key];
                }

            }
        }
        return diff;
    }
}