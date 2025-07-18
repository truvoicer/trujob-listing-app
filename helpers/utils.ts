import moment from 'moment';

export function findInObjectByIndex(obj,i) {
    if (!obj) {
        return null;
    }
    return obj[i];
}

export function findInObject(str, obj) {
    return str.split('.').reduce(findInObjectByIndex, obj)
}

export function replaceInObject(obj, key, value) {
    if (!obj || !key) {
        return obj;
    }
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
    target[lastKey] = value;
    return obj;
}

export const formatDate = (dateString, formatString = "Do MMMM YYYY") => {
    moment.updateLocale('en', {
        invalidDate : ""
    });
    if (!isSet(dateString) || dateString === null || dateString === "") {
        return dateString;
    }
    let date;
    if (!isNaN(dateString)) {
        date = moment(dateString*1000).format(formatString);

    } else {
        date = moment(dateString).format(formatString);
    }
    if (isSet(date)) {
        return date;
    }
    return dateString
}

export const isEmpty = (object) => {
    for(let key in object) {
        if(object.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const isSet = (item) => {
    return typeof item !== "undefined";
}
export const isFile = (item) => {
    return Object.prototype.toString.call(item) === "[object File]";
}

export const isNotEmpty = (item) => {
    return typeof item !== "undefined" && item !== null && item !== "" && item !== false;
}

export const imageSelector = (imageSize = "medium", imageArray = []) => {

    if (!Array.isArray(imageArray)) {
        return false;
    }
    if (imageArray.length === 0) {
        return false;
    }
    let sizes = {
        xsmall: {min: 0, max: 50},
        small: {min: 51, max: 100},
        medium: {min: 101, max: 600},
        large: {min: 601, max: 2048},
        xlarge: {min: 2049, max: 6000}
    }
    let image = imageArray.filter((item) => {
        if (item.width >= sizes[imageSize].min && item.width <= sizes[imageSize].max) {
            return true;
        }
    })
    if (image.length > 0) {
        return image[0];
    } else {
        return imageArray[0];
    }
}

export const convertImageObjectsToArray = (imagesArray) => {
    if (typeof imagesArray === "object" && imagesArray !== null) {
        return Object.keys(imagesArray).map(key => imagesArray[key])
    }
    return imagesArray;
}

export const getDefaultImage = (item) => {
    if (isSet(item.image_list) && item.image_list !== null) {
        let selectImage = imageSelector("medium", item.image_list);
        if (selectImage) {
            return selectImage.url;
        }
    }
    if (isSet(item.item_default_image) && item.item_default_image !== "") {
        return item.item_default_image;
    }
    return null;
}

export const uCaseFirst = (string) => {
    if (!isNotEmpty(string)) {
        return ""
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isObjectEmpty = (object) => {
    if (typeof object === "undefined" || object === null) {
        return true;
    }
    if (!isSet(object)) {
        return true;
    }
    if (!isObject(object)) {
        return true;
    }
    return Object.keys(object).length === 0 && object.constructor === Object
}

export const isObject = (object) => {
    return typeof object === "object";
}

export const scrollToRef = (ref) => {
    window.scrollTo(0, ref?.current?.offsetTop)
}

export function isValidImageSrc(src) {
    return (
        typeof src === "string" &&
        src !== "" &&
        (
            src.startsWith("http") ||
            src.startsWith("//") ||
            src.startsWith("/")
        )
    );
}

export function getNextArrayIndex(array) {
    if (!Array.isArray(array)) {
        return 0;
    }
    let found = false;
    let index = array.length;
    while(!found) {
        if (typeof array[index] === "undefined") {
            found = true;
            continue;
        }
        index++;
    }
    return index;
}

export function compareValues(value1, value2) {
    return (JSON.stringify(value1) === JSON.stringify(value2));
}

export function objectMerge(obj1: any, obj2: any): any {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return obj1;
    }
    const merged = { ...obj1 };
    for (const key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            merged[key] = obj2[key];
        }
    }
    return merged;
}

export function randomStr(length: number): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}