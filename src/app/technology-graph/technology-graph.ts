import { inject, Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import {
  GameObject,
  getDetails,
  getTechnologyPrereqs,
  Technology,
  TechnologyId,
} from '../data';
import { techNotFound } from '../data/errors';

@Injectable()
export class TechnologyGraph {
  private readonly technologies = new Map<TechnologyId, TechnologyContainer>();
  private readonly links: TechnologyRelation[] = [];
  private readonly enabled = new Map<TechnologyId, TechnologyId[]>();

  constructor() {
    const data = inject(DataService);
    for (const technology of data.technologies) {
      this.enabled.set(technology.id, []);
    }
    for (const technology of data.technologies) {
      const node = {
        technology,
        results: buildTechnologyResults(
          data.getEnabledBy(technology.id),
          data.getObsoletedBy(technology.id)
        ),
      } satisfies TechnologyContainer;
      this.technologies.set(technology.id, node);
    }

    for (const technology of data.technologies) {
      if (technology.id === TechnologyId.Root) {
        continue;
      }
      const prereqs = getTechnologyPrereqs(technology);
      for (const prereq of prereqs) {
        const enabled = this.enabled.get(prereq);
        if (enabled === undefined) {
          throw techNotFound(prereq);
        }
        enabled.push(technology.id);
        this.links.push({
          required: prereq,
          enabled: technology.id,
        });
      }
    }
  }

  getTechnology(id: TechnologyId): TechnologyContainer {
    const result = this.technologies.get(id);
    if (result === undefined) {
      throw techNotFound(id);
    }
    return result;
  }

  getTechnologies(): readonly TechnologyContainer[] {
    return Array.from(this.technologies.values());
  }

  getRelations(): readonly TechnologyRelation[] {
    return this.links;
  }

  getEnabled(id: TechnologyId): readonly TechnologyId[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.enabled.get(id)!;
  }
}

export interface TechnologyContainer {
  readonly technology: Technology;
  readonly results: readonly TechnologyResult[];
}

export type TechnologyResult = EnabledResult | ObsoleteResult;

interface TechnologyResultBase {
  readonly isVisible: boolean;
}

export interface EnabledResult extends TechnologyResultBase {
  readonly type: 'enabled';
  readonly name: string;
  readonly details: string;
  readonly object: GameObject;
}

export interface ObsoleteResult extends TechnologyResultBase {
  readonly type: 'obsolete';
  readonly name: string;
  readonly details: string;
  readonly object: GameObject;
}

export interface TechnologyRelation {
  readonly required: TechnologyId;
  readonly enabled: TechnologyId;
}

function buildTechnologyResults(
  enabled: readonly GameObject[],
  obsoleted: readonly GameObject[]
): TechnologyResult[] {
  const result: TechnologyResult[] = [];
  for (const item of enabled) {
    result.push({
      type: 'enabled',
      name: item.name,
      details: getDetails(item),
      object: item,
      isVisible: true,
    });
  }

  for (const item of obsoleted) {
    result.push({
      type: 'obsolete',
      name: item.name,
      details: getDetails(item),
      object: item,
      isVisible: true,
    });
  }
  return result;
}


