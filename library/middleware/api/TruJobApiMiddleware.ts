import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import {
    setIsAuthenticatingAction,
} from "@/library/redux/actions/session-actions";
import { isNotEmpty } from "@/helpers/utils";
import { SessionService } from "@/library/services/session/SessionService";

export class TruJobApiMiddleware extends ApiMiddleware {
    
    static async handleTokenResponse(response: any) {
        if (!response) {
            setIsAuthenticatingAction(false)
            return false;
        }
        const token = response?.data?.token?.plainTextToken;
        const tokenExpiry = response?.data?.token?.accessToken?.expires_at_timestamp;
        const user = response?.data?.user;
        return SessionService.handleTokenResponse(token, tokenExpiry, user);
    }


    static getInstance() {
        return new TruJobApiMiddleware();
    }

}
