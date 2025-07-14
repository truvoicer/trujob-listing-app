import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import Checkbox from "@/components/Elements/Checkbox";
import DateInput from "@/components/Elements/DateInput";
import TextInput from "@/components/Elements/TextInput";
import Form, {
  VALIDATION_ALLOW_SPACES,
  VALIDATION_ALPHA_NUMERIC,
  VALIDATION_ALPHA_NUMERIC_SYMBOLS,
  VALIDATION_DATE,
  VALIDATION_EMAIL,
  VALIDATION_MATCH,
  VALIDATION_PHONE,
  VALIDATION_REQUIRED_IF,
} from "@/components/form/Form";
import { AppModalContext } from "@/contexts/AppModalContext";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import {
  SESSION_USER,
  SESSION_USER_EMAIL,
  SESSION_USER_FIRSTNAME,
  SESSION_USER_LASTNAME,
  SESSION_USER_PROFILE,
  SESSION_USER_PROFILE_DOB,
  SESSION_USER_PROFILE_PHONE,
  SESSION_USER_SETTINGS,
  SESSION_USER_SETTINGS_COUNTRY,
  SESSION_USER_SETTINGS_CURRENCY,
  SESSION_USER_SETTINGS_LANGUAGE,
  SESSION_USER_USERNAME,
} from "@/library/redux/constants/session-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { RootState } from "@/library/redux/store";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { FormikProps, FormikValues } from "formik";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import PasswordReset from "./PasswordReset";
export type EditProfile = {
  session: SessionState;
};

