import { findInObject } from "@/helpers/utils";
import { ModalItem, ModalState } from "../modal/ModalService";
import { SetStateAction } from "react";

export type ConfigItem = {
  id: string | Array<string>;
  title?: string | null;
  footer?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  fullscreen?: string | true | undefined;
  component?: React.ComponentType<any>;
  onOk?: (
    props: Record<string, unknown>,
    e?: React.MouseEvent | null
  ) => boolean | void;
  onCancel?: (
    props: Record<string, unknown>,
    e?: React.MouseEvent | null
  ) => boolean | void;
  props?: Record<string, unknown>;
};

export interface ConfigItemWithState extends ConfigItem {
  state: unknown;
}
export type LocalItem = {
  id: null | string;
  show: boolean;
  title: string;
  footer?: boolean;
  props?: any;
  onOk?: () => boolean;
  onCancel?: () => boolean;
  size?: "sm" | "md" | "lg" | "xl";
  fullscreen?: string | true | undefined;
};
export type MessageState = {
  items: Array<Record<string, unknown>>;
  show: (data: Record<string, unknown>, id: string) => void;
  close: (id: string) => void;
  hide: (id: string) => void;
  update: (data: Record<string, unknown>, id: string) => void;
};
export class MessageService {
  key: null | string = null;
  state?: any;
  setter?: any;
  config: Array<ConfigItem> = [];
  useStateHook: (prevState: SetStateAction<LocalItem>) => {};

  constructor(state?: any, setter?: any) {
    this.state = state;
    this.setter = setter;
  }

  setSetter(setter: any) {
    this.setter = setter;
    return this;
  }
  setState(state: any) {
    this.state = state;
    return this;
  }

  setKey(key: string) {
    this.key = key;
    return this;
  }
  setConfig(config: Array<ConfigItem>) {
    if (!Array.isArray(config)) {
      console.log("config is not an array");
      return this;
    }
    this.config = config.map((item: ConfigItem) => {
      if (typeof item !== "object") {
        console.log("config item is not an object", {
          item: item,
          config: config,
        });
        return item;
      }
      if (typeof item?.id !== "string" && !Array.isArray(item?.id)) {
        console.log("config item id is not a string", {
          item: item,
          config: config,
        });
        return item;
      }
      const newItem: ConfigItemWithState = {
        ...item,
        state: this.useStateHook<SetStateAction<ConfigItem>>({
          id: null,
          show: false,
          title: item?.title || null,
          footer: item?.footer || true,
          size: item?.size || "md",
          fullscreen: item?.fullscreen || false,
          onOk:
            item?.onOk ||
            (() => {
              return true;
            }),
          onCancel:
            item?.onCancel ||
            (() => {
              return true;
            }),
          props: item?.props || {},
        }),
      };
      return newItem;
    });
    return this;
  }
  getConfig() {
    return this.config;
  }

