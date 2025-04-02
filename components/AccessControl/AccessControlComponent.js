import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_STATE, SESSION_USER, SESSION_USER_ROLES } from "@/library/redux/constants/session-constants";
import { connect } from "react-redux";
import Loader from "../Loader";

function AccessControlComponent({
    children,
    session,
    loader,
    fallback,
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

        if (hasSite) {
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

    function renderFallback() {
        if (typeof fallback === 'function') {
            return fallback();
        }
        if (typeof fallback === 'object') {
            return fallback;
        }
        return null;
    }

    function renderLoader() {
        if (typeof loader === 'function') {
            return loader();
        }
        if (typeof loader === 'object') {
            return loader;
        }
        return <Loader fullScreen />;
    }
    
    return (
        <>
            {session?.[SESSION_IS_AUTHENTICATING]
                ? (
                    renderLoader()
                )
                : showComponent()
                    ? (
                        children
                    ) : (
                        renderFallback()
                    )}
        </>
    )
}

export default connect(
    state => ({
        session: state[SESSION_STATE]
    })
)(AccessControlComponent);