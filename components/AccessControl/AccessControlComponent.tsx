import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_STATE, SESSION_USER, SESSION_USER_ROLES } from "@/library/redux/constants/session-constants";
import { connect } from "react-redux";
import Loader from "../Loader";
import { Role } from "@/types/Role";
import { useEffect, useState } from "react";
import { SessionService } from "@/library/services/session/SessionService";


type Props = {
    id?: string;
    session: any;
    children?: React.Component | React.ReactNode;
    onUnauthorization?: (code: string) => void;
    loader?: React.Component | (() => React.Component) | (() => React.ReactNode) | React.ReactNode | null;
    fallback?: React.Component | (() => React.Component) | (() => React.ReactNode) | React.ReactNode | null;
    roles?: Array<Role | {
        name: string;
    }>;
}
function AccessControlComponent({
    id,
    children,
    session,
    loader,
    fallback,
    onUnauthorization,
    roles = [], 
}: Props) {
    const [show, setShow] = useState<boolean>(false);
    
    function hasRole(roleData: Array<Role>, name: string) {
        return roleData.find(r => r?.name === name) || false;
    }
    function handleUnauthorized(code: string, id?: string) {
        setShow(false);
        if (typeof onUnauthorization === 'function') {
            onUnauthorization(code, id);
            return;
        }
        return;
    }
    function showComponent() {
        if (!Array.isArray(roles)) {
            setShow(true);
            return;
        }

        if (roles.length === 0) {
            setShow(true);
            return;
        }
        const hasSite = hasRole(roles, 'site');

        if (hasSite) {
            setShow(true);
            return;
        }
        const userRoles = session?.[SESSION_USER]?.[SESSION_USER_ROLES];
        if (
            !Array.isArray(userRoles) ||
            userRoles.length === 0
        ) {
            handleUnauthorized(SessionService.AUTHORIZATION.ERROR.CODE.INVALID_USER_ROLES, id);
            return;
        }
        const userRolesHasAdmin = ['admin', 'superuser'].some(role => {
            return hasRole(userRoles, role);
        });
        if (userRolesHasAdmin) {
            setShow(true);
            return;
        }
        for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            if (!role?.name) {
                continue;
            }
            if (hasRole(userRoles, role?.name)) {
                setShow(true);
                return;
            }
        }
        handleUnauthorized(SessionService.AUTHORIZATION.ERROR.CODE.UNAUTHORIZED, id);
        return;
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

    useEffect(() => {
        if (session?.[SESSION_IS_AUTHENTICATING]) {
            return;
        }
        showComponent();
    }, [ session?.[SESSION_IS_AUTHENTICATING]]);
    
    return (
        <>
            {session?.[SESSION_IS_AUTHENTICATING]
                ? (
                    renderLoader()
                )
                : show
                    ? (
                        children
                    ) : (
                        renderFallback()
                    )}
        </>
    )
}

export default connect(
    (state: any) => ({
        session: state[SESSION_STATE]
    })
)(AccessControlComponent);