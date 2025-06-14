import { FormikValues } from "formik";

export type SelectorModeHandler = {
  onChange: (values: any) => void;
  data?: Array<any>;
  values?: FormikValues;
  format?: "array" | "object";
  index?: number;
};
export type selectorAndEditModeHandler = {
  onChange: (values: any) => void;
  data?: Array<any>;
  values?: FormikValues;
  format?: "array" | "object";
  index?: number;
};
export class DataManagerService {
  static getId(id: string, mode: "delete" | "edit" | "create") {
    if (typeof id !== "string" || !id?.length) {
      console.warn("Invalid id specified");
      return "";
    }
    switch (mode) {
      case "delete":
        return `${id}-delete`;
      case "edit":
        return `${id}-edit`;
      case "create":
        return `${id}-create`;
      default:
        console.warn("Invalid mode specified");
        return "";
    }
  }

  static async selectorModeHandler({
    onChange,
    data,
    values = [],
    format = "array",
    index,
  }: SelectorModeHandler) {
    if (!Array.isArray(data?.items)) {
      DataManagerService.editModeCreateHandler({
        onChange,
        data,
        values,
        index,
      });
      return false;
    }

    let origData = data.items;
    if (!Array.isArray(origData)) {
      origData = [];
      return false;
    }

    switch (format) {
      case "array":
        if (!Array.isArray(values)) {
          console.warn("Invalid values received from ManageUser component");
          return false;
        }
        if (!values?.length) {
          console.warn("No data selected");
          return false;
        }
        if (typeof onChange === "function") {
          onChange([
            ...origData,
            ...values.filter((item: any) => {
              return !origData?.some((origItem: any) => {
                return origItem?.id === item?.id;
              });
            }),
          ]);
        }
        return false;
      case "object":
        if (typeof index === "undefined") {
          DataManagerService.selectorModeCreateHandler({
            onChange,
            data: origData,
            values,
            format,
          });
        } else {
          DataManagerService.selectorModeEditHandler({
            onChange,
            data: origData,
            values,
            format,
            index,
          });
        }

        return false;
      default:
        console.warn("Invalid format specified");
        return false;
    }
  }

  static async selectorModeEditHandler({
    onChange,
    data,
    values = [],
    index = 0,
  }: SelectorModeHandler & { data: Array<any> }) {
    if (typeof values !== "object") {
      console.warn("Invalid values received from ManageUser component");
      return;
    }
    if (!Object.keys(values).length) {
      console.warn("No data selected");
      return;
    }
    if (typeof onChange === "function") {
      if (index < 0 || index >= data.length) {
        console.warn("Invalid index specified");
        return;
      }
      if (typeof data?.[index] === "undefined") {
        console.warn("Invalid data specified");
        return;
      }
      const updatedData = [...data];
      updatedData[index] = values;
      onChange(updatedData);
    }
  }

  static async selectorModeCreateHandler({
    onChange,
    data,
    values = [],
  }: SelectorModeHandler & { data: Array<any> }) {
    if (typeof values !== "object") {
      console.warn("Invalid values received from ManageUser component");
      return;
    }
    if (!Object.keys(values).length) {
      console.warn("No data selected");
      return;
    }
    if (typeof onChange === "function") {
      console.log("selectorModeCreateHandler", data, values, [...data, values]);
      onChange([...data, values]);
    }
  }

  static async editModeCreateHandler({
    onChange,
    data,
    values = [],
    index,
  }: {
    data?: Array<any>;
    values: FormikValues;
    onChange: (values: any) => void;
    index?: number;
  }): Promise<boolean> {
    if (!Array.isArray(data)) {
      return false;
    }
    let origData = [...data];
    if (!Array.isArray(origData)) {
      origData = [];
      return false;
    }
    if (typeof index !== "undefined") {
      origData[index] = values;
    } else {
      origData.push(values);
    }
    if (typeof onChange === "function") {
      onChange(origData);
    }
    return true;
  }
}
