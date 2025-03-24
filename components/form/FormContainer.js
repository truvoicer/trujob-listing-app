import { useEffect, useContext } from "react";
const { FormContext } = require("./contexts/FormContext");

function FormContainer({
    className = '',
    children
}) {
    const formContext = useContext(FormContext);

    // useEffect(() => {
    //     console.log('Form values changed', formContext.values);
    //     formContext.validate(formContext.values);
    // }, [formContext.values]);
    // console.log('FormContainer', formContext);
    return (
        <form onSubmit={formContext.onSubmit} className={className}>
            {children}
        </form>
    )
}
export default FormContainer;