function EditProfile({ session }: EditProfile) {
  const notificationContext = useContext(AppModalContext);
  async function formSubmitHandler(values: FormikValues) {
    let requestData = {};
    if (values?.[SESSION_USER_FIRSTNAME]) {
      requestData[SESSION_USER_FIRSTNAME] = values?.[SESSION_USER_FIRSTNAME];
    }
    if (values?.[SESSION_USER_LASTNAME]) {
      requestData[SESSION_USER_LASTNAME] = values?.[SESSION_USER_LASTNAME];
    }
    if (values?.[SESSION_USER_USERNAME]) {
      requestData[SESSION_USER_USERNAME] = values?.[SESSION_USER_USERNAME];
    }
    if (values?.[SESSION_USER_EMAIL]) {
      requestData[SESSION_USER_EMAIL] = values?.[SESSION_USER_EMAIL];
    }
    if (values?.[SESSION_USER_PROFILE_DOB]) {
      requestData[SESSION_USER_PROFILE_DOB] =
        values?.[SESSION_USER_PROFILE_DOB];
    }
    if (values?.[SESSION_USER_PROFILE_PHONE]) {
      requestData[SESSION_USER_PROFILE_PHONE] =
        values?.[SESSION_USER_PROFILE_PHONE];
    }
    if (values?.[SESSION_USER_SETTINGS_COUNTRY]) {
      requestData.country_id = values?.[SESSION_USER_SETTINGS_COUNTRY]?.value;
    }
    if (values?.[SESSION_USER_SETTINGS_CURRENCY]) {
      requestData.currency_id = values?.[SESSION_USER_SETTINGS_CURRENCY]?.value;
    }
    if (values?.[SESSION_USER_SETTINGS_LANGUAGE]) {
      requestData.language_id = values?.[SESSION_USER_SETTINGS_LANGUAGE]?.id;
    }

    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: UrlHelpers.urlFromArray([
        TruJobApiMiddleware.getConfig().endpoints.profile,
        "update",
      ]),
      method: TruJobApiMiddleware.METHOD.PATCH,
      protectedReq: true,
      data: requestData,
    });
    if (!response) {
      console.error("Failed to update profile. No response received.");
      return;
    }
    TruJobApiMiddleware.getInstance().refreshSessionUser();
  }
  const user = session?.[SESSION_USER];
  const userCountry = user?.[SESSION_USER_SETTINGS]?.[SESSION_USER_SETTINGS_COUNTRY];
  const userCurrency = user?.[SESSION_USER_SETTINGS]?.[SESSION_USER_SETTINGS_CURRENCY];
  return (
    <div>
      <h1>Edit Profile</h1>
      <Form
        className="p-5 bg-white"
        operation="update"
        onSubmit={formSubmitHandler}
        initialValues={{
          [SESSION_USER_FIRSTNAME]: user?.[SESSION_USER_FIRSTNAME] || "",
          [SESSION_USER_LASTNAME]: user?.[SESSION_USER_LASTNAME] || "",
          [SESSION_USER_USERNAME]: user?.[SESSION_USER_USERNAME] || "",
          [SESSION_USER_EMAIL]: user?.[SESSION_USER_EMAIL] || "",
          [SESSION_USER_PROFILE_DOB]:
            user?.[SESSION_USER_PROFILE]?.[SESSION_USER_PROFILE_DOB] || "",
          [SESSION_USER_PROFILE_PHONE]:
            user?.[SESSION_USER_PROFILE]?.[SESSION_USER_PROFILE_PHONE] || "",
          [SESSION_USER_SETTINGS_COUNTRY]: userCountry ? {
            value: userCountry?.id,
            label: userCountry?.name,
          } : null,
          [SESSION_USER_SETTINGS_CURRENCY]: userCurrency ? {
            value: userCurrency?.id,
            label: userCurrency?.name,
          } : null,
          [SESSION_USER_SETTINGS_LANGUAGE]:
            user?.[SESSION_USER_SETTINGS]?.[SESSION_USER_SETTINGS_LANGUAGE] ||
            "",
        }}
        validation={{
          [SESSION_USER_FIRSTNAME]: [
            { type: VALIDATION_ALPHA_NUMERIC },
            { type: VALIDATION_ALLOW_SPACES },
          ],
          [SESSION_USER_LASTNAME]: [
            { type: VALIDATION_ALPHA_NUMERIC },
            { type: VALIDATION_ALLOW_SPACES },
          ],
          [SESSION_USER_USERNAME]: [{ type: VALIDATION_ALPHA_NUMERIC }],
          [SESSION_USER_EMAIL]: [{ type: VALIDATION_EMAIL }],
          [SESSION_USER_PROFILE_PHONE]: [{ type: VALIDATION_PHONE }],
          [SESSION_USER_PROFILE_DOB]: [{ type: VALIDATION_DATE }],
        }}
      >
        {({
          values,
          errors,
          setFieldValue,
          handleChange,
        }: FormikProps<FormikValues>) => {
          return (
            <>
              <div className="row form-group">
                <div className="col-12 col-lg-6">
                  <TextInput
                    value={values?.[SESSION_USER_FIRSTNAME] || ""}
                    onChange={handleChange}
                    placeholder="Enter First Name"
                    name="first_name"
                    type="text"
                    label="First Name"
                  />
                  {errors?.[SESSION_USER_FIRSTNAME] && (
                    <div className="text-danger">
                      {errors?.[SESSION_USER_FIRSTNAME] || ""}
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-6">
                  <TextInput
                    value={values?.[SESSION_USER_LASTNAME] || ""}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    name="last_name"
                    type="text"
                    label="Last Name"
                  />
                  {errors?.[SESSION_USER_LASTNAME] && (
                    <div className="text-danger">
                      {errors?.[SESSION_USER_LASTNAME] || ""}
                    </div>
                  )}
                </div>
                <div className="col-12 col-lg-6">
                  <TextInput
                    value={values?.[SESSION_USER_USERNAME] || ""}
                    onChange={handleChange}
                    placeholder="Enter Username"
                    name="username"
                    type="text"
                    label="Username"
                  />
                  {errors?.[SESSION_USER_USERNAME] && (
                    <div className="text-danger">
                      {errors?.[SESSION_USER_USERNAME] || ""}
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-6">
                  <TextInput
                    value={values?.[SESSION_USER_EMAIL] || ""}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    name="email"
                    type="email"
                    label="Email"
                  />
                  {errors?.[SESSION_USER_EMAIL] && (
                    <div className="text-danger">
                      {errors?.[SESSION_USER_EMAIL] || ""}
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-6">
                  <DateInput
                    value={values?.[SESSION_USER_PROFILE_DOB] || ""}
                    onChange={handleChange}
                    placeholder="Enter Date of Birth"
                    name="dob"
                    type="date"
                    label="Date of Birth"
                  />
                  {errors?.[SESSION_USER_PROFILE_DOB] && (
                    <div className="text-danger">
                      {errors?.[SESSION_USER_PROFILE_DOB] || ""}
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-6">
                  <TextInput
                    value={values?.[SESSION_USER_PROFILE_PHONE] || ""}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    name="phone"
                    type="text"
                    label="Phone Number"
                  />
                  {errors?.[SESSION_USER_PROFILE_PHONE] && (
                    <div className="text-danger">
                      {errors?.[SESSION_USER_PROFILE_PHONE] || ""}
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-6 mt-2">
                  <div className="floating-input">
                    <label className="fw-bold" htmlFor="country">
                      Country
                    </label>
                    <CountrySelect
                      value={LocaleService.getValueForCountrySelect(
                        values?.[SESSION_USER_SETTINGS_COUNTRY]
                      )}
                      isMulti={false}
                      showLoadingSpinner={true}
                      onChange={(value) => {
                        setFieldValue(SESSION_USER_SETTINGS_COUNTRY, value);
                      }}
                      loadingMore={true}
                      loadMoreLimit={10}
                    />
                    {errors?.[SESSION_USER_SETTINGS_COUNTRY] && (
                      <div className="text-danger">
                        {errors?.[SESSION_USER_SETTINGS_COUNTRY] || ""}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <label className="fw-bold" htmlFor="currency">
                    Select Currency
                  </label>
                  <CurrencySelect
                    value={
                      values?.[SESSION_USER_SETTINGS_CURRENCY]
                        ? {
                            value: values[SESSION_USER_SETTINGS_CURRENCY]?.value,
                            label: values[SESSION_USER_SETTINGS_CURRENCY]?.label,
                          }
                        : null
                    }
                    isMulti={false}
                    showLoadingSpinner={true}
                    onChange={(value) => {
                      setFieldValue(SESSION_USER_SETTINGS_CURRENCY, value);
                    }}
                    loadingMore={true}
                    loadMoreLimit={10}
                  />
                  {errors?.[SESSION_USER_SETTINGS_CURRENCY] && (
                    <div className="text-danger">
                      {errors?.[SESSION_USER_SETTINGS_CURRENCY] || ""}
                    </div>
                  )}
                </div>
                <div className="col-12 col-lg-6">
                  <Checkbox
                    name="change_password"
                    label="Change Password"
                    value={values?.change_password || false}
                    onChange={(e) => {
                      setFieldValue("change_password", e.target.checked);
                      if (!e.target.checked) {
                        setFieldValue("password", "");
                        setFieldValue("password_confirmation", "");
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <PasswordReset
                    email={session?.[SESSION_USER]?.[SESSION_USER_EMAIL]}
                    onError={(error) => {
                      notificationContext.show(
                        {
                          variant: "error",
                          message:
                            error?.message ||
                            "Failed to send password reset email.",
                        },
                        "password-reset-error"
                      );
                    }}
                    onSuccess={() => {
                      notificationContext.show(
                        {
                          variant: "success",
                          message: "Password reset email sent successfully.",
                        },
                        "password-reset-success"
                      );
                    }}
                  />
                </div>
              </div>
              <div className="row form-group">
                <div className="col-12">
                  <Button variant="secondary" type="submit">
                    Save
                  </Button>
                </div>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
}
export default connect(
  (state: RootState) => ({
    session: state.session,
  }),
  null
)(EditProfile);
