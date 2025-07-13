import themeConfig from "@/components/Theme/Config/theme-config";
import {
  PAGE_STATE,
  PAGE_VIEW,
} from "@/library/redux/constants/page-constants";
import store from "@/library/redux/store";
import { FormikValues } from "formik";

export type ComponentItem = {
  name: string;
  component?: React.ReactNode | React.ComponentType<unknown>;
  path?: string;
  formProps?: {
    operation: string;
    initialValues: Record<string, unknown>;
    onSubmit: (values: FormikValues) => Promise<void>;
    validation?: any;
  };
};

export type ThemeConfigItem = {
  view?: string[] | string;
  components: ComponentItem[];
};

export type ThemeConfig = {
  themes: ThemeConfigItem[];
};

export class ThemeService {
  static VARIANTS = {
    PRIMARY: "primary",
    SECONDARY: "secondary",
    SUCCESS: "success",
    DANGER: "danger",
    WARNING: "warning",
    INFO: "info",
    LIGHT: "light",
    DARK: "dark",
  };

  static themeConfig: ThemeConfig;

  static {
    this.setThemeConfig(themeConfig);
  }

  static getThemeConfig(): ThemeConfig {
    return ThemeService.themeConfig;
  }

  static setThemeConfig(themeConfig: ThemeConfig): void {
    ThemeService.themeConfig = themeConfig;
  }

  static getVariantByIndex(index: number): string {
    const variantKeys = Object.keys(ThemeService.VARIANTS);
    if (index < 0 || index >= variantKeys.length) {
      throw new Error("Index out of bounds for theme variants");
    }
    return ThemeService.VARIANTS[variantKeys[index]];
  }

  static findThemeConfigByView(
    view: string | string[]
  ): ThemeConfigItem | null {
    if (!Array.isArray(view)) {
      view = [view];
    }
    return (
      ThemeService.themeConfig.themes.find(
        (theme) =>
          (Array.isArray(theme.view) &&
            theme.view.some((v) => view.includes(v))) ||
          (typeof theme.view === "string" && view.includes(theme.view))
      ) || null
    );
  }

  static getThemeComponentByName(
    view: string | string[],
    name: string
  ): React.ComponentType<unknown> | React.ReactNode | null {
    const themeItem = ThemeService.findThemeConfigByView(view);
    if (!themeItem) {
      console.warn(`No theme found for view: ${view}`);
      return null;
    }
    const componentItem = themeItem.components.find((c) => c.name === name);
    return componentItem
      ? (componentItem.component as React.ComponentType<unknown>)
      : null;
  }

  static findThemeComponentConfig(
    name: string
  ): ComponentItem | null {
    const pageState = store.getState()[PAGE_STATE];
    const view = pageState[PAGE_VIEW];
    if (!view) {
      console.warn(`No view found in page state for component: ${name}`);
      return null;
    }

    const themeItem = ThemeService.findThemeConfigByView(view);
    if (!themeItem) {
      console.warn(`No theme found for view: ${view}`);
      return null;
    }
    const componentItem = themeItem.components.find((c) => c.name === name);
    return componentItem ? componentItem || null : null;
  }
  static findThemeComponent(
    name: string
  ): React.ComponentType<unknown> | React.ReactNode | null {
    const pageState = store.getState()[PAGE_STATE];
    const view = pageState[PAGE_VIEW];
    if (!view) {
      console.warn(`No view found in page state for component: ${name}`);
      return null;
    }
    const themeItem = ThemeService.findThemeConfigByView(view);
    if (!themeItem) {
      console.warn(`No theme found for view: ${view}`);
      return null;
    }
    const componentItem = ThemeService.findThemeComponentConfig(name);
    if (!componentItem) {
      console.warn(`No component found with name: ${name}`);
      return null;
    }
    return componentItem.component as React.ComponentType<unknown>;
  }
}
