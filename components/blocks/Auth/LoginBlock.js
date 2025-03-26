import Form from "@/components/form/Form";
import { VALIDATION_ALPHA_NUMERIC_SYMBOLS, VALIDATION_EMAIL, VALIDATION_REQUIRED } from "@/components/form/FormProvider";
import LoginForm from "@/components/Theme/Listing/Form/Auth/LoginForm";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionService } from "@/library/services/session/SessionService";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";

function LoginBlock({session}) {
    const router = useRouter();
     async function formSubmitHandler(values, errors) {
        let requestData = { ...values };
        requestData.auth_provider = "local";
        const response = await TruJobApiMiddleware.getInstance().loginRequest({}, requestData);
        if (!SessionService.handleTokenResponse(response)) {
            return;
        }
        router.push("/");
    }
    
    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-md-7 mb-5 z-index-1" data-aos="fade" >

                    <h2 className="mb-5 text-black">Log In</h2>

                    <Form className="p-5 bg-white"
                        onSubmit={formSubmitHandler}
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        validation={{
                            email: [
                                { type: VALIDATION_EMAIL },
                                { type: VALIDATION_REQUIRED }
                            ],
                            password: [
                                { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS },
                                { type: VALIDATION_REQUIRED }
                            ],
                        }}>
                        <LoginForm />
                    </Form>
                </div>

            </div>
        </div>
    );
}
export default connect(
    state => ({
        session: state[SESSION_STATE]
    })
)(LoginBlock);