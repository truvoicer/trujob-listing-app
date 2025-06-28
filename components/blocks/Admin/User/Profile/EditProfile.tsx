import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import Checkbox from "@/components/Elements/Checkbox";
import DateInput from "@/components/Elements/DateInput";
import TextInput from "@/components/Elements/TextInput";
import Form, {
    VALIDATION_ALLOW_SPACES,
  VALIDATION_ALPHA_NUMERIC,
  VALIDATION_ALPHA_NUMERIC_HYPHENS,
  VALIDATION_ALPHA_NUMERIC_SYMBOLS,
  VALIDATION_EMAIL,
  VALIDATION_MATCH,
  VALIDATION_REQUIRED,
  VALIDATION_REQUIRED_IF,
} from "@/components/form/Form";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import {
  SESSION_USER,
  SESSION_USER_EMAIL,
  SESSION_USER_FIRSTNAME,
  SESSION_USER_LASTNAME,
  SESSION_USER_PROFILE,
  SESSION_USER_PROFILE_DOB,
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
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
export type EditProfile = {
  session: SessionState;
};

function EditProfile({ session }: EditProfile) {
  async function formSubmitHandler(values: FormikValues) {
    console.log("Form submitted with values:", values);
    
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
        requestData[SESSION_USER_PROFILE] = values?.[SESSION_USER_PROFILE_DOB];
    }
    if (values?.[SESSION_USER_SETTINGS_COUNTRY]) {
        requestData.country_id = values?.[SESSION_USER_SETTINGS_COUNTRY]?.value;
    }
    if (values?.[SESSION_USER_SETTINGS_CURRENCY]) {
        requestData.currency_id = values?.[SESSION_USER_SETTINGS_CURRENCY]?.value;
    }
    if (values?.[SESSION_USER_SETTINGS_LANGUAGE]) {
        requestData.language_id = values?.[SESSION_USER_SETTINGS_LANGUAGE]?.value;
    }
    if (values?.change_password) {
        requestData.change_password = true;
        requestData.password = values?.password;
        requestData.password_confirmation = values?.password_confirmation;
    }
    console.log("Request data to be sent:", requestData);
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
            TruJobApiMiddleware.getConfig().endpoints.profile
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
          [SESSION_USER_SETTINGS_COUNTRY]:
            user?.[SESSION_USER_SETTINGS]?.[SESSION_USER_SETTINGS_COUNTRY] ||
            "",
          [SESSION_USER_SETTINGS_CURRENCY]:
            user?.[SESSION_USER_SETTINGS]?.[SESSION_USER_SETTINGS_CURRENCY] ||
            "",
          [SESSION_USER_SETTINGS_LANGUAGE]:
            user?.[SESSION_USER_SETTINGS]?.[SESSION_USER_SETTINGS_LANGUAGE] ||
            "",
          change_password: false,
          password: "",
          password_confirmation: "",
        }}
        validation={{
          [SESSION_USER_FIRSTNAME]: [
            { type: VALIDATION_ALPHA_NUMERIC }, 
            { type: VALIDATION_ALLOW_SPACES}
          ],
          [SESSION_USER_LASTNAME]: [
            { type: VALIDATION_ALPHA_NUMERIC }, 
            { type: VALIDATION_ALLOW_SPACES}
          ],
          [SESSION_USER_USERNAME]: [
            { type: VALIDATION_ALPHA_NUMERIC }
          ],
          [SESSION_USER_EMAIL]: [
            { type: VALIDATION_EMAIL }
          ],
          password: [
            { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS },
            { 
                type: VALIDATION_REQUIRED_IF, 
                field: {
                    change_password: true
                }
            },
          ],
          password_confirmation: [
            { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS },
            { 
                type: VALIDATION_REQUIRED_IF, 
                field: {
                    change_password: true
                }
            },
            { type: VALIDATION_MATCH, field: "password" },
          ],
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
                  <label className="title">Select Currency</label>
                  <CurrencySelect
                    value={LocaleService.getValueForCurrencySelect(
                      values?.[SESSION_USER_SETTINGS_CURRENCY]
                    )}
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
                {values?.change_password && (
                  <>
                    <div className="col-12 col-lg-6">
                      <TextInput
                        value={values?.password || ""}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        name="password"
                        type="password"
                        label="Password"
                      />
                      {errors?.password && (
                        <div className="text-danger">
                          {errors?.password || ""}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-lg-6">
                      <TextInput
                        value={values?.password_confirmation || ""}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        name="password_confirmation"
                        type="password"
                        label="Confirm Password"
                      />
                      {errors?.password_confirmation && (
                        <div className="text-danger">
                          {errors?.password_confirmation || ""}
                        </div>
                      )}
                    </div>
                  </>
                )}
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
