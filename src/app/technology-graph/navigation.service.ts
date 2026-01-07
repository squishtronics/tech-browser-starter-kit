import { Injectable } from '@angular/core';
import { TechnologyId } from '../data';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly _target$ = new ReplaySubject<TechnologyId | null>(1);

  get target(): Observable<TechnologyId | null> {
    return this._target$.asObservable();
  }

  navigate(tech: TechnologyId): void {
    this._target$.next(tech);
  }

  clear(): void {
    this._target$.next(null);
  }
}
