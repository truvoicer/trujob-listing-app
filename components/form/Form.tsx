import { ObjectDifference } from "@/helpers/ObjectDfference";
import { compareValues, isObject, isObjectEmpty } from "@/helpers/utils";
import { Formik, FormikProps, FormikValues } from "formik";
import React, { useState, useEffect } from "react";

export type FormProps = {
  operation: string;
  className?: string | null;
  initialValues?: any;
  requiredFields?: any;
  validation?: any;
  onSubmit: (data: any, errors: any) => void;
  preventSubmitOnErrors?: boolean;
  children: any;
};
export type ValidationRule = {
  [key: string]: string | number | boolean | null;
  type: string;
  message: string | null;
  value: any;
  field: string | null;
};
export type FormContextType = {
  values: any;
  setValues: (values: any) => void;
  setFieldValue: (key: string, value: any) => void;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<boolean>;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  validate: () => any;
  errors: any;
};

export const VALIDATION_REQUIRED = "required";
export const VALIDATION_REQUIRED_IF = "required_if";
export const VALIDATION_EMAIL = "email";
export const VALIDATION_MIN_LENGTH = "min_length";
export const VALIDATION_MAX_LENGTH = "max_length";
export const VALIDATION_MIN = "min";
export const VALIDATION_MAX = "max";
export const VALIDATION_NUMERIC = "numeric";
export const VALIDATION_ALPHA = "alpha";
export const VALIDATION_ALPHA_NUMERIC = "alpha_numeric";
export const VALIDATION_ALLOW_SPACES = "allow_spaces";
export const VALIDATION_ALPHA_NUMERIC_HYPHENS = "alpha_numeric_hyphens";
export const VALIDATION_ALPHA_NUMERIC_SYMBOLS = "alpha_numeric_symbols";
export const VALIDATION_REGEX = "regex";
export const VALIDATION_MATCH = "match";
export const VALIDATION_DATE = "date";
export const VALIDATION_DATE_TIME = "date_time";
export const VALIDATION_TIME = "time";
export const VALIDATION_URL = "url";

export const VALIDATION_PHONE = "phone";

export const VALIDATION_RULES = [
  VALIDATION_REQUIRED,
  VALIDATION_EMAIL,
  VALIDATION_MIN_LENGTH,
  VALIDATION_MAX_LENGTH,
  VALIDATION_MIN,
  VALIDATION_MAX,
  VALIDATION_NUMERIC,
  VALIDATION_ALPHA,
  VALIDATION_ALPHA_NUMERIC,
  VALIDATION_REGEX,
  VALIDATION_MATCH,
  VALIDATION_ALPHA_NUMERIC_SYMBOLS,
  VALIDATION_REQUIRED_IF,
  VALIDATION_ALLOW_SPACES,
  VALIDATION_ALPHA_NUMERIC_HYPHENS,
  VALIDATION_DATE,
  VALIDATION_PHONE,
  VALIDATION_DATE_TIME,
  VALIDATION_TIME,
  VALIDATION_URL,
];

