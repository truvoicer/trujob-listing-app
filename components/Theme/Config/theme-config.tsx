import { ThemeConfig } from "@/library/services/app/ThemeService";
import AdminUserCurrencyForm from "../Admin/Forms/Session/UserCurrencyForm";
import {
  COMPONENT_USER_COUNTRY_FORM,
  COMPONENT_USER_CURRENCY_FORM,
  COMPONENT_USER_LOCALE_FORM,
} from "../Constants/ComponentConstants";
import ProductUserCurrencyForm from "../Product/Forms/Session/UserCurrencyForm";
import {
  PAGE_VIEW_ADMIN_PAGE,
  PAGE_VIEW_ADMIN_TAB_PAGE,
  PAGE_VIEW_PAGE,
} from "@/library/redux/constants/page-constants";
import { FormikValues } from "formik";
import AdminUserLocaleForm from "../Admin/Forms/Session/UserLocaleForm";
import ProductUserLocaleForm from "../Product/Forms/Session/UserLocaleForm";
import { UserService } from "@/library/services/user/UserService";
import { SessionModalItem } from "@/library/redux/reducers/session-reducer";
import { SESSION_MODAL_ID } from "@/library/redux/constants/session-constants";
import { closeSessionModalAction } from "@/library/redux/actions/session-actions";
import { LocaleService } from "@/library/services/locale/LocaleService";
import AdminUserCountryForm from "../Admin/Forms/Session/UserCountryForm";
import ProductUserCountryForm from "../Product/Forms/Session/UserCountryForm";

const userCurrency = LocaleService.getUserCurrency();
const userCountry = LocaleService.getUserCountry();
console.log("userCurrency", userCurrency);
console.log("userCountry", userCountry);
const userCountryFormFormProps = {
  operation: "edit",
  initialValues: {
    country: userCountry
      ? {
          value: userCountry?.id,
          label: userCountry?.name,
        }
      : null,
  },
  onSubmit: async (values: FormikValues, modal: SessionModalItem) => {
    if (!values.country || !values.country.value) {
      throw new Error("Country is required");
    }
    // Handle form submission logic here
    const response = await UserService.updateUserSettings({
      country_id: values.country?.value,
    });
    if (!response) {
      return false;
    }
    if (modal?.[SESSION_MODAL_ID]) {
      closeSessionModalAction(modal[SESSION_MODAL_ID]);
    }
    return true;
  },
};

const userCurrencyFormFormProps = {
  operation: "edit",
  initialValues: {
    currency: userCurrency
      ? {
          value: userCurrency?.id,
          label: userCurrency?.name,
        }
      : null,
  },
  onSubmit: async (values: FormikValues, modal: SessionModalItem) => {
    if (!values.currency || !values.currency.value) {
      throw new Error("Currency is required");
    }
    // Handle form submission logic here
    const response = await UserService.updateUserSettings({
      currency_id: values.currency?.value,
    });
    if (!response) {
      return false;
    }
    if (modal?.[SESSION_MODAL_ID]) {
      closeSessionModalAction(modal[SESSION_MODAL_ID]);
    }
    return true;
  },
};
const userLocaleFormFormProps = {
  operation: "edit",
  initialValues: {
    currency: userCurrency
      ? {
          value: userCurrency?.id,
          label: userCurrency?.name,
        }
      : null,
    country: userCountry
      ? {
          value: userCountry?.id,
          label: userCountry?.name,
        }
      : null,
  },
  onSubmit: async (values: FormikValues, modal: SessionModalItem) => {
    if (!values.currency || !values.currency.value) {
      throw new Error("Currency is required");
    }
    if (!values.country || !values.country.value) {
      throw new Error("Country is required");
    }
    // Handle form submission logic here
    const response = await UserService.updateUserSettings({
      currency_id: values.currency?.value,
      country_id: values.country?.value,
    });
    if (!response) {
      return false;
    }
    if (modal?.[SESSION_MODAL_ID]) {
      closeSessionModalAction(modal[SESSION_MODAL_ID]);
    }
    return true;
  },
};
const themeConfig: ThemeConfig = {
  themes: [
    {
      view: [PAGE_VIEW_ADMIN_PAGE, PAGE_VIEW_ADMIN_TAB_PAGE],
      components: [
        {
          name: COMPONENT_USER_CURRENCY_FORM,
          component: AdminUserCurrencyForm,
          formProps: userCurrencyFormFormProps,
        },
        {
          name: COMPONENT_USER_COUNTRY_FORM,
          component: AdminUserCountryForm,
          formProps: userCountryFormFormProps,
        },
        {
          name: COMPONENT_USER_LOCALE_FORM,
          component: AdminUserLocaleForm,
          formProps: userLocaleFormFormProps,
        },
      ],
    },
    {
      view: [PAGE_VIEW_PAGE],
      components: [
        {
          name: COMPONENT_USER_CURRENCY_FORM,
          component: ProductUserCurrencyForm,
          formProps: userCurrencyFormFormProps,
        },
        {
          name: COMPONENT_USER_COUNTRY_FORM,
          component: ProductUserCountryForm,
          formProps: userCountryFormFormProps,
        },
        {
          name: COMPONENT_USER_LOCALE_FORM,
          component: ProductUserLocaleForm,
          formProps: userLocaleFormFormProps,
        },
      ],
    },
  ],
};

export default themeConfig;
