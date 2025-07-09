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
  }

  static getVariantByIndex(index: number): string {
    const variantKeys = Object.keys(ThemeService.VARIANTS);
    if (index < 0 || index >= variantKeys.length) {
      throw new Error("Index out of bounds for theme variants");
    }
    return ThemeService.VARIANTS[variantKeys[index]];
  }
}