function Form({
  operation = "create",
  className = "",
  initialValues = {},
  requiredFields = [],
  validation = {},
  onSubmit,
  preventSubmitOnErrors = true,
  children,
}: FormProps) {
  function allowSpaces(rules: ValidationRule[]): boolean {
    return (
      rules.find((rule) => rule.type === VALIDATION_ALLOW_SPACES) !== undefined
    );
  }
  function findByRuleType(
    rules: ValidationRule[],
    type: string
  ): ValidationRule | undefined {
    return rules.find((rule) => rule.type === type);
  }

  function validateRequired(
    values: FormikValues,
    key: string
  ): boolean {
    return values?.[key] !== undefined && values?.[key] !== null && values?.[key] !== "";
  }
  function validateRequiredIf(
    rule: ValidationRule,
    values: FormikValues
  ): boolean {
    if (typeof rule.field === "undefined") {
      console.log(`Validation rule ${rule.type} requires a field`);
      return false;
    }
    if (!rule.field || rule.field === "") {
      console.log(
        `Validation rule ${rule.type} requires a field to be defined`
      );
      return false;
    }

    if (typeof rule.field === "string") {
      if (!rule.hasOwnProperty("value")) {
        return values?.[rule.field] === true;
      }
      return values?.[rule.field] === rule.value;
    }
    if (typeof rule.field === "object") {
      return Object.keys(rule.field).some(
        (key) => values?.[key] === rule.field[key]
      );
    }
    return false; // If the field is set, the validation is required
  }

  function checkValidationRule(
    rule: ValidationRule,
    requiredRuleFields: Array<string> = []
  ) {
    for (let i = 0; i < requiredRuleFields.length; i++) {
      const field = requiredRuleFields[i];
      if (typeof rule[field] === "undefined") {
        console.log(`Validation rule ${rule.type} requires a ${field} field`);
        return false;
      }
      if (rule[field] === null || rule[field] === "") {
        console.log(
          `Validation rule ${rule.type} ${field} field cannot be null or empty`
        );
        return false;
      }
    }
    return true;
  }

  function validationHandler(values: FormikValues) {
    if (!isObject(validation) || isObjectEmpty(validation)) {
      return {};
    }
    if (!isObject(values) || isObjectEmpty(values)) {
      return {};
    }
    let validationErrors: any = {};
    Object.keys(validation).forEach((key) => {
      if (!Array.isArray(validation[key]) || validation[key].length === 0) {
        return;
      }
      validation[key].forEach((rule) => {
        if (!VALIDATION_RULES.includes(rule.type)) {
          console.log(`Validation rule ${rule.type} is not supported`);
          return;
        }
        const findRequiredIfRule = findByRuleType(
          validation[key],
          VALIDATION_REQUIRED_IF
        );
        if (findRequiredIfRule && !validateRequiredIf(findRequiredIfRule, values)) {
          return; // Skip validation if required_if rule is not met
        }
        const findRequiredRule = findByRuleType(
          validation[key],
          VALIDATION_REQUIRED
        );
        
        if (!findRequiredRule && !validateRequired(values, key)) {
          return; // Skip validation if required rule is not met
        }

        let expression;
        switch (rule.type) {
          case VALIDATION_REQUIRED:
            if (values[key] === "") {
              validationErrors[key] = rule.message || "This field is required";
            }
            break;
          case VALIDATION_EMAIL:
            if (!values[key].match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
              validationErrors[key] = rule.message || "Invalid email address";
            }
            break;
          case VALIDATION_MIN_LENGTH:
            if (!checkValidationRule(rule, ["value"])) {
              return;
            }
            if (values[key].length < rule.value) {
              validationErrors[key] =
                rule.message || `Minimum length is ${rule.value}`;
            }
            break;
          case VALIDATION_MAX_LENGTH:
            if (!checkValidationRule(rule, ["value"])) {
              return;
            }
            if (values[key].length > rule.value) {
              validationErrors[key] =
                rule.message || `Maximum length is ${rule.value}`;
            }
            break;
          case VALIDATION_MIN:
            if (!checkValidationRule(rule, ["value"])) {
              return;
            }
            if (values[key] < rule.value) {
              validationErrors[key] =
                rule.message || `Minimum value is ${rule.value}`;
            }
            break;
          case VALIDATION_MAX:
            if (!checkValidationRule(rule, ["value"])) {
              return;
            }
            if (values[key] > rule.value) {
              validationErrors[key] =
                rule.message || `Maximum value is ${rule.value}`;
            }
            break;
          case VALIDATION_NUMERIC:
            if (allowSpaces(validation[key])) {
              expression = /^\d+\s*$/;
            } else {
              expression = /^\d+$/;
            }
            if (!values[key].match(expression)) {
              validationErrors[key] =
                rule.message || `Only numeric values are allowed`;
            }
            break;
          case VALIDATION_ALPHA:
            if (allowSpaces(validation[key])) {
              expression = /^[a-zA-Z\s]+$/;
            } else {
              expression = /^[a-zA-Z]+$/;
            }
            if (!values[key].match(expression)) {
              validationErrors[key] =
                rule.message || `Only alphabetic values are allowed`;
            }
            break;
          case VALIDATION_ALPHA_NUMERIC:
            if (allowSpaces(validation[key])) {
              expression = /^[a-zA-Z0-9\s]+$/;
            } else {
              expression = /^[a-zA-Z0-9]+$/;
            }
            if (!values[key].match(expression)) {
              validationErrors[key] =
                rule.message || `Only alphanumeric values are allowed`;
            }
            break;
          case VALIDATION_ALPHA_NUMERIC_HYPHENS:
            if (allowSpaces(validation[key])) {
              expression = /^[a-zA-Z0-9-_\s]+$/;
            } else {
              expression = /^[a-zA-Z0-9-_]+$/;
            }
            if (!values[key].match(expression)) {
              validationErrors[key] =
                rule.message ||
                `Only alphanumeric and hyphens values are allowed`;
            }
            break;
          case VALIDATION_DATE:
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
            if (!values[key].match(dateRegex)) {
              validationErrors[key] =
                rule.message || `Invalid date format, expected YYYY-MM-DD`;
            } else {
              const dateParts = values[key].split("-");
              const year = parseInt(dateParts[0], 10);
              const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
              const day = parseInt(dateParts[2], 10);
              const date = new Date(year, month, day);
              if (
                date.getFullYear() !== year ||
                date.getMonth() !== month ||
                date.getDate() !== day
              ) {
                validationErrors[key] = rule.message || `Invalid date value`;
              }
            }
            break;
          case VALIDATION_DATE_TIME:
            const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/; // YYYY-MM-DDTHH:MM:SS format
            if (!values[key].match(dateTimeRegex)) {
              validationErrors[key] =
                rule.message ||
                `Invalid date-time format, expected YYYY-MM-DDTHH:MM:SS`;
            } else {
              const dateTimeParts = values[key].split("T");
              const dateParts = dateTimeParts[0].split("-");
              const timeParts = dateTimeParts[1].split(":");
              const year = parseInt(dateParts[0], 10);
              const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
              const day = parseInt(dateParts[2], 10);
              const hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1], 10);
              const seconds = parseInt(timeParts[2], 10);
              const date = new Date(year, month, day, hours, minutes, seconds);
              if (
                date.getFullYear() !== year ||
                date.getMonth() !== month ||
                date.getDate() !== day ||
                date.getHours() !== hours ||
                date.getMinutes() !== minutes ||
                date.getSeconds() !== seconds
              ) {
                validationErrors[key] =
                  rule.message || `Invalid date-time value`;
              }
            }
            break;
          case VALIDATION_TIME:
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/; // HH:MM:SS format
            if (!values[key].match(timeRegex)) {
              validationErrors[key] =
                rule.message || `Invalid time format, expected HH:MM:SS`;
            } else {
              const timeParts = values[key].split(":");
              const hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1], 10);
              const seconds = parseInt(timeParts[2], 10);
              if (
                hours < 0 ||
                hours > 23 ||
                minutes < 0 ||
                minutes > 59 ||
                seconds < 0 ||
                seconds > 59
              ) {
                validationErrors[key] = rule.message || `Invalid time value`;
              }
            }
            break;
          case VALIDATION_URL:
            // Regular expression for validating http and https URLs
          
            const urlRegex = /^(https?:\/\/)?([\w.-]+)(:[0-9]+)?(\/[\w.-]*)*\/?$/;
            if (!values[key].match(urlRegex)) {
              validationErrors[key] =
                rule.message || `Invalid URL format, expected http(s)://...`;
            }
            break;
          case VALIDATION_PHONE:
            const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
            if (!values[key].match(phoneRegex)) {
              validationErrors[key] =
                rule.message ||
                `Invalid phone number format, expected E.164 format`;
            }
            break;
          case VALIDATION_ALPHA_NUMERIC_HYPHENS:
            if (allowSpaces(validation[key])) {
              expression = /^[a-zA-Z0-9-_ ]+$/;
            } else {
              expression = /^[a-zA-Z0-9-_]+$/;
            }
            if (!values[key].match(expression)) {
              validationErrors[key] =
                rule.message ||
                `Only alphanumeric and hyphens values are allowed`;
            }
            break;
          case VALIDATION_ALPHA_NUMERIC_SYMBOLS:
            if (allowSpaces(validation[key])) {
              expression = /^[a-zA-Z0-9!@#$%^&*()_\-\s]+$/;
            } else {
              expression = /^[a-zA-Z0-9!@#$%^&*()_-]+$/;
            }
            if (!values[key].match(expression)) {
              validationErrors[key] =
                rule.message ||
                `Only alphanumeric and symbols values are allowed`;
            }
            break;
          case VALIDATION_REGEX:
            if (!checkValidationRule(rule, ["value"])) {
              return;
            }
            if (!values[key].match(rule.value)) {
              validationErrors[key] = rule.message || `Invalid value`;
            }
            break;
          case VALIDATION_MATCH:
            if (!checkValidationRule(rule, ["field"])) {
              return;
            }
            if (values[key] !== values[rule.field]) {
              validationErrors[key] = rule.message || `Values do not match`;
            }
            break;
          case VALIDATION_REQUIRED_IF:
            if (!checkValidationRule(rule, ["field"])) {
              return;
            }
            if (!validateRequiredIf(rule, values)) {
              validationErrors[key] =
                rule.message ||
                `This field is required if ${JSON.stringify(
                  rule.field
                )} is set`;
            }
            break;
        }
      });
    });
    return validationErrors;
  }

  function buildFinalValues(values: FormikValues) {
    return ObjectDifference.getDifference(
      values,
      initialValues,
      requiredFields
    );
  }
  function handleSubmit(
    values: FormikValues,
    formikHelpers: FormikProps<FormikValues>
  ) {
    if (typeof operation !== "string") {
      console.log(`Form operation is not a string`);
      return;
    }
    let requestData = { ...values };
    const errors = validationHandler(requestData);
    if (preventSubmitOnErrors && Object.keys(errors).length > 0) {
      console.log(`Form has validation errors`, errors);
      return;
    }

    if (["update", "edit"].includes(operation)) {
      requestData = buildFinalValues(requestData);
    }

    return onSubmit(requestData, errors);
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validateOnMount={true}
      validateOnBlur={true}
      validateOnChange={true}
      validate={validationHandler}
      onSubmit={handleSubmit}
    >
      {(formikHelpers) => (
        <form onSubmit={formikHelpers.handleSubmit} className={className || ""}>
          {children(formikHelpers)}
        </form>
      )}
    </Formik>
  );
}
export default Form;
