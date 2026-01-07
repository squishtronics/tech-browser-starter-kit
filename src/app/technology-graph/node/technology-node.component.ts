import { Component, inject, Input } from '@angular/core';
import { TechnologyContainer, TechnologyResult } from '../technology-graph';
import { AsyncPipe } from '@angular/common';
import { FiltersService, FilterType } from '../../filters/filters.service';
import { map } from 'rxjs';
import { TooltipDirective } from '../../tooltip/tooltip.directive';
import { ObjectTooltipComponent } from '../../details/object-tooltip.component';
import { SelectionService } from '../selection.service';
import { GameObject } from '../../data';

@Component({
  standalone: true,
  selector: 'sqt-technology-node',
  templateUrl: './technology-node.component.html',
  styleUrl: './technology-node.component.scss',
  imports: [AsyncPipe, TooltipDirective, ObjectTooltipComponent],
})
export class TechnologyNodeComponent {
  private readonly filters = inject(FiltersService);
  private readonly selection = inject(SelectionService);

  @Input()
  container: TechnologyContainer;

  @Input()
  hasSelection = false;

  @Input()
  isSelected = false;

  @Input()
  isHighlighted = false;

  @Input()
  hasActiveFilter = false;

  visibleResults$ = this.filters.visibleTypes$.pipe(
    map((set) => this.filterResults(set))
  );

  selectedObject$ = this.selection.selected$.pipe(
    map((target) => target?.object)
  );

  selectTechnology(event: MouseEvent): void {
    this.selection.select(this.container.technology.id);
    event.stopPropagation();
  }

  selectObject(object: GameObject): void {
    this.selection.select(this.container.technology.id, object);
  }

  private filterResults(visibleTypes: Set<FilterType>): Set<TechnologyResult> {
    const visibleResults = new Set<TechnologyResult>();
    if (this.container === undefined) {
      return visibleResults;
    }

    for (const result of this.container.results) {
      if (visibleTypes.has(result.object.type)) {
        visibleResults.add(result);
      }
    }
    return visibleResults;
  }
}
