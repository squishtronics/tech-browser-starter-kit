import { Component, inject, Input } from '@angular/core';
import { NavigationService } from '../technology-graph/navigation.service';
import {
  Selection,
  SelectionService,
} from '../technology-graph/selection.service';

@Component({
  standalone: true,
  selector: 'sqt-details',
  templateUrl: 'details.component.html',
  styleUrl: 'details.component.scss',
})
export class DetailsComponent {
  private readonly navigation = inject(NavigationService);
  private readonly selection = inject(SelectionService);

  @Input({ required: true })
  name: string;

  @Input({ required: true })
  type: string;

  @Input()
  blurb: string | null = null;

  @Input()
  selectionCandidate: Selection | null = null;

  select(): void {
    if (this.selectionCandidate !== null) {
      this.selection.select(
        this.selectionCandidate.tech,
        this.selectionCandidate.object
      );
      this.navigation.navigate(this.selectionCandidate.tech);
    }
  }
}
