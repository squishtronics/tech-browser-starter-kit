import { inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TechnologyContainer, TechnologyGraph } from './technology-graph';
import { GameObject, TechnologyId } from '../data';
import { Router } from '@angular/router';

export interface Selection {
  readonly tech: TechnologyId;
  readonly object?: GameObject;
}

export class SelectionService {
  private readonly _selected$ = new BehaviorSubject<Selection | null>(null);
  private readonly _highlighted$ =
    new BehaviorSubject<Set<TechnologyId> | null>(null);

  private readonly graph = inject(TechnologyGraph);
  private readonly router = inject(Router);

  get selected$(): Observable<Selection | null> {
    return this._selected$.asObservable();
  }

  get highlighted$(): Observable<Set<TechnologyId> | null> {
    return this._highlighted$.asObservable();
  }

  deselect(): void {
    this._selected$.next(null);
    this._highlighted$.next(null);
    this.router.navigate(['']).then();
  }

  select(tech: TechnologyId, object?: GameObject): void {
    if (this.isSelected(tech, object)) {
      return;
    }
    this._selected$.next({ tech: tech, object });
    this._highlighted$.next(
      new Set<TechnologyId>(visitHighlighted(tech, this.graph))
    );

    const commands: string[] = [tech];
    if (object !== undefined) {
      commands.push(object.type);
      commands.push(object.name);
    }
    this.router.navigate(commands).then();
  }

  isSelected(techId: TechnologyId, object: GameObject | undefined): boolean {
    return isSelectionEqual(this._selected$.value, techId, object);
  }
}

function isSelectionEqual(
  selection: Selection | null,
  techId: TechnologyId,
  object: GameObject | undefined
): boolean {
  return (
    selection !== null &&
    selection.tech === techId &&
    selection.object === object
  );
}

function* visitHighlighted(
  id: TechnologyId,
  graph: TechnologyGraph
): IterableIterator<TechnologyId> {
  const container = graph.getTechnology(id);
  yield id;
  yield* visitPrereqs(container, graph);
  yield* visitEnableds(container, graph);
}

function* visitPrereqs(
  container: TechnologyContainer,
  graph: TechnologyGraph
): IterableIterator<TechnologyId> {
  if (container.technology.id === TechnologyId.Root) {
    return;
  }
  const prereq1 = graph.getTechnology(container.technology.prereq1);
  yield prereq1.technology.id;
  yield* visitPrereqs(prereq1, graph);

  if (container.technology.prereq2 !== TechnologyId.Root) {
    const prereq2 = graph.getTechnology(container.technology.prereq2);
    yield prereq2.technology.id;
    yield* visitPrereqs(prereq2, graph);
  }
}

function* visitEnableds(
  container: TechnologyContainer,
  graph: TechnologyGraph
): IterableIterator<TechnologyId> {
  for (const enabledId of graph.getEnabled(container.technology.id)) {
    const enabledContainer = graph.getTechnology(enabledId);
    yield enabledContainer.technology.id;
    yield* visitEnableds(enabledContainer, graph);
  }
}
