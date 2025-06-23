import { useEffect, useState } from "react";
import { EntityFactory } from "../factories/entity/EntityFactory";
import { EntityItem } from "../factories/entity/Entity";
import DynamicAccordion from "../Accordion/DynamicAccordion/DynamicAccordion";
import { DataTableColumn } from "../Table/DataTable";
export type EntityBrowserItem = {
  id: number;
  type: string;
};
export type EntityBrowserProps = {
  entityListRequest: () => Promise<{
    data: string[];
  }>;
  onChange?: (entity: string, value: unknown) => void;
  multiple?: boolean;
  value?: EntityBrowserItem[];
  columnHandler?: (columns: DataTableColumn[]) => DataTableColumn[];
};
function EntityBrowser({
  entityListRequest,
  value = [],
  onChange,
  multiple = false,
  columnHandler = (columns: DataTableColumn[]) => columns,
}: EntityBrowserProps) {
  const [entityList, setEntityList] = useState<string[]>([]);

  async function makeEntityListRequest() {
    if (typeof entityListRequest !== "function") {
      throw new Error("entityListRequest must be a function");
    }
    const response = await entityListRequest();
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid response from entityListRequest");
    }
    setEntityList(response.data);
  }
  function filterValueByType(
    entity: string,
    values: EntityBrowserItem[]
  ): EntityBrowserItem[] {
    return values.filter((item) => item.type === entity);
  }
  function renderEntityComponent(entity: string) {
    const entityConfig: EntityItem | null =
      EntityFactory.getInstance().renderEntity(entity);
    if (!entityConfig) {
      console.warn(`Entity component for ${entity} not found`);
      return null;
    }
    const filterValue = filterValueByType(entity, value);
    const EntityComponent = entityConfig.component;
    
    return (
      <h1>s</h1>
      // <EntityComponent
      //   onChange={(value: unknown) => {
      //     if (!Array.isArray(value)) {
      //       console.warn("Value must be an array");
      //       return;
      //     }
      //     const checked: EntityBrowserItem[] = value.filter(
      //       (item: EntityBrowserItem) => item?.checked
      //     );
      //     if (typeof onChange === "function") {
      //       onChange(entity, checked);
      //     }
      //   }}
      //   rowSelection={true}
      //   multiRowSelection={multiple}
      //   values={filterValue}
      //   columnHandler={columnHandler}
      // />
    );
  }

  function buildItems() {
    return entityList.map((entity, index) => ({
      key: index.toString(),
      header: entity,
      body: renderEntityComponent(entity),
      open: value.some((item) => item.type === entity),
    }));
  }

  useEffect(() => {
    makeEntityListRequest();
  }, []);
  
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <DynamicAccordion items={buildItems()} alwaysOpen={true} />
        </div>
      </div>
    </div>
  );
}
export default EntityBrowser;
