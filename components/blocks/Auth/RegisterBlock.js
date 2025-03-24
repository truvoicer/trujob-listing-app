import Form from "@/components/form/Form";
import { VALIDATION_ALPHA_NUMERIC_SYMBOLS, VALIDATION_EMAIL, VALIDATION_MATCH, VALIDATION_REQUIRED } from "@/components/form/FormProvider";
import RegisterForm from "@/components/Theme/Listing/Form/Auth/RegisterForm";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";

function RegisterBlock() {

    function requestCallback(error, data) {
        if (!error && data.status === 'success' && data?.token) {
            setSessionLocalStorage(data.token, data.expiresAt)
            setIsAuthenticatingAction(false)
        }
        if (typeof props.requestCallback === "function") {
            props.requestCallback(error, data)
        }
    }

    const formSubmitHandler = (values, errors) => {
        let requestData = {...values};
        requestData.auth_provider = "local";
        const response = TruJobApiMiddleware.getInstance().registerUserRequest(requestData);
        console.log({ response });
    }

    return (

        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-md-7 mb-5 z-index-1" data-aos="fade">

                    <h2 className="mb-5 text-black">Register</h2>
                    <Form 
                        className="p-5 bg-white" 
                        onSubmit={formSubmitHandler}
                        initialValues={{
                            email: "",
                            password: "",
                            confirm_password: ""
                        }}
                        validation={{
                            email: [
                                { type: VALIDATION_EMAIL},
                                { type: VALIDATION_REQUIRED }
                            ],
                            password: [
                                { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS},
                                { type: VALIDATION_REQUIRED }
                            ],
                            confirm_password: [
                                { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS},
                                { type: VALIDATION_REQUIRED },
                                { type: VALIDATION_MATCH, field: 'password' },
                            ],
                        }}
                        >
                        <RegisterForm />
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default RegisterBlock;