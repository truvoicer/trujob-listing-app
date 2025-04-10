import { AppModalContext } from "@/contexts/AppModalContext";
import React, { useContext, useEffect, useState } from "react";
import { Accordion, Button, Card, Modal } from "react-bootstrap";

function Reorder({
    children,
    data = [],
    itemHeader = null,
    itemSchema = {},
    onAdd = null,
    onMoveUp = null,
    onMoveDown = null,
    onDelete = null,
    onChange = null,
}) {
    const [childIndex, setChildIndex] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [modalShowFooter, setModalShowFooter] = useState(true);
    const appModalContext = useContext(AppModalContext);
    const reorderData = data;

    function handleMoveUp(index) {
        if (index > 0) {
            const newData = [...reorderData];
            const temp = newData[index - 1];
            newData[index - 1] = newData[index];
            newData[index] = temp;
            onChange(newData);
        }
    }
    function handleMoveDown(index) {
        if (index < reorderData.length - 1) {
            const newData = [...reorderData];
            const temp = newData[index + 1];
            newData[index + 1] = newData[index];
            newData[index] = temp;
            onChange(newData);
        }
    }
    function handleDelete(index) {
        const newData = [...reorderData];
        newData.splice(index, 1);
        onChange(newData);
    }
    function handleAddNew() {
        const newData = [...reorderData];
        let newItem = {};
        if (typeof onAdd === 'function') {
            newItem = onAdd({
                reorderData,
                onChange,
                itemSchema,
            });
        } else if (typeof itemSchema === 'object') {
            newItem = { ...itemSchema };
        }
        if (typeof newItem !== 'object') {
            return;
        }
        newData.push(newItem);
        onChange(newData);
    }

    function renderItemHeader(item, index) {
        if (typeof itemHeader === 'function') {
            return itemHeader(item, index);
        }
        if (typeof itemHeader === 'string') {
            return <span>{itemHeader}</span>;
        }
        return null;
    }

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(reorderData);
        }
    }, [reorderData]);


    return (
        <div>
            {Array.isArray(reorderData) && reorderData.length
                ? (
                    <>
                        {reorderData.map((block, index) => {
                            return (
                                <Card key={index}>
                                    <Card.Header>
                                        {renderItemHeader(block, index)}
                                        <div className="d-flex gap-3 justify-content-between">
                                            <a
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setModalTitle('Edit');
                                                    setChildIndex(index);
                                                    setModalShow(true);
                                                }}>
                                                Edit
                                            </a>
                                            <a
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleMoveUp(index)
                                                }}>
                                                Move Up
                                            </a>
                                            <a
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleMoveDown(index)
                                                }}>
                                                Move Down
                                            </a>
                                            <a
                                                className="btn btn-sm btn-danger"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDelete(index)
                                                }}>
                                                Delete
                                            </a>
                                        </div>
                                    </Card.Header>
                                </Card>
                            );
                        }
                        )}
                    </>
                )
                : (
                    <div className="alert alert-info">
                        No data available
                    </div>
                )}

            <div className="d-flex justify-content-between mt-3">
                <a
                    className="btn btn-sm btn-primary text-white"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddNew()
                    }}>
                    Add New
                </a>
            </div>
            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle || ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Array.isArray(reorderData) && reorderData.length && (
                        <>
                            {reorderData.map((block, index) => {
                                if (childIndex !== index) {
                                    return null;
                                }
                                return (
                                    <React.Fragment key={index}>
                                        {
                                            children({
                                                block,
                                                index,
                                            })
                                        }
                                    </React.Fragment>
                                );
                            }
                            )}
                        </>
                    )}
                </Modal.Body>
                {modalShowFooter &&
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalShow(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => setModalShow(false)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        </div>
    );
}
export default Reorder;