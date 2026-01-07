import { Route } from '@angular/router';
import { TechnologyGraphComponent } from './technology-graph/technology-graph.component';

export const appRoutes: Route[] = [
  {
    path: '**',
    component: TechnologyGraphComponent,
  }
];
