import { connect } from "react-redux";
import SessionLayout from "../Theme/Product/SessionLayout";
import { PAGE_STATE } from "@/library/redux/constants/page-constants";
import { ViewFactory } from "@/library/view/ViewFactory";
import Loader from "../Loader";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { AppModalContext } from "@/contexts/AppModalContext";
import { useEffect, useState } from "react";
import { ModalService, ModalState } from "@/library/services/modal/ModalService";
import { NotificationService, NotificationState } from "@/library/services/notification/NotificationService";
import { ConfirmationService, ConfirmationState } from "@/library/services/confirmation/ConfirmationService";
import { AppConfirmationContext } from "@/contexts/AppConfirmationContext";
import { RootState } from "@/library/redux/store";
import { Page } from "@/types/Page";

export type ViewLayoutProps = {
    page: Page;
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

    const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
        ...ConfirmationService.INIT_DATA
    });

    const confirmationService = new ConfirmationService(
        confirmationState,
        setConfirmationState
    );
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
                ...modalService.getState(),
            };
            return newState;
        });
    }, []);

    useEffect(() => {
        setConfirmationState(prevState => {
            let newState = {
                ...prevState,
                ...confirmationService.getState(),
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
                <AppConfirmationContext value={confirmationState}>
                    
                    {view
                        ? (
                            <SessionLayout>
                                {view}
                            </SessionLayout>
                        )
                        : <Loader />
                    }

                    {modalService.render()}
                    {notificationService.render()}
                    {confirmationService.render()}
                </AppConfirmationContext>
            </AppModalContext.Provider>
        </AppNotificationContext.Provider>
    );
}
export default connect(
    (state: RootState) => ({
        page: state[PAGE_STATE],
    })
)(ViewLayout);