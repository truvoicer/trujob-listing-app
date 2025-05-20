import { FormikValues } from "formik";

export type SelectorModeHandler = {
    onChange: (values: any) => void,
    data?: Array<any>,
    values?: FormikValues,
    format?: 'array' | 'object',
    index?: number
}
export class DataManagerService {

    static async selectorModeHandler({
        onChange,
        data,
        values = [],
        format = 'array',
        index
    }: SelectorModeHandler) {
        if (!Array.isArray(data)) {
            return;
        }
        let origData = data;

        if (!Array.isArray(origData)) {
            origData = [];
            return;
        }

        switch (format) {
            case 'array':
                if (!Array.isArray(values)) {
                    console.warn('Invalid values received from ManageUser component');
                    return;
                }
                if (!values?.length) {
                    console.warn('No data selected');
                    return;
                }
                if (typeof onChange === 'function') {
                    onChange([
                        ...origData,
                        ...values.filter((item: any) => {
                            return !origData?.some((origItem: any) => {
                                return origItem?.id === item?.id;
                            });
                        })
                    ]);
                }
                return;
            case 'object':
                
                if (typeof index === 'undefined') {
                    DataManagerService.selectorModeCreateHandler({
                        onChange,
                        data: origData,
                        values,
                        format
                    });
                } else {
                    DataManagerService.selectorModeEditHandler({
                        onChange,
                        data: origData,
                        values,
                        format,
                        index
                    });
                }

                return;
            default:
                console.warn('Invalid format specified');
                return;
        }
    }


    static async selectorModeEditHandler({
        onChange,
        data,
        values = [],
        index = 0,
    }: SelectorModeHandler & { data: Array<any> }) {

        if (typeof values !== 'object') {
            console.warn('Invalid values received from ManageUser component');
            return;
        }
        if (!Object.keys(values).length) {
            console.warn('No data selected');
            return;
        }
        if (typeof onChange === 'function') {
            if (index < 0 || index >= data.length) {
                console.warn('Invalid index specified');
                return;
            }
            if (typeof data?.[index] === 'undefined') {
                console.warn('Invalid data specified');
                return;
            }
            const updatedData = [...data];
            updatedData[index] = values;
            onChange(updatedData);
        }
    }

    static async selectorModeCreateHandler(
        {
            onChange,
            data,
            values = [],
        }: SelectorModeHandler & { data: Array<any> }
    ) {

        if (typeof values !== 'object') {
            console.warn('Invalid values received from ManageUser component');
            return;
        }
        if (!Object.keys(values).length) {
            console.warn('No data selected');
            return;
        }
        if (typeof onChange === 'function') {
            console.log('selectorModeCreateHandler', data, values, [
                ...data,
                values
            ]);
            onChange([
                ...data,
                values
            ]);
        }
    }

    static async editModeCreateHandler(
        {
            onChange,
            data,
            values = [],
        }: {
            data?: Array<any>,
            values: FormikValues,
            onChange: (values: any) => void
        }
    ) {
        if (Array.isArray(data)) {
            let origData = data;
            if (!Array.isArray(origData)) {
                origData = [];
                return;
            }
            if (typeof onChange === 'function') {
                onChange([
                    ...origData,
                    values
                ]);
            }
            return;
        }
    }
}