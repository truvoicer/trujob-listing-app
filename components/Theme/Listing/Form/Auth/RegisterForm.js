import { FormContext } from "@/components/form/contexts/FormContext";
import { useContext } from "react";

function RegisterForm() {
    const formContext = useContext(FormContext);
    const errors = formContext.validate();
    return (
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
                        value={formContext?.values?.email || ""}
                        onChange={formContext.onChange}
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
                        value={formContext?.values?.password || ""}
                        onChange={formContext.onChange}
                    />
                    {errors?.password && <span className="text-danger">{errors?.password || ''}</span>}
                </div>
            </div>

            <div className="row form-group">
                <div className="col-md-12">
                    <label
                        className="text-black"
                        htmlFor="confirm_password">
                        Re-type Password
                    </label>
                    <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        className="form-control"
                        value={formContext?.values?.confirm_password || ""}
                        onChange={formContext.onChange}
                    />
                    {errors?.confirm_password && <span className="text-danger">{errors?.confirm_password || ''}</span>}
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
                            formContext.onSubmit(e);
                        }}
                    />
                </div>
            </div>
        </>
    );
}
export default RegisterForm;