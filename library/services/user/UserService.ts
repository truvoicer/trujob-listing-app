import { UrlHelpers } from "@/helpers/UrlHelpers";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { UpdateUserSettingRequest } from "@/types/User";

export class UserService {
    static async updateUserSettings(data: UpdateUserSettingRequest) {
      const response = await TruJobApiMiddleware.getInstance().resourceRequest({
        endpoint: UrlHelpers.urlFromArray([
          TruJobApiMiddleware.getConfig().endpoints.user,
         'setting',
          "update",
        ]),
        method: TruJobApiMiddleware.METHOD.PATCH,
        protectedReq: true,
        data
      });
      if (!response) {
        console.error("Failed to set currency");
        return false;
      }
      TruJobApiMiddleware.getInstance().refreshSessionUser();
      return true;
    }

  static getInstance() {
    return new UserService();
  }
}
