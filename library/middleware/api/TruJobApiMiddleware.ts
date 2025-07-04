import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { setSessionUserAction } from "@/library/redux/actions/session-actions";
import { SessionService } from "@/library/services/session/SessionService";
import truJobApiConfig from "@/config/api/truJobApiConfig";

export class TruJobApiMiddleware extends ApiMiddleware {
  constructor() {
    super();
    this.config = truJobApiConfig;
  }
  static getConfig() {
    return truJobApiConfig;
  }

  async refreshSessionUser() {
    const response = await this.resourceRequest({
      endpoint: UrlHelpers.urlFromArray([truJobApiConfig.endpoints.session.user.show]),
      method: ApiMiddleware.METHOD.GET,
      protectedReq: true,
    });
    console.log("refreshSessionUser response", response);
    const user = response?.data;
    if (!user) {
      throw new Error("Failed to fetch session user data");
    }
    setSessionUserAction(SessionService.extractUserData(user));
  }

  addError(code: string, message: string | null = null, data: any = {}) {
    this.errors.push({
      code,
      message,
      data,
    });
  }

  static getInstance() {
    return new TruJobApiMiddleware();
  }
}
