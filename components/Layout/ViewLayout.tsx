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

type Props = {
    page: any;
}

function ViewLayout({ page }: Props) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(page);


    const [modalState, setModalState] = useState<ModalState>({
        ...ModalService.INIT_DATA
    });

    const [notificationState, setNotificationState] = useState<NotificationState>({
        ...NotificationService.INIT_DATA
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
                {Array.isArray(modalState?.modals) && modalState?.modals.map((modal, index) => {
                    if (!modal?.show) {
                        return null;
                    }
                    return (
                        <Modal key={index} show={modal.show} onHide={() => modalService.handleCancel(index)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{modal?.title || ''}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modal?.component || ''}
                            </Modal.Body>
                            {modal?.showFooter &&
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => modalService.handleCancel(index)}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={() => modalService.handleOk(index)}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            }
                        </Modal>
                    );
                })}
            </AppModalContext.Provider>
        </AppNotificationContext.Provider>
    );
}
export default connect(
    (state: any) => ({
        page: state[PAGE_STATE],
    })
)(ViewLayout);