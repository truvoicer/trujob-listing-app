import { useEffect, useState } from "react";
import { EntityFactory } from "../factories/entity/EntityFactory";
import { EntityItem } from "../factories/entity/Entity";

export type EntityBrowserProps = {
  entityListRequest: () => Promise<{
    data: string[];
  }>;
  onChange?: (entity: string, value: unknown) => void;
};
function EntityBrowser({ entityListRequest, onChange }: EntityBrowserProps) {
  const [entityList, setEntityList] = useState<string[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

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

  function renderEntityComponent(entity: string) {
    const entityConfig: EntityItem | null =
      EntityFactory.getInstance().renderEntity(entity);
    if (!entityConfig) {
      console.warn(`Entity component for ${entity} not found`);
      return null;
    }
    const EntityComponent = entityConfig.component;
    return (
      <EntityComponent
        onChange={(value: unknown) => {
            const checked: Record<string, unknown>[] = value.filter((item: Record<string, unknown>) => item?.checked);
          if (typeof onChange === "function") {
            onChange(entity, checked);
          }
        }}
      />
    );
  }

  useEffect(() => {
    makeEntityListRequest();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="floating-input form-group">
            <select
              id={"entityList"}
              name={"entityList"}
              className="form-control"
              onChange={(e) => {
                if (!e.target.value) {
                  setSelectedEntity(null);
                  return;
                }
                const findEntity = entityList.find(
                  (entity) => entity === e.target.value
                );
                if (!findEntity) {
                  console.warn("Selected entity not found");
                  return;
                }
                setSelectedEntity(findEntity);
              }}
              value={selectedEntity || ""}
            >
              <option value="">Select entity</option>
              {entityList.map((entity, index) => (
                <option key={index} value={entity}>
                  {`${entity}`}
                </option>
              ))}
            </select>
            <label className="form-label bold" htmlFor={"entityList"}>
              Select Entity
            </label>
          </div>

          {typeof selectedEntity === "string" &&
            renderEntityComponent(selectedEntity)}
        </div>
      </div>
    </div>
  );
}
export default EntityBrowser;
