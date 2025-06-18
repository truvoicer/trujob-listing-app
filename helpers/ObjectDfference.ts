import { compareValues } from "./utils";

export class ObjectDifference {

    static getDifference<T>(obj1: any, obj2: any, requiredFields?: any): Partial<T> {
        const diff: Record<string, unknown> = {};
        for (const key in obj1) {
            if (!obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
                continue;
            }
            if (Array.isArray(obj1?.[key]) && Array.isArray(obj2?.[key])) {
                obj1[key].forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        const nestedDiff = this.getDifference(
                            item, 
                            obj2[key][index], 
                            requiredFields?.[key]
                        );
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
                            if (!Array.isArray(diff?.[key])) {
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
                const nestedDiff = this.getDifference(obj1[key], obj2?.[key] || {}, requiredFields?.[key]);

                if (
                    typeof requiredFields?.[key] === 'object' &&
                    ObjectDifference.objectHasSameKeys(nestedDiff, requiredFields?.[key])
                ) {
                    continue;
                }

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

    static compareValues(value1: any, value2: any): boolean {
        return (JSON.stringify(value1) === JSON.stringify(value2));
    }

    static objectHasSameKeys(obj1: any, obj2: any): boolean {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            if (!keys2.includes(key)) {
                return false;
            }
        }
        return true;
    }

    static objectHasSameKeysAndValues(obj1: any, obj2: any): boolean {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

}