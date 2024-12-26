import React, {useContext, useState} from 'react';
import {connect} from "react-redux";
import {GoogleAuthContext} from "@/contexts/GoogleAuthContext";
import {FbAuthContext} from "@/contexts/FacebookAuthContext";
import {SessionContext, sessionContextData} from "@/contexts/SessionContext";
import {SESSION_STATE} from "@/library/redux/constants/session-constants";

function SessionLayout({session, children}) {
    // const gAuthContext = useContext(GoogleAuthContext);
    // const fbContext = useContext(FbAuthContext);

    function logout(sessionUser) {
        // switch (sessionUser?.auth_provider) {
        //     case 'google':
        //         gAuthContext.logout(sessionUser?.auth_provider_user_id);
        //         break;
        //     case 'facebook':
        //         fbContext.logout(sessionUser?.auth_provider_user_id);
        //         break;
        // }
    }

    const [sessionContextState, setSessionContextState] = useState({
        ...sessionContextData,
        logout: logout
    })

    return (
        <SessionContext.Provider value={sessionContextState}>
            {children}
        </SessionContext.Provider>
    );
}

function mapStateToProps(state) {
    return {
        session: state[SESSION_STATE]
    };
}

export default connect(
    mapStateToProps,
    null
)(SessionLayout);
