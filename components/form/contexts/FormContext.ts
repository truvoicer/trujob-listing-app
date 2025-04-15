import React from "react";

export const formContextData = {
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