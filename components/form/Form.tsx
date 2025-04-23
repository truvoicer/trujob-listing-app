import { ObjectDifference } from "@/helpers/ObjectDfference";
import { compareValues, isObject, isObjectEmpty } from "@/helpers/utils";
import React, { useState, useEffect } from 'react';

export type FormProps = {
    operation: string;
    className?: string  | null;
    initialValues?: any;
    requiredFields?: any;
    validation?: any;
    onSubmit: (data: any, errors: any) => void;
    preventSubmitOnErrors?: boolean;
    children: any;
}
export type ValidationRule = {
    [key: string]: string | number | boolean | null;
    type: string;
    message: string | null;
    value: any;
    field: string | null;
}
export type FormContextType = {
    values: any;
    setValues: (values: any) => void;
    setFieldValue: (key: string, value: any) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    validate: () => any;
    errors: any;
}

export const VALIDATION_REQUIRED = 'required';
export const VALIDATION_EMAIL = 'email';
export const VALIDATION_MIN_LENGTH = 'min_length';
export const VALIDATION_MAX_LENGTH = 'max_length';
export const VALIDATION_MIN = 'min';
export const VALIDATION_MAX = 'max';
export const VALIDATION_NUMERIC = 'numeric';
export const VALIDATION_ALPHA = 'alpha';
export const VALIDATION_ALPHA_NUMERIC = 'alpha_numeric';
export const VALIDATION_ALPHA_NUMERIC_HYPHENS = 'alpha_numeric_hyphens';
export const VALIDATION_ALPHA_NUMERIC_SYMBOLS = 'alpha_numeric_symbols';
export const VALIDATION_REGEX = 'regex';
export const VALIDATION_MATCH = 'match';

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
];

export const formContextData: FormContextType = {
    values: {},
    setValues: () => {},
    setFieldValue: () => {},
    onChange: () => {},
    onSubmit: () => {},
    onBlur: () => {},
    validate: () => {},
    errors: {},
};
export const FormContext = React.createContext(formContextData);

