import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

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
    const [reorderData, setReorderData] = useState(data);

    useEffect(() => {
        setReorderData(data);
    }, [data]);

    function handleMoveUp(index) {
        if (index > 0) {
            const newData = [...reorderData];
            const temp = newData[index - 1];
            newData[index - 1] = newData[index];
            newData[index] = temp;
            setReorderData(newData);
        }
    }
    function handleMoveDown(index) {
        if (index < reorderData.length - 1) {
            const newData = [...reorderData];
            const temp = newData[index + 1];
            newData[index + 1] = newData[index];
            newData[index] = temp;
            setReorderData(newData);
        }
    }
    function handleDelete(index) {
        const newData = [...reorderData];
        newData.splice(index, 1);
        setReorderData(newData);
    }
    function handleAddNew() {
        const newData = [...reorderData];
        let newItem = {};
        if (typeof onAdd === 'function') {
            newItem = onAdd({
                reorderData,
                setReorderData,
                itemSchema,
            });
        } else if (typeof itemSchema === 'object') {
            newItem = { ...itemSchema };
        }
        if (typeof newItem !== 'object') {
            return;
        }
        newData.push(newItem);
        setReorderData(newData);
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
                        <Accordion>
                            {reorderData.map((block, index) => {
                                return (
                                    <Accordion.Item eventKey={index.toString()} key={index}>
                                        <Accordion.Header>
                                            {renderItemHeader(block, index)}
                                            <div className="d-flex gap-3 justify-content-between">
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
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {children({
                                                block,
                                                index,
                                            })}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            }
                            )}
                        </Accordion>
                        <div className="d-flex justify-content-between mt-3">
                            <a
                                className="btn btn-sm btn-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddNew()
                                }}>
                                Add New
                            </a>
                        </div>
                    </>
                )
                : (
                    <div className="alert alert-info">
                        No data available
                    </div>
                )}
        </div>
    );
}
export default Reorder;