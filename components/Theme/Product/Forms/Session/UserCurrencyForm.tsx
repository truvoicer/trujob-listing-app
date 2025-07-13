import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { FormikProps, FormikValues, useFormikContext } from "formik";

function UserCurrencyForm() {
  const userCurrency = LocaleService.getUserCurrency();
  const { values, errors, setFieldValue }: FormikProps<FormikValues> =
    useFormikContext<FormikValues>();
  return (
    <>
      <CurrencySelect
        displayText={(data: Record<string, unknown>) => {
          return `${data?.country?.name} | ${data?.code}`;
        }}
        value={
          values.currency
            ? {
                value: values.currency?.id,
                label: values.currency?.name,
              }
            : userCurrency || null
        }
        isMulti={false}
        showLoadingSpinner={true}
        onChange={(value) => {
          setFieldValue("currency", value);
        }}
        loadingMore={true}
        loadMoreLimit={10}
      />
      {errors.currency && (
        <span className="text-danger">{errors.currency}</span>
      )}
    </>
  );
}

export default UserCurrencyForm;
