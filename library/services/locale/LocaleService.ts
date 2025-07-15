import { Option } from "@/components/Select/SelectDropdown";
import {
  SESSION_STATE,
  SESSION_USER,
  SESSION_USER_SETTINGS,
  SESSION_USER_SETTINGS_COUNTRY,
  SESSION_USER_SETTINGS_CURRENCY,
  SESSION_USER_SETTINGS_LANGUAGE,
} from "@/library/redux/constants/session-constants";
import {
  SITE_SETTINGS,
  SITE_SETTINGS_COUNTRY,
  SITE_SETTINGS_CURRENCY,
  SITE_SETTINGS_LANGUAGE,
  SITE_STATE,
} from "@/library/redux/constants/site-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { SiteState } from "@/library/redux/reducers/site-reducer";
import store from "@/library/redux/store";
import { Country } from "@/types/Country";
import { Currency } from "@/types/Currency";
import { Language } from "@/types/Language";


export class LocaleService {
  static getUserCurrency(): Currency | null {
    const sessionState: SessionState = store.getState()[SESSION_STATE];
    if (
      sessionState?.[SESSION_USER]?.[SESSION_USER_SETTINGS]?.[
        SESSION_USER_SETTINGS_CURRENCY
      ]
    ) {
      return sessionState[SESSION_USER][SESSION_USER_SETTINGS][
        SESSION_USER_SETTINGS_CURRENCY
      ];
    }
    return null;
  }
  static getUserCountry(): Country | null {
   
    const sessionState: SessionState = store.getState()[SESSION_STATE];
    if (
      sessionState?.[SESSION_USER]?.[SESSION_USER_SETTINGS]?.[
        SESSION_USER_SETTINGS_COUNTRY
      ]
    ) {
      return sessionState[SESSION_USER][SESSION_USER_SETTINGS][
        SESSION_USER_SETTINGS_COUNTRY
      ];
    }
    return null;
    
  }
  static getCurrency(): Currency | null {
    const siteState: SiteState = store.getState()[SITE_STATE];
    const userCurrency = LocaleService.getUserCurrency();
    if (userCurrency) {
      return userCurrency;
    }
    if (siteState?.[SITE_SETTINGS]?.[SITE_SETTINGS_CURRENCY]) {
      return siteState[SITE_SETTINGS][SITE_SETTINGS_CURRENCY] as Currency;
    }
    return null;
  }
  static getCountry(): Country | null {
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
  static getLanguage(): Language | null {
    const sessionState: SessionState = store.getState()[SESSION_STATE];
    const siteState: SiteState = store.getState()[SITE_STATE];
    if (
      sessionState?.[SESSION_USER]?.[SESSION_USER_SETTINGS]?.[
        SESSION_USER_SETTINGS_LANGUAGE
      ]
    ) {
      return sessionState[SESSION_USER][SESSION_USER_SETTINGS][
        SESSION_USER_SETTINGS_LANGUAGE
      ];
    }
    if (siteState?.[SITE_SETTINGS]?.[SITE_SETTINGS_LANGUAGE]) {
      return siteState[SITE_SETTINGS][SITE_SETTINGS_LANGUAGE] as Language;
    }
    return null;
  }

  static getValueForCountrySelect(
    value: Country | null,
  ): Option | null {
    const country: Country | null = LocaleService.getCountry();
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

  static getDefaultLabelForCurrencySelect(
    currency: Currency | null,
  ): string {
    if (currency && currency?.name && currency?.code) {
      return `${currency.name} (${currency.code})`;
    }
    return "";
  }

}

