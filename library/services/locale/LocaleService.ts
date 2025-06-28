import { Option } from "@/components/Select/SelectDropdown";
import {
  SESSION_STATE,
  SESSION_USER,
  SESSION_USER_SETTINGS,
  SESSION_USER_SETTINGS_COUNTRY,
  SESSION_USER_SETTINGS_CURRENCY,
} from "@/library/redux/constants/session-constants";
import {
  SITE_SETTINGS,
  SITE_SETTINGS_COUNTRY,
  SITE_SETTINGS_CURRENCY,
  SITE_STATE,
} from "@/library/redux/constants/site-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { SiteState } from "@/library/redux/reducers/site-reducer";
import store from "@/library/redux/store";
import { Country } from "@/types/Country";
import { Currency } from "@/types/Currency";

export class LocaleService {
  static getCurrency(): Currency | null {
    const sessionState: SessionState = store.getState()[SESSION_STATE];
    const siteState: SiteState = store.getState()[SITE_STATE];
    if (
      sessionState?.[SESSION_USER]?.[SESSION_USER_SETTINGS]?.[
        SESSION_USER_SETTINGS_CURRENCY
      ]
    ) {
      return sessionState[SESSION_USER][SESSION_USER_SETTINGS][
        SESSION_USER_SETTINGS_CURRENCY
      ];
    }
    if (siteState?.[SITE_SETTINGS]?.[SITE_SETTINGS_CURRENCY]) {
      return siteState[SITE_SETTINGS][SITE_SETTINGS_CURRENCY] as Currency;
    }
    return null;
  }
  static getDefaultCountry(): Country | null {
    const sessionState: SessionState = store.getState()[SESSION_STATE];
    const siteState: SiteState = store.getState()[SITE_STATE];
    if (
      sessionState?.[SESSION_USER]?.[SESSION_USER_SETTINGS]?.[
        SESSION_USER_SETTINGS_COUNTRY
      ]
    ) {
      return sessionState[SESSION_USER][SESSION_USER_SETTINGS][
        SESSION_USER_SETTINGS_COUNTRY
      ];
    }
    if (siteState?.[SITE_SETTINGS]?.[SITE_SETTINGS_COUNTRY]) {
      return siteState[SITE_SETTINGS][SITE_SETTINGS_COUNTRY] as Country;
    }
    return null;
  }

  static getValueForCountrySelect(
    value: Country | null,
  ): Option | null {
    const country: Country | null = LocaleService.getDefaultCountry();
    if (value && value?.id && value?.name) {
      return {
        value: value.id,
        label: value.name,
      };
    } else if (country && country?.id && country?.name) {
      return {
        value: country.id,
        label: country.name,
      };
    }
    return null;
  }

  static getValueForCurrencySelect(
    value: Currency | null,
  ): Option | null {
    const currency: Currency | null = LocaleService.getCurrency();
    if (value && value?.id && value?.name) {
      return {
        value: value.id,
        label: value.name,
      };
    } else if (currency && currency?.id && currency?.name) {
      return {
        value: currency.id,
        label: currency.name,
      };
    }
    return null;
  }
}
