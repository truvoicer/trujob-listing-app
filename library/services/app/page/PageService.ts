import { ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { Page } from "@/types/Page";

export class PageService {
  private errors: ErrorItem[] = [];

  getErrors(): ErrorItem[] {
    return this.errors;
  }
  setErrors(errors: ErrorItem[]): PageService {
    this.errors = errors;
    return this;
  }

  addError(
    code: string,
    message: string | null = null,
    data: any = {}
  ): PageService {
    this.errors.push({
      code,
      message,
      data,
    });
    return this;
  }
  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  validatePageData({
    page,
    site,
    settings,
  }: {
    page: Page;
    site: Record<string, unknown>;
    settings: Record<string, unknown>;
  }): boolean {
    if (!site?.settings?.frontend_url) {
      this.addError(
        "missing_frontend_url",
        "Site does not have a frontend URL.",
        {
          page,
          site,
          settings,
        }
      );
    }
    if (!site?.settings?.currency) {
      this.addError("missing_currency", "Site does not have a currency.", {
        page,
        site,
        settings,
      });
    }

    if (!site?.settings?.country) {
      this.addError("missing_country", "Site does not have a country.", {
        page,
        site,
        settings,
      });
    }

    if (!site?.settings?.language) {
      this.addError("missing_language", "Site does not have a language.", {
        page,
        site,
        settings,
      });
    }
    
    return this.hasErrors();
  }
}
