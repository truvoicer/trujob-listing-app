import Form, { FormContextType, VALIDATION_ALPHA_NUMERIC_SYMBOLS, VALIDATION_EMAIL, VALIDATION_REQUIRED } from "@/components/form/Form";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { connect } from "react-redux";

export type LoginBlockProps = {
    session: any;
}
function LoginBlock({ 
    session
 }: LoginBlockProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    async function formSubmitHandler(values: any, errors: any) {
        let requestData = { ...values };
        requestData.auth_provider = "local";
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.auth.login}`,
            method: ApiMiddleware.METHOD.POST,
            data: requestData
        })
        if (!TruJobApiMiddleware.handleTokenResponse(
            response
        )) {
            return;
        }
        router.push(
            UrlHelpers.getRedirectUrl(
                searchParams,
                '/'
            )
        );
    }

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center">
                <div className="col-md-7 mb-5 z-index-1" data-aos="fade" >

                    <h2 className="mb-5 text-black">Log In</h2>

                    <Form className="p-5 bg-white"
                        operation="create"
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

                        {({
                            values,
                            errors,
                            onChange,
                            onSubmit
                        }: FormContextType) => (
                            <>
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
                                            onChange={onChange}
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
                                            onChange={onChange}
                                        />
                                        {errors?.password && <span className="text-danger">{errors?.password || ''}</span>}
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-12">
                                        <p>No account yet? <a href="register.html">Register</a></p>
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
                                                onSubmit(e);
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
export default connect(
    (state: any) => ({
        session: state[SESSION_STATE]
    })
)(LoginBlock);