  updateMessageConfigItem(id: string, data: any) {
    if (typeof data !== "object") {
      console.log("data is not an object", {
        data: data,
        config: this.config,
      });
      return null;
    }
    if (typeof id !== "string") {
      console.log("id is not a string", {
        id: id,
        config: this.config,
      });
      return null;
    }
    const findLocalMessageConfigIndex =
      this.findLocalMessageConfigIndexById(id);
    if (findLocalMessageConfigIndex === -1) {
      console.log("local message config not found", {
        id: id,
        config: this.config,
      });
      return null;
    }

    this.config[findLocalMessageConfigIndex] = {
      ...this.config[findLocalMessageConfigIndex],
      ...data,
    };
  }
  findLocalMessageConfigIndexById(id: string): number {
    if (typeof id !== "string") {
      return -1;
    }
    return this.config.findIndex((item: any) => {
      if (typeof item !== "object") {
        console.log("config item is not an object", {
          item: item,
          config: this.config,
        });
        return false;
      }
      if (typeof item?.id === "string") {
        return item.id === id;
      } else if (Array.isArray(item?.id)) {
        return item.id.includes(id);
      }
      console.log("config item id is not a string or array", {
        item: item,
        config: this.config,
      });
      return false;
    });
  }
  findLocalMessageConfigById(id: string) {
    if (typeof id !== "string") {
      return null;
    }
    return (
      this.config.find((item: any) => {
        if (typeof item !== "object") {
          console.log("config item is not an object", {
            item: item,
            config: this.config,
          });
          return false;
        }
        if (typeof item?.id === "string") {
          return item.id === id;
        } else if (Array.isArray(item?.id)) {
          return item.id.includes(id);
        }
        console.log("config item id is not a string or array", {
          item: item,
          config: this.config,
        });
        return false;
      }) || null
    );
  }
  findLocalMessageStateById(id: string) {
    const findLocalMessageConfig = this.findLocalMessageConfigById(id);
    if (!findLocalMessageConfig) {
      console.log("local message config not found", {
        id: id,
        config: this.config,
      });
      return null;
    }
    if (typeof findLocalMessageConfig?.state !== "object") {
      console.log("local message config state is not an object", {
        id: id,
        config: this.config,
      });
      return null;
    }
    return findLocalMessageConfig.state;
  }
  onLocalModalCancel(item: any, e?: React.MouseEvent | null) {
    if (typeof item?.state !== "object") {
      console.log("Modal state not found");
      return null;
    }
    const [state, setState] = item.state;

    if (
      typeof state?.onCancel === "function" &&
      !state.onCancel(
        {
          state,
          setState,
          configItem: item,
        },
        e
      )
    ) {
      return;
    }

    MessageService.hideModal(setState);
  }
  onLocalModalOk(item: any, e?: React.MouseEvent | null) {
    if (typeof item?.state !== "object") {
      console.log("Modal state not found");
      return null;
    }
    const [state, setState] = item.state;

    if (
      typeof state?.onOk === "function" &&
      !state.onOk(
        {
          state,
          setState,
          configItem: item,
        },
        e
      )
    ) {
      return;
    }

    MessageService.hideModal(setState);
  }
  renderLocalTriggerButton(
    id: string,
    label: string | null = null,
    props: any = {},
    onClick: ((e: React.MouseEvent<HTMLButtonElement>) => void) | null = null
  ) {
    const findLocalMessageConfig = this.findLocalMessageConfigById(id);
    if (!findLocalMessageConfig) {
      console.log("local message config not found", {
        id: id,
        config: this.config,
      });
      return null;
    }
    if (typeof findLocalMessageConfig?.state !== "object") {
      console.log("local message config state is not an object", {
        id: id,
        config: this.config,
      });
      return null;
    }
    const [state, setState] = findLocalMessageConfig.state;
    return (
      <button
        type="button"
        className="btn btn-primary mr-2"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (typeof onClick === "function") {
            onClick(e);
          }
          MessageService.updateLocalItemState(
            {
              id: id,
              props: props || {},
              show: true,
              title: findLocalMessageConfig?.title || "",
              footer: findLocalMessageConfig?.footer || true,
            },
            setState
          );
        }}
      >
        {label || "Open"}
      </button>
    );
  }
  setUseStateHook(useStateHook: any) {
    this.useStateHook = useStateHook;
    return this;
  }
  static hideModal(setter: any) {
    setter((prevState: any) => {
      let newState = { ...prevState };
      newState.show = false;
      return newState;
    });
  }

  triggerLocalItem(id: string, props: any = {}) {
    const findLocalMessageConfig = this.findLocalMessageConfigById(id);
    if (!findLocalMessageConfig) {
      console.log("local message config not found", {
        id: id,
        config: this.config,
      });
      return null;
    }
    if (typeof findLocalMessageConfig?.state !== "object") {
      console.log("local message config state is not an object", {
        id: id,
        config: this.config,
      });
      return null;
    }
    const [state, setState] = findLocalMessageConfig.state;
    MessageService.updateLocalItemState(
      {
        id: id,
        props: props || {},
        show: true,
        title: findLocalMessageConfig?.title || "",
        footer: findLocalMessageConfig?.footer || true,
      },
      setState
    );
  }

  static updateLocalItemState(data: any, setter: any) {
    if (typeof data !== "object") {
      console.log("data is not an object", {
        data: data,
        setter: setter,
      });
      return null;
    }
    setter((prevState: any) => {
      let newState = { ...prevState };
      Object.keys(data).forEach((key: string) => {
        if (prevState.hasOwnProperty(key)) {
          newState[key] = data[key];
        }
      });
      return newState;
    });
  }

  async handleCancel(index: number, calllbackProps?: any) {
    const handleCallback = await this.handleCallback(
      index,
      "onCancel",
      calllbackProps
    );
    if (typeof handleCallback !== "undefined" && handleCallback === false) {
      return;
    }
    this.handleClose(index);
  }
  async handleCallback(
    index: number,
    callbackName: string,
    callbackProps: any = null
  ) {
    let itemState;
    if (this.key) {
      itemState = findInObject(this.key, this.state);
      if (!itemState) {
        console.log("state not found");
        return false;
      }
    } else {
      itemState = this.state;
    }
    if (!Array.isArray(itemState?.items)) {
      return true;
    }
    const findItemByIndex = itemState.items?.[index];
    if (!findItemByIndex) {
      return true;
    }
    const messageItem = itemState.items[index];

    if (typeof messageItem?.[callbackName] === "function") {
      return await messageItem[callbackName](callbackProps);
    }

    return true;
  }
  async handleOk(index: number, calllbackProps?: any) {
    const handleCallback = await this.handleCallback(
      index,
      "onOk",
      calllbackProps
    );
    if (typeof handleCallback !== "undefined" && handleCallback === false) {
      return;
    }
    this.handleClose(index);
  }
  handleClose(index: number) {
    this.setter((itemState: any) => {
      let cloneState = { ...itemState };
      if (this.key) {
        if (Array.isArray(cloneState?.[this.key]?.items)) {
          cloneState[this.key].items.splice(index, 1);
        }
        return cloneState;
      } else {
        if (Array.isArray(cloneState?.items)) {
          cloneState.items.splice(index, 1);
        } else {
          cloneState.items = [];
        }
        return cloneState;
      }
    });
  }
  closeBatch(id: string) {
    const itemState = this.findStateData();
    if (!itemState) {
      console.log("state not found");
      return;
    }
    const findItemIdex = itemState.items.findIndex(
      (item: ModalItem) => item?.id === id
    );
    if (findItemIdex > -1) {
      this.handleClose(findItemIdex);
    }
  }

  buildItemData(data: any, id: null | string = null) {
    return {};
  }
  updateState(data: any, id: null | string = null): void {
    const itemState = this.findStateData();
    if (!itemState) {
      console.log("state not found");
      return;
    }
    let cloneState = { ...itemState };
    if (!Array.isArray(cloneState?.items)) {
      cloneState.items = [];
    }
    let findItemIdex = -1;
    let item = {};
    if (id) {
      findItemIdex = this.findItemIndexById(id);
      if (findItemIdex > -1) {
        item = cloneState.items[findItemIdex];
      }
    }

    item = {
      ...item,
      ...this.buildItemData(data, id),
    };

    if (findItemIdex > -1) {
      cloneState.items[findItemIdex] = item;
    } else {
      cloneState.items.push(item);
    }
    this.setter((prevState: any) => {
      let newState = { ...prevState };
      if (typeof this.key === "string") {
        newState[this.key].items = cloneState.items;
      } else {
        newState.items = cloneState.items;
      }
      return newState;
    });
  }
  findStateData() {
    let findKeyData;
    if (!this.key) {
      findKeyData = this.state;
    } else {
      findKeyData = findInObject(this.key, this.state);
    }
    if (!findKeyData) {
      return null;
    }
    if (typeof findKeyData !== "object") {
      console.log("state is not an object", {
        modalKey: this.key,
        state: this.state,
        findKeyData: findKeyData,
      });
      return null;
    }
    return findKeyData;
  }

  static findMessageItemIndexInDataById(
    id: string,
    modalState: ModalState
  ): number {
    if (typeof id !== "string") {
      return -1;
    }
    if (!modalState) {
      console.log("state not found");
      return -1;
    }
    if (!Array.isArray(modalState?.items)) {
      return -1;
    }
    return modalState.items.findIndex((item: any) => item?.id === id);
  }

  static findMessageItemInDataById(
    id: string,
    modalState: ModalState
  ): ModalItem | undefined {
    if (typeof id !== "string") {
      return undefined;
    }
    if (!modalState) {
      console.log("state not found");
      return undefined;
    }
    if (!Array.isArray(modalState?.items)) {
      return undefined;
    }
    return modalState.items.find((item: any) => item?.id === id);
  }

  findItemIndexById(id: string): number {
    if (typeof id !== "string") {
      return -1;
    }
    const modalState = this.findStateData();
    if (!modalState) {
      console.log("state not found");
      return -1;
    }
    return MessageService.findMessageItemIndexInDataById(id, modalState);
  }

  findItemById(id: string): ModalItem | undefined {
    if (typeof id !== "string") {
      return undefined;
    }
    const modalState = this.findStateData();
    if (!modalState) {
      console.log("state not found");
      return undefined;
    }
    return MessageService.findMessageItemInDataById(id, modalState);
  }

  getState() {
    const findKeyData = this.findStateData();
    if (!findKeyData) {
      return null;
    }
    const data = {
      ...findKeyData,
      items: [],
      update: this.updateState.bind(this),
      show: (data: any, id: null | string = null) => {
        this.updateState(
          {
            ...data,
            show: true,
          },
          id
        );
      },
      close: this.closeBatch.bind(this),
      hide: this.closeBatch.bind(this),
    };
    if (this.key) {
      return {
        [this.key]: data,
      };
    }
    return data;
  }
}
