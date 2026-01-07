import { TechnologyId } from './types';

export function techNotFound(id: TechnologyId): Error {
  return new Error(`Tech not found: ${id}`);
}
