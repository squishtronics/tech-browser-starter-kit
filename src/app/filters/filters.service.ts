import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameObject } from '../data';

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private readonly _visibleTypes$ = new BehaviorSubject<Set<FilterType>>(
    new Set<FilterType>(filterTypes.map((ft) => ft.type))
  );

  get visibleTypes$(): Observable<Set<FilterType>> {
    return this._visibleTypes$.asObservable();
  }

  hide(type: FilterType): void {
    this._visibleTypes$.value.delete(type);
    this._visibleTypes$.next(this._visibleTypes$.value);
  }

  show(type: FilterType): void {
    this._visibleTypes$.value.add(type);
    this._visibleTypes$.next(this._visibleTypes$.value);
  }

  showAll() {
    this._visibleTypes$.next(
      new Set<FilterType>(filterTypes.map((ft) => ft.type))
    );
  }

  hideAll() {
    this._visibleTypes$.next(new Set<FilterType>());
  }
}

export type FilterType = GameObject['type'];

export const filterTypes: { type: FilterType, name: string }[] = [
  { type: 'weapon', name: 'Weapons' },
  { type: 'armor', name: 'Armors' },
  { type: 'ability', name: 'Abilities' },
  { type: 'facility', name: 'Facilities' },
];
