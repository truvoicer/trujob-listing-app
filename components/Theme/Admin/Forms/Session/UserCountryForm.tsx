import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { FormikProps, FormikValues, useFormikContext } from "formik";

function UserCountryForm() {
  const userCountry = LocaleService.getUserCountry();
  const { values, errors, setFieldValue }: FormikProps<FormikValues> = useFormikContext<FormikValues>();
  return (
    <>
      <h3>To proceed, please select a country for your account.</h3>

      <p>
        A country is required so we can accurately display prices, process
        payments, and tailor your experience. You won’t be able to continue
        until a country is selected.
      </p>

      <CountrySelect
        value={
          values?.country
            ? {
                value: values.country?.value,
                label: values.country?.label,
              }
            : userCountry
            ? {
                value: userCountry?.value,
                label: userCountry?.label,
              }
            : null
        }
        isMulti={false}
        showLoadingSpinner={true}
        onChange={(value) => {
          setFieldValue("country", value);
        }}
        loadingMore={true}
        loadMoreLimit={10}
      />
      {errors?.country && (
        <span className="text-danger">{errors.country}</span>
      )}
    </>
  );
}

export default UserCountryForm;
