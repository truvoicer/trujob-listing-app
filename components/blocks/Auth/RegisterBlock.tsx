import Form, { VALIDATION_ALPHA_NUMERIC_HYPHENS, VALIDATION_ALPHA_NUMERIC_SYMBOLS, VALIDATION_EMAIL, VALIDATION_MATCH, VALIDATION_REQUIRED } from "@/components/form/Form";
import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikProps, FormikValues } from "formik";

function RegisterBlock() {
    
  const truJobApiMiddleware = TruJobApiMiddleware.getInstance().setDisableLoginModal(true);
    const formSubmitHandler = async (values: FormikValues) => {
        const requestData: Record<string, unknown> = { ...values };
        requestData.auth_provider = "local";
        const response = await truJobApiMiddleware.resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.auth.register}`,
            method: ApiMiddleware.METHOD.POST,
            data: requestData
        });
        if (!await truJobApiMiddleware.handleTokenResponse(response)) {
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
                        {({
                            values,
                            errors,
                            handleChange,
                            submitForm,
                        }: FormikProps<FormikValues>) => (
                            <>
                                <div className="row form-group">

                                    <div className="col-md-12">
                                        <label
                                            className="text-black"
                                            htmlFor="username">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            className="form-control"
                                            value={values?.username || ""}
                                            onChange={handleChange}
                                        />
                                        {errors?.username && <span className="text-danger">{errors?.username || ''}</span>}
                                    </div>
                                </div>
                                <div className="row form-group">

                                    <div className="col-md-12">
                                        <label
                                            className="text-black"
                                            htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-control"
                                            value={values?.email || ""}
                                            onChange={handleChange}
                                        />
                                        {errors?.email && <span className="text-danger">{errors?.email || ''}</span>}
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <label
                                            className="text-black"
                                            htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            value={values?.password || ""}
                                            onChange={handleChange}
                                        />
                                        {errors?.password && <span className="text-danger">{errors?.password || ''}</span>}
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <label
                                            className="text-black"
                                            htmlFor="password_confirmation">
                                            Re-type Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="form-control"
                                            value={values?.password_confirmation || ""}
                                            onChange={handleChange}
                                        />
                                        {errors?.password_confirmation && <span className="text-danger">{errors?.password_confirmation || ''}</span>}
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-12">
                                        <p>Have an account? <a href="login.html">Log In</a></p>
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <input
                                            type="submit"
                                            value="Sign In"
                                            className="btn btn-primary py-2 px-4 text-white"
                                            onClick={e => {
                                                e.preventDefault();
                                                submitForm();
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default RegisterBlock;