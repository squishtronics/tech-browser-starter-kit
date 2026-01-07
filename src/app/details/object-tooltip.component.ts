import { Component, Input } from '@angular/core';
import { GameObject, TechnologyId } from '../data';
import { TechnologyLinkComponent } from './technology-link.component';
import { DetailsComponent } from './details.component';
import { Selection } from '../technology-graph/selection.service';

@Component({
  standalone: true,
  selector: 'sqt-object-tooltip',
  templateUrl: './object-tooltip.component.html',
  imports: [TechnologyLinkComponent, DetailsComponent],
  styleUrl: 'object-tooltip.component.scss',
})
export class ObjectTooltipComponent {
  @Input()
  object: GameObject;

  @Input()
  technologyId: TechnologyId;

  get selectionCandidate(): Selection {
    return {
      tech: this.technologyId,
      object: this.object.type === 'technology' ? undefined : this.object,
    };
  }
}
