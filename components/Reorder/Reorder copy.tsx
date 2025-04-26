import { ModalItem, ModalService, ModalState } from "@/library/services/modal/ModalService";
import { init } from "next/dist/compiled/webpack/webpack";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { FormContextType } from "../form/Form";

export type ReorderProps = {
    children: (props: any) => React.ReactNode;
    data?: Array<any>;
    itemHeader?: string | ((item: any, index: number) => React.ReactNode);
    itemSchema?: any;
    onAdd?: (props: any) => any;
    onEdit?: (props: any) => any;
    onDelete?: (props: any) => any;
    onMove?: (props: any) => any;
    onChange?: (data: Array<any>) => void;
    onOk?: (props: any) => any;
    onCancel?: (props: any) => any;
    enableControls?: boolean;
    enableEdit?: boolean;
    modalState?: ModalState;
}
export type ReorderOnAdd = {
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
}
export type ReorderOnEdit = {
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
    index: number;
    item: any;
}
export type ReorderOnDelete = {
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
    index: number;
    item: any;
}
export type ReorderOnMove = {
    direction: 'up' | 'down';
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
    index: number;
    newIndex: number;
    item: any;
}
export type ReorderOnOk = {
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
    index: number;
    item: any;
    formHelpers?: FormContextType | null;
}
function Reorder({
    modalState,
    children,
    data = [],
    itemHeader,
    itemSchema = {},
    onAdd,
    onEdit,
    onDelete,
    onMove,
    onChange,
    onOk,
    onCancel,
    enableControls = true,
    enableEdit = true,
}: ReorderProps) {
    const reorderData: Array<any> = data;

    function handleChange(data: Array<any>) {
        if (typeof onChange === 'function') {
            onChange(data);
        }
    }

    async function handleMoveUp(index: number, item: any) {
        if (index > 0) {
            const newIndex = index - 1;
            if (typeof onMove === 'function') {
                const response = await onMove({
                    direction: 'up',
                    reorderData,
                    onChange,
                    itemSchema,
                    index,
                    newIndex,
                    item
                });
                if (!response) {
                    return;
                }
            }
            const newData = [...reorderData];
            const temp = newData[newIndex];
            newData[newIndex] = newData[index];
            newData[index] = temp;
            handleChange(newData);
        }
    }
    async function handleMoveDown(index: number, item: any) {
        if (index < reorderData.length - 1) {
            const newIndex = index + 1;

            if (typeof onMove === 'function') {
                const response = await onMove({
                    direction: 'down',
                    reorderData,
                    onChange,
                    itemSchema,
                    index,
                    newIndex,
                    item
                });
                if (!response) {
                    return;
                }
            }
            const newData = [...reorderData];
            const temp = newData[newIndex];
            newData[newIndex] = newData[index];
            newData[index] = temp;
            handleChange(newData);
        }
    }
    async function handleDelete(index: number, item: any) {
        const newData = [...reorderData];

        if (typeof onDelete === 'function') {
            const response = await onDelete({ reorderData, onChange, itemSchema, index, item });
            if (!response) {
                return;
            }
        }
        newData.splice(index, 1);
        handleChange(newData);
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
        handleChange(newData);
    }

    function renderItemHeader(item: any, index: number) {
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


    function getReorderDataItem(index: number) {
        if (Array.isArray(reorderData) && reorderData.length) {
            return reorderData?.[index] || null;
        }
        return null;
    }
    function showModal(index: number, item: any) {
        if (typeof modalState !== 'object') {
            console.error("Modal state is not an object");
            return;
        }
        if (typeof modalState?.show !== 'function') {
            console.error("Modal show function not found");
            return;
        }
        modalState.show({
            title: 'Edit Item',
            showFooter: true,
            component: children({
                item: getReorderDataItem(index),
                index,
            }),
            formProps: {
                initialValues: {},
            },
            onOk: async ({ formHelpers }: {
                formHelpers?: FormContextType | null
            }) => {
                if (typeof onOk === 'function') {
                    const response = await onOk({
                        reorderData,
                        onChange,
                        itemSchema,
                        index,
                        item: getReorderDataItem(index),
                        formHelpers
                    });
                    return response;
                }
                return true
            }
        }, 'reorder-modal');
    }
    return (
        <div>
            {Array.isArray(reorderData) && reorderData.length
                ? (
                    <>
                        {reorderData.map((item, index) => {
                            return (
                                <Card key={index}>
                                    <Card.Header>
                                        {renderItemHeader(item, index)}
                                        {enableControls && (
                                            <div className="d-flex gap-3 justify-content-between">
                                                {enableEdit && (
                                                    <a
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            showModal(index, item)
                                                        }}>
                                                        Edit
                                                    </a>
                                                )}
                                                <a
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleMoveUp(index, item)
                                                    }}>
                                                    Move Up
                                                </a>
                                                <a
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleMoveDown(index, item)
                                                    }}>
                                                    Move Down
                                                </a>
                                                <a
                                                    className="btn btn-sm btn-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDelete(index, item)
                                                    }}>
                                                    Delete
                                                </a>
                                            </div>
                                        )}
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
        </div>
    );
}
export default Reorder;




