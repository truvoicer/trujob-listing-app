import { AppModalContext } from "@/contexts/AppModalContext";
import { on } from "events";
import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";

function AppModal({
    show = false,
    title = '',
    component = null,
    showFooter = false,
    onOk = () => { },
    onCancel = () => { },
    onHide = () => { },
    fullscreen = false,
    size = 'md',
}) {
    const appModalContext = useContext(AppModalContext);
    function handleOk() {
        if (typeof onOk === 'function') {
            onOk({
                
            });
        }
    }
    function handleCancel() {
        if (typeof onCancel === 'function') {
            onCancel();
        }
    }
    function handleHide() {
        if (typeof onHide === 'function') {
            onHide();
        }
    }
    return (
        <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title || ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {component || ''}
            </Modal.Body>
            {showFooter &&
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleOk}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            }
        </Modal>
    );
}