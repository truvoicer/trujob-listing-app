import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";

import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import DateInput from "@/components/Elements/DateInput";
import { SESSION_USER_EMAIL, SESSION_USER_FIRSTNAME, SESSION_USER_LASTNAME, SESSION_USER_PROFILE_DOB, SESSION_USER_SETTINGS_COUNTRY, SESSION_USER_SETTINGS_CURRENCY, SESSION_USER_USERNAME } from "@/library/redux/constants/session-constants";
import { LocaleService } from "@/library/services/locale/LocaleService";
import CountrySelect from "../../Locale/Country/CountrySelect";
import CurrencySelect from "../../Locale/Currency/CurrencySelect";

type EditUserFields = {
  operation: "edit" | "update" | "add" | "create";
};
function EditUserFields({ operation }: EditUserFields) {
  const modalService = new ModalService();
  modalService.setUseStateHook(useState);
  modalService.setConfig([
    {
      id: "userReviewModal",
      title: "Manage Reviews",
      footer: true,
      size: "md",
      fullscreen: true,
      component: () => {
        return (
          <AccessControlComponent>
          </AccessControlComponent>
        );
      },
      onOk: () => {
        return true;
      },
    },
    {
      id: "userFollowModal",
      title: "Manage Follows",
      footer: true,
      size: "md",
      fullscreen: true,
      component: () => {
        return (
          <AccessControlComponent>
          </AccessControlComponent>
        );
      },
      onOk: () => {
        return true;
      },
    },
    {
      id: "Media",
      title: "Manage Media",
      footer: true,
      size: "md",
      fullscreen: true,
      component: () => {
        return (
          <AccessControlComponent>
          </AccessControlComponent>
        );
      },
      onOk: () => {
        return true;
      },
    },
  ]);

  const { values, errors, setFieldValue, handleChange } =
    useFormikContext<FormikValues>() || {};

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
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
                  <div className="text-danger">{errors?.password || ""}</div>
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

        <div className="col-12 col-lg-6">
            {modalService.renderLocalTriggerButton(
                "userReviewModal",
                "Manage Reviews",
            )}
        </div>

        <div className="col-12 col-lg-6">
            {modalService.renderLocalTriggerButton(
                "userFollowModal",
                "Manage Follows",
            )}
        </div>

        <div className="col-12 col-lg-6">
            {modalService.renderLocalTriggerButton(
                "Media",
                "Manage Media",
            )}
        </div>

        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default EditUserFields;