import { AppModalContext } from "@/contexts/AppModalContext";
import { dir } from "console";
import React, { useContext, useEffect, useState } from "react";
import { Accordion, Button, Card, Modal } from "react-bootstrap";

export type ReorderProps = {
    children: (props: any) => React.ReactNode;
    data?: Array<any>;
    itemHeader?: string | ((item: any, index: number) => React.ReactNode);
    itemSchema?: any;
    onAdd?: (props: any) => any;
    onEdit?: (props: any) => any;
    onDelete?: (props: any) => any;
    onMove?: (props: any) => any;
    onChange?: (data: Array<any>) => void;
    onOk?: (props: any) => any;
    onCancel?: (props: any) => any;
    enableControls?: boolean;
    enableEdit?: boolean;
}
export type ReorderOnAdd = {
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
}
export type ReorderOnEdit = {
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
    index: number;
    item: any;
}
export type ReorderOnDelete = {
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
    index: number;
    item: any;
}
export type ReorderOnMove = {
    direction: 'up' | 'down';
    reorderData: Array<any>;
    onChange: (data: Array<any>) => void;
    itemSchema: any;
    index: number;
    newIndex: number;
    item: any;
}
function Reorder({
    children,
    data = [],
    itemHeader,
    itemSchema = {},
    onAdd,
    onEdit,
    onDelete,
    onMove,
    onChange,
    onOk,
    onCancel,
    enableControls = true,
    enableEdit = true,
}: ReorderProps) {
    const [childIndex, setChildIndex] = useState<number | null>(null);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [modalComponent, setModalComponent] = useState<any | null>(null);
    const [modalShowFooter, setModalShowFooter] = useState<boolean>(true);

    const reorderData: Array<any> = data;

    function handleChange(data: Array<any>) {
        if (typeof onChange === 'function') {
            onChange(data);
        }
    }

    async function handleMoveUp(index: number, item: any) {
        if (index > 0) {
            const newIndex = index - 1;
            if (typeof onMove === 'function') {
                const response = await onMove({
                    direction: 'up',
                    reorderData,
                    onChange,
                    itemSchema,
                    index,
                    newIndex,
                    item
                });
                if (!response) {
                    return;
                }
            }
            const newData = [...reorderData];
            const temp = newData[newIndex];
            newData[newIndex] = newData[index];
            newData[index] = temp;
            handleChange(newData);
        }
    }
    async function handleMoveDown(index: number, item: any) {
        if (index < reorderData.length - 1) {
            const newIndex = index + 1;

            if (typeof onMove === 'function') {
                const response = await onMove({
                    direction: 'down',
                    reorderData,
                    onChange,
                    itemSchema,
                    index,
                    newIndex,
                    item
                });
                if (!response) {
                    return;
                }
            }
            const newData = [...reorderData];
            const temp = newData[newIndex];
            newData[newIndex] = newData[index];
            newData[index] = temp;
            handleChange(newData);
        }
    }
    async function handleDelete(index: number, item: any) {
        const newData = [...reorderData];

        if (typeof onDelete === 'function') {
            const response = await onDelete({ reorderData, onChange, itemSchema, index, item });
            if (!response) {
                return;
            }
        }
        newData.splice(index, 1);
        handleChange(newData);
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
        handleChange(newData);
    }

    function renderItemHeader(item: any, index: number) {
        if (typeof itemHeader === 'function') {
            return itemHeader(item, index);
        }
        if (typeof itemHeader === 'string') {
            return <span>{itemHeader}</span>;
        }
        return null;
    }

    function getReorderDataItem(index: number) {
        if (Array.isArray(reorderData) && reorderData.length) {
            return reorderData?.[index] || null;
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
                        {reorderData.map((item, index) => {
                            return (
                                <Card key={index}>
                                    <Card.Header>
                                        {renderItemHeader(item, index)}
                                        {enableControls && (
                                            <div className="d-flex gap-3 justify-content-between">
                                                {enableEdit && (
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
                                                )}
                                                <a
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleMoveUp(index, item)
                                                    }}>
                                                    Move Up
                                                </a>
                                                <a
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleMoveDown(index, item)
                                                    }}>
                                                    Move Down
                                                </a>
                                                <a
                                                    className="btn btn-sm btn-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDelete(index, item)
                                                    }}>
                                                    Delete
                                                </a>
                                            </div>
                                        )}
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
                             {reorderData.map((item, index) => {
                                 if (childIndex !== index) {
                                     return null;
                                 }
                                 return (
                                     <React.Fragment key={index}>
                                         {
                                             children({
                                                 item,
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
                        <Button variant="secondary"
                            onClick={async () => {
                                if (typeof onCancel === 'function') {
                                    const response = await onCancel({
                                        reorderData,
                                        onChange,
                                        itemSchema,
                                    });
                                    if (!response) {
                                        return;
                                    }
                                }
                                setModalShow(false)
                            }}>
                            Close
                        </Button>
                        <Button variant="primary"
                            onClick={async () => {
                                if (typeof onOk === 'function') {
                                    const response = await onOk({
                                        reorderData,
                                        onChange,
                                        itemSchema,
                                    });
                                    if (!response) {
                                        return;
                                    }
                                }
                                setModalShow(false)
                            }}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        </div>
    );
}
export default Reorder;