function Form({
    operation = 'create',
    className = '',
    initialValues = {},
    requiredFields = [],
    validation = {},
    onSubmit,
    preventSubmitOnErrors = true,
    children
}: FormProps) {

    const [formContextState, setFormContextState] = useState({
        ...formContextData,
        values: JSON.parse(JSON.stringify(initialValues)),
        setValues: setValues,
        setFieldValue: setFieldValue,
        onChange: handleChange,
        onSubmit: handleSubmit,
        onBlur: handleBlur,
        validate: validationHandler,
    });

    function setValues(values: any) {
        if (typeof values !== 'object') {
            return;
        }
        setFormContextState(prevState => {
            let newState = { ...prevState };
            Object.keys(values).forEach(key => {
                newState.values[key] = values[key];
            });
            return newState;
        });
    }

    function setFieldValue(key: string, value: any) {
        setFormContextState(prevState => {
            let newState = { ...prevState };
            if (typeof newState.values?.[key] === 'undefined') {
                console.warn(`Form value ${key} does not exist in values`);
                return newState;
            }
            newState.values[key] = value;
            return newState;
        });
    }

    function checkValidationRule(rule: ValidationRule, requiredFields: Array<string> = []) {
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (typeof rule[field] === 'undefined') {
                console.warn(`Validation rule ${rule.type} requires a ${field} field`);
                return false;
            }
            if (rule[field] === null || rule[field] === '') {
                console.warn(`Validation rule ${rule.type} ${field} field cannot be null or empty`);
                return false;
            }
        }
        return true;
    }

    function validationHandler() {
        const values = formContextState.values;
        if (!isObject(validation) || isObjectEmpty(validation)) {
            return {};
        }
        if (!isObject(values) || isObjectEmpty(values)) {
            return {};
        }
        let validationErrors: any = {};
        Object.keys(validation).forEach(key => {
            if (!Array.isArray(validation[key]) || validation[key].length === 0) {
                return;
            }
            validation[key].forEach(rule => {
                if (!VALIDATION_RULES.includes(rule.type)) {
                    console.warn(`Validation rule ${rule.type} is not supported`);
                    return;
                }
                switch (rule.type) {
                    case VALIDATION_REQUIRED:
                        if (values[key] === '') {
                            validationErrors[key] = rule.message || 'This field is required';
                        }
                        break;
                    case VALIDATION_EMAIL:
                        if (!values[key].match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                            validationErrors[key] = rule.message || 'Invalid email address';
                        }
                        break;
                    case VALIDATION_MIN_LENGTH:
                        if (!checkValidationRule(rule, ['value'])) {
                            return;
                        }
                        if (values[key].length < rule.value) {
                            validationErrors[key] = rule.message || `Minimum length is ${rule.value}`;
                        }
                        break;
                    case VALIDATION_MAX_LENGTH:
                        if (!checkValidationRule(rule, ['value'])) {
                            return;
                        }
                        if (values[key].length > rule.value) {
                            validationErrors[key] = rule.message || `Maximum length is ${rule.value}`;
                        }
                        break;
                    case VALIDATION_MIN:
                        if (!checkValidationRule(rule, ['value'])) {
                            return;
                        }
                        if (values[key] < rule.value) {
                            validationErrors[key] = rule.message || `Minimum value is ${rule.value}`;
                        }
                        break;
                    case VALIDATION_MAX:
                        if (!checkValidationRule(rule, ['value'])) {
                            return;
                        }
                        if (values[key] > rule.value) {
                            validationErrors[key] = rule.message || `Maximum value is ${rule.value}`;
                        }
                        break;
                    case VALIDATION_NUMERIC:
                        if (!values[key].match(/^\d+$/)) {
                            validationErrors[key] = rule.message || `Only numeric values are allowed`;
                        }
                        break;
                    case VALIDATION_ALPHA:
                        if (!values[key].match(/^[a-zA-Z]+$/)) {
                            validationErrors[key] = rule.message || `Only alphabetic values are allowed`;
                        }
                        break;
                    case VALIDATION_ALPHA_NUMERIC:
                        if (!values[key].match(/^[a-zA-Z0-9]+$/)) {
                            validationErrors[key] = rule.message || `Only alphanumeric values are allowed`;
                        }
                        break;
                    case VALIDATION_ALPHA_NUMERIC_HYPHENS:
                        if (!values[key].match(/^[a-zA-Z0-9-_]+$/)) {
                            validationErrors[key] = rule.message || `Only alphanumeric and hyphens values are allowed`;
                        }
                        break;
                    case VALIDATION_ALPHA_NUMERIC_SYMBOLS:
                        if (!values[key].match(/^[a-zA-Z0-9!@#$%^&*()_-]+$/)) {
                            validationErrors[key] = rule.message || `Only alphanumeric and symbols values are allowed`;
                        }
                        break;
                    case VALIDATION_REGEX:
                        if (!checkValidationRule(rule, ['value'])) {
                            return;
                        }
                        if (!values[key].match(rule.value)) {
                            validationErrors[key] = rule.message || `Invalid value`;
                        }
                        break;
                    case VALIDATION_MATCH:
                        if (!checkValidationRule(rule, ['field'])) {
                            return;
                        }
                        if (values[key] !== values[rule.field]) {
                            validationErrors[key] = rule.message || `Values do not match`;
                        }
                        break;
                }
            });
        });
        return validationErrors;
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = e.target;
        if (e.target.hasOwnProperty('checked')) {
            setFieldValue(name, e.target.checked);
            return;
        }
        setFieldValue(name, value);
    }

    function buildFinalValues(values: any) {
        return ObjectDifference.getDifference(
            values, 
            initialValues, 
            requiredFields
        );
    }
    function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
        if (e) {
            e.preventDefault();
        }
        if (typeof operation !== 'string') {
            console.warn(`Form operation is not a string`);
            return;
        }
        const errors = validationHandler();
        if (preventSubmitOnErrors && Object.keys(errors).length > 0) {
            return;
        }
        let requestData = { ...formContextState.values };

        if (['update', 'edit'].includes(operation)) {
            requestData = buildFinalValues(requestData);
        }
        
        onSubmit(requestData, errors);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFieldValue(name, value);
    }

    return (
        <FormContext.Provider value={formContextState}>
            <form onSubmit={formContextState.onSubmit} className={className || ''}>
                {children(formContextState)}
            </form>
        </FormContext.Provider>
    )
}
export default Form;