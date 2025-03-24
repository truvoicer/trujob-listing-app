import FormContainer from "./FormContainer";
import FormProvider from "./FormProvider";

function Form({
    initialValues = {},
    validation = {},
    onSubmit,
    className = '',
    preventSubmitOnErrors = true,
    children
}) {
    return (
        <FormProvider
            initialValues={initialValues}
            onSubmit={onSubmit}
            validation={validation}
            preventSubmitOnErrors={preventSubmitOnErrors}>
            <FormContainer className={className}>
                {children}
            </FormContainer>
        </FormProvider>
    )
}
export default Form;