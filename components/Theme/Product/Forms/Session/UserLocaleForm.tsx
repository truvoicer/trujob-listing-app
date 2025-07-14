import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { FormikProps, FormikValues, useFormikContext } from "formik";

function UserLocaleForm() {
  const userCurrency = LocaleService.getUserCurrency();
  const userCountry = LocaleService.getCountry();

  const { values, errors, setFieldValue }: FormikProps<FormikValues> =
    useFormikContext<FormikValues>();
  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-12 col-sm-12 col-12 align-self-center">
        <div className="row">
          <div className="col-12">
            <h3>To proceed, please select a currency for your account.</h3>

            <p>
              A currency is required so we can accurately display prices,
              process payments, and tailor your experience. You won’t be able to
              continue until a currency is selected.
            </p>
          </div>

          <div className="col-12 col-lg-6">
            <CurrencySelect
              value={
                values?.currency
                  ? {
                      value: values.currency?.value,
                      label: values.currency?.label,
                    }
                  : userCurrency
                  ? {
                      value: userCurrency?.id,
                      label: userCurrency?.name,
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
          </div>

          <div className="col-12 col-lg-6">
            <div className="floating-input">
              <label className="fw-bold" htmlFor="country">
                Country
              </label>
              <CountrySelect
                value={
                  values?.country
                    ? {
                        value: values.country?.id,
                        label: values.country?.name,
                      }
                    : userCountry || null
                }
                isMulti={false}
                showLoadingSpinner={true}
                onChange={(value) => {
                  setFieldValue("country", value);
                }}
                loadingMore={true}
                loadMoreLimit={10}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLocaleForm;
