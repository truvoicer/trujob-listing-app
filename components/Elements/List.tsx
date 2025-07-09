import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import TextInput from "./TextInput";

export type ListItem = {
  name: string;
  description?: string;
  value?: string | number | boolean;
  label: string;
  type: "text" | "number" | "email" | "password" | "checkbox";
};
export type ListProps = {
  data: ListItem[];
};

function List({ data }: ListProps) {
  const [listData, setListData] = useState<ListItem[]>(data);

  useEffect(() => {
    setListData(data);
  }, [data]);

  function updateItem(index: number, value: string | number | boolean) {
    const updatedData = [...listData];
    const item = updatedData[index];
    if (item) {
      item.value = value;
    }
    setListData(updatedData);
  }
  function addItem() {
    setListData([
      ...listData,
      {
        name: "",
        label: "",
        type: "text",
        value: "",
        description: "",
      },
    ]);
  }
  return (
    <>
      <div className="row">
        {listData.map((item: ListItem, index: number) => {
          return (
            <div className="col-12 col-lg-6" key={index}>
              {["text", "number", "email", "password"].includes(item.type) && (
                <TextInput
                  value={item.value || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateItem(index, e.target.value);
                  }}
                  placeholder={item?.placeholder || ""}
                  type={item.type}
                  name={item.name}
                  label={item?.label || ""}
                />
              )}
              {item.type === "checkbox" && (
                <Checkbox
                  value={item.value || false}
                  name={item.name}
                  placeholder={item?.placeholder || ""}
                  label={item?.label || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateItem(index, e.target.checked);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="row">
        <div className="col-12">
          <button className="btn btn-primary" onClick={addItem}>
            Add Item
          </button>
        </div>
      </div>
    </>
  );
}

export default List;
