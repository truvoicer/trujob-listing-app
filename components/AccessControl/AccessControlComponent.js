import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_STATE, SESSION_USER, SESSION_USER_ROLES } from "@/library/redux/constants/session-constants";
import { connect } from "react-redux";

function AccessControlComponent({
    children,
    session,
    roles = [],
}) {
    function hasRole(roleData, name) {
        return roleData.find(r => r?.name === name);
    }
    function showComponent() {
        if (roles.length === 0) {
            return true;
        }
        const hasSite = hasRole(roles, 'site');
        
        if (session?.[SESSION_IS_AUTHENTICATING]) {
            return false;
        }
        if (!session[SESSION_AUTHENTICATED] && hasSite) {
            return true;
        }
        const userRoles = session?.[SESSION_USER]?.[SESSION_USER_ROLES];
        if (
            !Array.isArray(userRoles) ||
            userRoles.length === 0
        ) {
            return false;
        }
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            if (!role?.name) {
                continue;
            }
            if (hasRole(userRoles, role?.name)) {
                return true;
            }
        }
        return false;
    }
    
    return showComponent() ? children : null;
}

export default connect(
    state => ({
        session: state[SESSION_STATE]
    })
)(AccessControlComponent);