import {
  Component,
  HostListener,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Technology, TechnologyId } from '../data';
import { DataService } from '../data/data.service';
import { NavigationService } from '../technology-graph/navigation.service';
import { SelectionService } from '../technology-graph/selection.service';

@Component({
  standalone: true,
  selector: 'sqt-technology-link',
  templateUrl: 'technology-link.component.html',
  styleUrl: 'technology-link.component.scss',
})
export class TechnologyLinkComponent implements OnChanges {
  private readonly data = inject(DataService);
  private readonly selection = inject(SelectionService);
  private readonly navigation = inject(NavigationService);

  @Input({ required: true })
  id: TechnologyId;

  technology: Technology;

  ngOnChanges(changes: SimpleChanges): void {
    this.technology = this.data.getTechnology(this.id);
  }

  @HostListener('mousedown')
  onMousedown(): void {
    this.selection.select(this.id);
    this.navigation.navigate(this.id);
  }
}
