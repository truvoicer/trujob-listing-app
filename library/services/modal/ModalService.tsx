import { isObject, isObjectEmpty } from "@/helpers/utils";
import {
  LocalItem,
  MessageService,
  MessageState,
} from "../message/MessageService";
import { Button, Modal } from "react-bootstrap";
import Form, { FormProps } from "@/components/form/Form";
import React, { SetStateAction, Dispatch } from "react";
import { FormikProps, FormikValues } from "formik";

export interface LocalModal extends LocalItem {}
export interface ModalState extends MessageState {
  items: Array<ModalItem>;
  show: (data: ModalItem, id?: null | string) => void;
}
export type ModalItem = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Function
    | undefined
    | FormProps
    | any;
  id?: string | null;
  title?: string | null;
  size?: "sm" | "lg" | "xl";
  fullscreen?: string | true | undefined;
  component?: any;
  show?: boolean;
  showFooter?: boolean;
  formProps?: null | FormProps;
  onOkButtonText?: string;
  onCancelButtonText?: string;
  buttons?:
    | React.Component
    | React.Component[]
    | React.ReactNode
    | React.ReactNode[]
    | null;
  onOk?: () => boolean;
  onCancel?: () => boolean;
};
export class ModalService extends MessageService {
  static INIT_DATA: ModalState = {
    items: [],
    show: () => {},
    close: () => {},
    hide: () => {},
    update: () => {},
  };
  static INIT_ITEM_DATA: ModalItem = {
    id: null,
    component: null,
    title: null,
    show: true,
    showFooter: true,
    size: "md",
    fullscreen: undefined,
    formProps: null,
    onOkButtonText: "Ok",
    onCancelButtonText: "Cancel",
    buttons: null,
    onCancel: () => {
      return true;
    },
    onOk: () => {
      return true;
    },
  };
  static initializeModalWithForm({
    requiredFields,
    modalState,
    id,
    operation,
    initialValues,
    handleSubmit,
  }: {
    requiredFields?: Record<string, any>;
    modalState: ModalState;
    id: string;
    operation: string;
    initialValues: any;
    handleSubmit: (values: FormikValues) => Promise<void>;
  }) {
    let modalItem = ModalService.findMessageItemInDataById(id, modalState);

    let modalFormProps: any = {
      formProps: {
        ...modalItem?.formProps,
        operation: operation,
        initialValues: initialValues,
        requiredFields,
      },
    };

    if (typeof modalItem?.formProps?.onSubmit !== "function") {
      modalFormProps.formProps.onSubmit = handleSubmit;
    }

    modalState.update(modalFormProps, id);
  }
  buildItemData(data: any, id: null | string = null) {
    let item: ModalItem = ModalService.INIT_ITEM_DATA;
    Object.keys(ModalService.INIT_ITEM_DATA).forEach((key: string) => {
      if (Object.keys(data).includes(key)) {
        item[key] = data[key];
      }
    });
    item.id = id;
    return item;
  }

  static modalItemHasFormProps(
    modalState: ModalState,
    id?: string | null
  ): boolean {
    if (typeof id !== "string") {
      return false;
    }
    const findIndex = modalState.items.findIndex(
      (item: ModalItem) => item?.id === id
    );
    if (findIndex === -1) {
      return false;
    }
    const modal = modalState.items[findIndex];

    if (
      typeof modal?.formProps === "object" &&
      !isObjectEmpty(modal?.formProps)
    ) {
      return true;
    }
    return false;
  }

  renderFormModal(modal: any, index: number) {
    return (
      <Form {...modal.formProps}>
        {(formHelpers: FormikProps<FormikValues>) => {
          return this.renderModalContent(modal, index, formHelpers);
        }}
      </Form>
    );
  }

  render() {
    const itemState = this.findStateData();
    if (!itemState) {
      console.log("state not found");
      return null;
    }
    return (
      <>
        {Array.isArray(itemState?.items) &&
          itemState?.items.map((modal: ModalItem, index: number) => {
            if (!modal?.show) {
              return null;
            }
            return (
              <React.Fragment key={index}>
                {isObject(modal?.formProps)
                  ? this.renderFormModal(modal, index)
                  : this.renderModalContent(modal, index)}
              </React.Fragment>
            );
          })}
      </>
    );
  }

  renderModalContent(modal: ModalItem, index: number, formHelpers?: any) {
    let component: any = null;
    if (typeof modal?.component === "function") {
      component = modal.component({
        formHelpers,
        index,
        modal,
      });
    } else if (modal?.component) {
      component = modal.component;
    }
    return (
      <>
        {component && (
          <Modal
            show={modal.show}
            size={modal?.size || "lg"}
            fullscreen={modal?.fullscreen || undefined}
            onHide={() => this.handleCancel(index, { formHelpers })}
          >
            <Modal.Header closeButton>
              <Modal.Title>{modal?.title || ""}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{component || ""}</Modal.Body>
            {modal?.showFooter && (
              <Modal.Footer>
                {modal?.buttons ? (
                  <>{modal.buttons}</>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => this.handleCancel(index, { formHelpers })}
                    >
                      {modal?.onCancelButtonText || "Cancel"}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => this.handleOk(index, { formHelpers })}
                    >
                      {modal?.onOkButtonText || "Ok"}
                    </Button>
                  </>
                )}
              </Modal.Footer>
            )}
          </Modal>
        )}
      </>
    );
  }

  renderLocalModals() {
    // console.log('Rendering local modals', );
    return (
      <>
        {this.config.map(
          (configItem: Record<string, unknown>, index: number) => {
            if (typeof configItem?.state !== "object") {
              console.log("Modal state not found");
              return null;
            }
            const [state, setState] = configItem.state;
            let component: React.ReactNode = null;
            if (typeof configItem?.component === "function") {
              component = configItem.component({
                state,
                setState,
                configItem,
              });
            } else if (configItem?.component) {
              component = configItem.component as React.ReactNode;
            } else {
              console.warn("Modal component not found", configItem);
              return null;
            }
            return (
              <>
                {component && (
                  <Modal
                    show={state.show}
                    key={index}
                    size={state?.size || "md"}
                    fullscreen={state?.fullscreen || false}
                    onHide={() => {
                      this.onLocalModalCancel(configItem);
                    }}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{state?.title || ""}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{component}</Modal.Body>
                    {state.footer && (
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={(e: React.MouseEvent) => {
                            this.onLocalModalCancel(configItem, e);
                          }}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={(e: React.MouseEvent) => {
                            this.onLocalModalOk(configItem, e);
                          }}
                        >
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    )}
                  </Modal>
                )}
              </>
            );
          }
        )}
      </>
    );
  }
}
