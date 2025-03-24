import Form from "@/components/form/Form";
import { VALIDATION_ALPHA_NUMERIC_SYMBOLS, VALIDATION_EMAIL, VALIDATION_REQUIRED } from "@/components/form/FormProvider";
import LoginForm from "@/components/Theme/Listing/Form/Auth/LoginForm";

function LoginBlock() {

    const formSubmitHandler = (values) => {
        // values.auth_provider = "wordpress";
        console.log({ values });
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
export default LoginBlock;