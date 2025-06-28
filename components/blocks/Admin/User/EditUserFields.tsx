import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";

import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import DateInput from "@/components/Elements/DateInput";

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
    },
    {
      id: "userFeatureModal",
      title: "Manage Features",
    },
    {
      id: "userFollowModal",
      title: "Manage Follows",
    },
    {
      id: "userCategory",
      title: "Manage Category",
    },
    {
      id: "userBrand",
      title: "Manage Brand",
    },
    {
      id: "userColor",
      title: "Manage Color",
    },
    {
      id: "userProductType",
      title: "Manage Product Type",
    },
    {
      id: "Media",
      title: "Manage Media",
    },
  ]);
  const notificationContext = useContext(AppNotificationContext);
  const dataTableContext = useContext(DataTableContext);

  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>() || {};

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.first_name || ""}
              onChange={handleChange}
              placeholder="Enter First Name"
              name="first_name"
              type="text"
              label="First Name"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.last_name || ""}
              onChange={handleChange}
              placeholder="Enter Last Name"
              name="last_name"
              type="text"
              label="Last Name"
            />
          </div>
          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.username || ""}
              onChange={handleChange}
              placeholder="Enter Username"
              name="username"
              type="text"
              label="Username"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.email || ""}
              onChange={handleChange}
              placeholder="Enter Email"
              name="email"
              type="email"
              label="Email"
            />
          </div>

          <div className="col-12 col-lg-6">
            <DateInput
              value={values?.dob || ""}
              onChange={handleChange}
              placeholder="Enter Date of Birth"
              name="dob"
              type="date"
              label="Date of Birth"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.password || ""}
              onChange={handleChange}
              placeholder="Enter Password"
              name="password"
              type="password"
              label="Password"
            />
          </div>

          <div className="col-12 col-lg-6">
            <TextInput
              value={values?.confirm_password || ""}
              onChange={handleChange}
              placeholder="Confirm Password"
              name="confirm_password"
              type="password"
              label="Confirm Password"
            />
          </div>
          
        </div>

        {modalService.renderLocalModals()}
      </div>
    </div>
  );
}
export default EditUserFields;
