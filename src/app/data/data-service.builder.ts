import { GameObject, Technology, TechnologyId } from './types';
import { DataService } from './data.service';
import { techNotFound } from './errors';

class DataServiceImpl implements DataService {
  constructor(
    private readonly technologiesMap: Map<TechnologyId, Technology>,
    private readonly enabledByTech: Map<TechnologyId, GameObject[]>,
    private readonly obsoletedByTech: Map<TechnologyId, GameObject[]>
  ) {}

  get technologies(): readonly Technology[] {
    return Array.from(this.technologiesMap.values());
  }

  getTechnology(id: TechnologyId): Technology {
    const result = this.technologiesMap.get(id);
    if (result === undefined) {
      throw techNotFound(id);
    }
    return result;
  }

  getEnabledBy(id: TechnologyId): readonly GameObject[] {
    const result = this.enabledByTech.get(id);
    if (result === undefined) {
      throw techNotFound(id);
    }
    return result;
  }

  getObsoletedBy(id: TechnologyId): readonly GameObject[] {
    const result = this.obsoletedByTech.get(id);
    if (result === undefined) {
      throw techNotFound(id);
    }
    return result;
  }
}

export class DataServiceBuilder {
  private readonly technologiesMap = new Map<TechnologyId, Technology>();
  private readonly enabledByTech = new Map<TechnologyId, GameObject[]>();
  private readonly obsoletedByTech = new Map<TechnologyId, GameObject[]>();

  constructor(
    private readonly root: Technology,
    technologies: readonly Technology[]
  ) {
    this.enabledByTech.set(root.id, []);
    this.obsoletedByTech.set(root.id, []);
    this.technologiesMap.set(root.id, root);
    for (const technology of technologies) {
      this.enabledByTech.set(technology.id, []);
      this.obsoletedByTech.set(technology.id, []);
      this.technologiesMap.set(technology.id, technology);
    }
  }

  add<TObject extends GameObject>(
    objects: readonly TObject[],
    enabledByFn: (obj: TObject) => TechnologyId | null,
    obsoletedByFn?: (obj: TObject) => TechnologyId | null
  ): this {
    for (const obj of objects) {
      const id = enabledByFn(obj) ?? this.root.id;
      const list = this.enabledByTech.get(id);
      if (list === undefined) {
        throw techNotFound(id);
      }
      list.push(obj);
    }

    if (obsoletedByFn !== undefined) {
      for (const obj of objects) {
        const techId = obsoletedByFn(obj);
        if (techId === null) {
          continue;
        }
        const list = this.obsoletedByTech.get(techId);
        if (list === undefined) {
          throw techNotFound(techId);
        }
        list.push(obj);
      }
    }
    return this;
  }

  build(): DataService {
    return new DataServiceImpl(
      this.technologiesMap,
      this.enabledByTech,
      this.obsoletedByTech
    );
  }
}
