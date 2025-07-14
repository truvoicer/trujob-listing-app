import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { FormikProps, FormikValues, useFormikContext } from "formik";

function UserCurrencyForm() {
  const userCurrency = LocaleService.getUserCurrency();
  const { values, errors, setFieldValue }: FormikProps<FormikValues> = useFormikContext<FormikValues>();
  return (
    <>
      <h3>To proceed, please select a currency for your account.</h3>

      <p>
        A currency is required so we can accurately display prices, process
        payments, and tailor your experience. You won’t be able to continue
        until a currency is selected.
      </p>

      <CurrencySelect
        value={
          values?.currency
            ? {
                value: values.currency?.value,
                label: values.currency?.label,
              }
            : userCurrency
            ? {
                value: userCurrency?.value,
                label: userCurrency?.label,
              }
            : null
        }
        isMulti={false}
        showLoadingSpinner={true}
        onChange={(value) => {
          setFieldValue("currency", value);
        }}
        loadingMore={true}
        loadMoreLimit={10}
      />
      {errors?.currency && (
        <span className="text-danger">{errors.currency}</span>
      )}
    </>
  );
}

export default UserCurrencyForm;
