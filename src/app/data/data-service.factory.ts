import * as dataJson from './data.json';

import { Data, Technology, TechnologyId } from './types';
import { DataServiceBuilder } from './data-service.builder';
import { DataService } from './data.service';

const data: Data = dataJson as unknown as Data;

const root: Technology = {
  type: 'technology',
  index: 0,
  id: TechnologyId.Root,
  name: 'None',
  prereq1: TechnologyId.Root,
  prereq2: TechnologyId.Root,
  blurb: '',
};

export function provideDataService(): DataService {
  return new DataServiceBuilder(root, data.technologies)
    .add(data.facilities, (o) => o.prereq)
    .add(data.weapons, (o) => o.prereq)
    .add(data.armors, (o) => o.prereq)
    .add(data.abilities, (o) => o.prereq)
    .build();
}
