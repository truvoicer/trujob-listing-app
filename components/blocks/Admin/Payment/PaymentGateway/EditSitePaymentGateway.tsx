import { FormikValues, useFormikContext } from "formik";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import { PaymentGateway } from "@/types/PaymentGateway";
import SelectPaymentGatewayEnvironment from "./SelectPaymentGatewayEnvironment";

type EditSitePaymentGateway = {
  paymentGateway?: PaymentGateway;
};
function EditSitePaymentGateway({ paymentGateway }: EditSitePaymentGateway) {
  const { values, handleChange } = useFormikContext<FormikValues>() || {};
  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12 col-lg-6">
            <SelectPaymentGatewayEnvironment
              name="environment"
              value={paymentGateway?.site?.environment || "sandbox"} />
          </div>
          <div className="col-12 col-lg-6">
            <Checkbox
              name={"is_active"}
              label={"Is Active?"}
              placeholder={"Is Active?"}
              value={values?.is_active || false}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-lg-6">
            <Checkbox
              name={"is_default"}
              label={"Is Default?"}
              placeholder={"Is Default?"}
              value={values?.is_default || false}
              onChange={handleChange}
            />
          </div>
          {Array.isArray(paymentGateway?.required_fields) &&
            paymentGateway?.required_fields.map((field, index) => {
              return (
                <div key={index} className="col-12 col-lg-6">
                  {field.type === "boolean" && (
                    <Checkbox
                      name={field.name}
                      label={field.label}
                      placeholder={`${field.label}`}
                      value={values?.[field.name] || false}
                      onChange={handleChange}
                    />
                  )}
                  {field.type === "string" && (
                    <TextInput
                      value={values?.[field.name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter ${field.name}`}
                      type="text"
                      name={field.name}
                      label={field.label}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
export default EditSitePaymentGateway;
