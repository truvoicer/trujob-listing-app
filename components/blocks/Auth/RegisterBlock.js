import Form from "@/components/form/Form";
import { VALIDATION_ALPHA_NUMERIC, VALIDATION_ALPHA_NUMERIC_HYPHENS, VALIDATION_ALPHA_NUMERIC_SYMBOLS, VALIDATION_EMAIL, VALIDATION_MATCH, VALIDATION_REQUIRED } from "@/components/form/FormProvider";
import RegisterForm from "@/components/Theme/Listing/Form/Auth/RegisterForm";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { setIsAuthenticatingAction, setSessionLocalStorage, setSessionUserAction } from "@/library/redux/actions/session-actions";
import { SessionService } from "@/library/services/session/SessionService";

function RegisterBlock() {


    const formSubmitHandler = (values, errors) => {
        let requestData = { ...values };
        requestData.auth_provider = "local";
        const response = TruJobApiMiddleware.getInstance().registerUserRequest({}, requestData);
        if (!SessionService.handleTokenResponse(response)) {
            return;
        }
        console.log({ response, requestData });
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
                            username: "",
                            email: "",
                            password: "",
                            password_confirmation: ""
                        }}
                        validation={{
                            username: [
                                { type: VALIDATION_ALPHA_NUMERIC_HYPHENS },
                                { type: VALIDATION_REQUIRED }
                            ],
                            email: [
                                { type: VALIDATION_EMAIL },
                                { type: VALIDATION_REQUIRED }
                            ],
                            password: [
                                { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS },
                                { type: VALIDATION_REQUIRED }
                            ],
                            password_confirmation: [
                                { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS },
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