import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FiltersComponent } from './filters/filters.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DataService } from './data/data.service';
import { provideDataService } from './data/data-service.factory';
import { TechnologyGraph } from './technology-graph/technology-graph';
import { SelectionService } from './technology-graph/selection.service';
import { FiltersService } from './filters/filters.service';
import { NavigationService } from './technology-graph/navigation.service';
import { TooltipService } from './tooltip/tooltip.service';

@Component({
  imports: [RouterModule, OverlayModule, FiltersComponent],
  selector: 'sqt-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
    { provide: DataService, useFactory: provideDataService },
    { provide: TechnologyGraph },
    { provide: SelectionService },
    { provide: FiltersService },
    { provide: NavigationService },
    { provide: TooltipService },
  ],
})
export class App {}
