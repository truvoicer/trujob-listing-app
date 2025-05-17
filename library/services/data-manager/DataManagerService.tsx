import { FormikValues } from "formik";

export class DataManagerService {

    static async selectorModeCreateHandler(
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
        console.warn('selectorModeCreateHandler', data, values);
        if (Array.isArray(data)) {
            if (!Array.isArray(values)) {
                console.warn('Invalid values received from ManageUser component');
                return;
            }
            if (!values?.length) {
                console.warn('No features selected');
                return;
            }
            let origData = data;
            if (!Array.isArray(origData)) {
                origData = [];
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