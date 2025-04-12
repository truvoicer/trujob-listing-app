import { connect } from "react-redux";
import SessionLayout from "../Theme/Listing/SessionLayout";
import { PAGE_STATE } from "@/library/redux/constants/page-constants";
import { ViewFactory } from "@/library/view/ViewFactory";
import Loader from "../Loader";
import { AppNotificationContext, appNotificationContextData, notificationContextItem } from "@/contexts/AppNotificationContext";
import { AppModalContext } from "@/contexts/AppModalContext";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { ModalService } from "@/library/services/modal/ModalService";

function ViewLayout({ page }) {
    const viewFactory = new ViewFactory();
    const view = viewFactory.renderView(page);

    function updateModalState(data, id = null) {
        let cloneState = { ...modalState };
        if (!Array.isArray(cloneState?.modals)) {
            cloneState.modals = [];
        }
        let modalItem = {};
        let findModalItemIdex = -1;

        if (id) {
            findModalItemIdex = cloneState.modals.findIndex(item => item?.id === id);
            if (findModalItemIdex > -1) {
                modalItem = cloneState.modals[findModalItemIdex];
            }
        }
        Object.keys(ModalService.INIT_MODAL_ITEM_DATA).forEach((key) => {
            if (Object.keys(data).includes(key)) {
                modalItem[key] = data[key];
            } else {
                modalItem[key] = ModalService.INIT_MODAL_ITEM_DATA[key];
            }
        });
        modalItem.id = id;
        if (findModalItemIdex > -1) {
            cloneState.modals[findModalItemIdex] = modalItem;
        } else {
            cloneState.modals.push(modalItem);
        }

        setModalState(cloneState);
    }

    function handleModalCancel(index) {
        if (typeof modalState?.onCancel === "function") {
            modalState.onCancel();
        }
        handleModalClose(index);
    }
    function handleModalOk(index) {
        if (typeof modalState?.onOk === "function") {
            modalState.onOk();
        }
        handleModalClose(index);
    }
    function handleModalClose(index) {
        setModalState(modalState => {
            let cloneState = { ...modalState };
            if (Array.isArray(cloneState?.modals)) {
                cloneState.modals.splice(index, 1);
            } else {
                cloneState.modals = [];
            }
            return cloneState;
        })
    }
    function closeBatchModal(id) {
        const findModalItemIdex = modalState.modals.findIndex(item => item?.id === id);
        console.log('findModalItemIdex', findModalItemIdex, id, modalState.modals);
        if (findModalItemIdex > -1) {
            handleModalClose(findModalItemIdex);
        }
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
    const [modalState, setModalState] = useState({
        modals: [],
        show: updateModalState,
        close: closeBatchModal,
        hide: closeBatchModal
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
                {Array.isArray(modalState?.modals) && modalState?.modals.map((modal, index) => {
                    if (!modal?.show) {
                        return null;
                    }
                    return (
                        <Modal key={index} show={modal.show} onHide={() => handleModalCancel(index)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{modal?.title || ''}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modal?.component || ''}
                            </Modal.Body>
                            {modal?.showFooter &&
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => handleModalCancel(index)}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={() => handleModalOk(index)}>
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
    state => ({
        page: state[PAGE_STATE],
    })
)(ViewLayout);