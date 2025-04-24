import { connect } from "react-redux";
import SessionLayout from "../Theme/Listing/SessionLayout";
import { PAGE_STATE } from "@/library/redux/constants/page-constants";
import { ViewFactory } from "@/library/view/ViewFactory";
import Loader from "../Loader";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { AppModalContext } from "@/contexts/AppModalContext";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ModalService, ModalState } from "@/library/services/modal/ModalService";
import { NotificationService, NotificationState } from "@/library/services/notification/NotificationService";

export type ViewLayoutProps = {
    page: any;
}

function ViewLayout({ page }: ViewLayoutProps) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(page);


    const [notificationState, setNotificationState] = useState<NotificationState>({
        ...NotificationService.INIT_DATA
    });

    const [modalState, setModalState] = useState<ModalState>({
        ...ModalService.INIT_DATA
    });

    const modalService = new ModalService(
        modalState,
        setModalState
    );


    const notificationService = new NotificationService(
        notificationState,
        setNotificationState
    );

    useEffect(() => {
        setModalState(prevState => {
            let newState = {
                ...prevState,
                ...modalService.getState()
            };
            return newState;
        });
    }, []);

    useEffect(() => {
        setNotificationState(prevState => {
            let newState = {
                ...prevState,
                ...notificationService.getState()
            };
            return newState;
        });
    }, []);
    return (

        <AppNotificationContext.Provider value={notificationState}>
            <AppModalContext.Provider value={modalState}>
                {view
                    ? (
                        <SessionLayout>
                            {view}
                        </SessionLayout>
                    )
                    : <Loader fullScreen />
                }

                {modalService.render()}
                {notificationService.render()}
            </AppModalContext.Provider>
        </AppNotificationContext.Provider>
    );
}
export default connect(
    (state: any) => ({
        page: state[PAGE_STATE],
    })
)(ViewLayout);