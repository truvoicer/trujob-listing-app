import { Entity, EntityItem } from "./Entity";

export class EntityFactory {
  static availableEntities: Record<string, EntityItem>;

  static {
    EntityFactory.availableEntities = Entity.getEntities();
  }

  renderEntity(entity: string) {
    if (!EntityFactory.availableEntities.hasOwnProperty(entity)) {
      return null;
    }
    return EntityFactory.availableEntities[entity];
  }

  static getInstance() {
    return new EntityFactory();
  }
}
