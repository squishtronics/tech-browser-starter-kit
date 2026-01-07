import { GameObject, Technology, TechnologyId } from './types';

export abstract class DataService {
  abstract get technologies(): readonly Technology[];
  abstract getTechnology(id: TechnologyId): Technology;
  abstract getEnabledBy(id: TechnologyId): readonly GameObject[];
  abstract getObsoletedBy(id: TechnologyId): readonly GameObject[];
}