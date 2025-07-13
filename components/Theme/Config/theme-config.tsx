import { ThemeConfig } from "@/library/services/app/ThemeService";
import AdminUserCurrencyForm from "../Admin/Forms/Session/UserCurrencyForm";
import { COMPONENT_USER_CURRENCY_FORM } from "../Constants/ComponentConstants";
import ProductUserCurrencyForm from "../Product/Forms/Session/UserCurrencyForm";
import {
  PAGE_VIEW_ADMIN_PAGE,
  PAGE_VIEW_ADMIN_TAB_PAGE,
  PAGE_VIEW_PAGE,
} from "@/library/redux/constants/page-constants";
import { LocaleService } from "@/library/services/locale/LocaleService";
import { FormikValues } from "formik";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";

const userCurrencyFormFormProps = {
  operation: "edit",
  initialValues: {
    currency: null,
  },
  onSubmit: async (values: FormikValues) => {
    if (!values.currency || !values.currency.id) {
      throw new Error("Currency is required");
    }
    // Handle form submission logic here
    const response = await LocaleService.handleCurrencyChange(
      values.currency?.id
    );
    if (!response) {
      return false;
    }
    await TruJobApiMiddleware.getInstance().refreshSessionUser();
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
      ],
    },
  ],
};

export default themeConfig;
