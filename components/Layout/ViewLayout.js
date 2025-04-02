import { connect } from "react-redux";
import SessionLayout from "../Theme/Listing/SessionLayout";
import { PAGE_STATE } from "@/library/redux/constants/page-constants";
import { ViewFactory } from "@/library/view/ViewFactory";
import Loader from "../Loader";
import AccessControlComponent from "../AccessControl/AccessControlComponent";
import { AppNotificationContext, appNotificationContextData, notificationContextItem } from "@/contexts/AppNotificationContext";
import { AppModalContext, appModalContextData } from "@/contexts/AppModalContext";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { isNotEmpty } from "@/helpers/utils";

function ViewLayout({ page }) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(page);

    function updateModalState(data) {
        setModalState(modalState => {
            let cloneState = { ...modalState };
            Object.keys(data).forEach((key) => {
                cloneState[key] = data[key];
            });
            return cloneState;
        })
    }

    function addNotificationItem(data) {
        let notificationItem = {};
        Object.keys(data).forEach((key) => {
            if (Object.keys(notificationContextItem).includes(key)) {
                notificationItem[key] = data[key];
            }
        });
        setNotificationState(prevState => {
            let cloneState = { ...prevState };
            let cloneNotifications = [...cloneState.notifications];
            notificationItem.id = getNextArrayIndex(cloneNotifications);
            cloneNotifications.push(notificationItem);
            cloneState.notifications = cloneNotifications;
            return cloneState;
        })
    }
    function removeNotificationItemById(id) {
        if (typeof id === "undefined" || id === null) {
            console.warn('Notification ID is required to remove notification item');
            return;
        }
        setNotificationState(prevState => {
            let cloneState = { ...prevState };
            let cloneNotifications = [...cloneState.notifications];
            cloneNotifications = cloneNotifications.filter(notification => notification.id !== id);
            cloneState.notifications = cloneNotifications;
            return cloneState;
        })
    }
    function handleModalCancel() {
        if (typeof modalState?.onCancel === "function") {
            modalState.onCancel();
        }
        updateModalState({ show: false });
    }

    const [modalState, setModalState] = useState({
        ...appModalContextData,
        showModal: updateModalState,
    });

    const [notificationState, setNotificationState] = useState({
        ...appNotificationContextData,
        add: addNotificationItem,
        remove: removeNotificationItemById
    });

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
                <Modal show={modalState.show} onHide={handleModalCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalState?.title || ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalState?.component || ''}
                    </Modal.Body>
                    {modalState?.showFooter &&
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleModalCancel}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleModalCancel}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>
            </AppModalContext.Provider>
        </AppNotificationContext.Provider>
    );
}
export default connect(
    state => ({
        page: state[PAGE_STATE],
    })
)(ViewLayout);