import { Component, inject } from '@angular/core';
import { FiltersService, FilterType, filterTypes } from './filters.service';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'sqt-filters',
  templateUrl: './filters.component.html',
  imports: [AsyncPipe],
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  private readonly filters = inject(FiltersService);
  readonly visibleTypes$ = this.filters.visibleTypes$;

  readonly filterTypeOptions = filterTypes;

  toggle(type: FilterType, show: boolean) {
    if (show) {
      this.filters.show(type);
    } else {
      this.filters.hide(type);
    }
  }

  toggleAll(show: boolean) {
    if (show) {
      this.filters.showAll();
    } else {
      this.filters.hideAll();
    }
  }
}
