import TextInput from "@/components/Elements/TextInput";
import { useEffect, useState } from "react";

export type RequiredFields = {
  name: string;
  description?: string;
  value?: string | number | boolean;
  label: string;
  type: 'string' | 'number' | 'boolean';
};
export type RequiredFieldsProps = {
  data: RequiredFields[];
  onChange?: (data: RequiredFields[]) => void;
};

function RequiredFields({
  data = [],
  onChange,
}: RequiredFieldsProps) {
  const [listData, setListData] = useState<RequiredFields[]>(data);

  useEffect(() => {
    setListData(data);
  }, [data]);

  useEffect(() => {
    if (onChange) {
      onChange(listData);
    }
  }, [listData]);

  function updateItem(
    index: number,
    key: string,
    value: string | number | boolean
  ) {
    const updatedData = [...listData];
    updatedData[index][key] = value;
    setListData(updatedData);
  }
  function addItem() {
    setListData([
      ...listData,
      {
        name: "",
        label: "",
        type: "string",
        description: "",
      },
    ]);
  }
  return (
    <>
      <div className="row align-items-center">
        {listData.map((item: RequiredFields, index: number) => {
          return (
            <>
              <div className="col-12 col-md-3">
                <select
                  className="form-select"
                  value={item?.type || "text"}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    updateItem(index, "type", e.target.value);
                  }}
                  name={"type"}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <TextInput
                  value={item?.label || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateItem(index, "label", e.target.value);
                  }}
                  placeholder={"Enter field label"}
                  name={"label"}
                  label={"Field Label"}
                />
              </div>
              <div className="col-12 col-md-3" key={index}>
                <TextInput
                  value={item?.name || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateItem(index, "name", e.target.value);
                  }}
                  placeholder={"Enter field name"}
                  name={"name"}
                  label={"Field Name"}
                />
              </div>
              <div className="col-12 col-md-3">
                <TextInput
                  value={item?.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateItem(index, "description", e.target.value);
                  }}
                  placeholder={"Enter field description"}
                  name={"description"}
                  label={"Field Description"}
                />
              </div>
            </>
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

export default RequiredFields;
