import { defineModule } from '../../bootstrap/define';

import controller from './Core/entry';
import { ingesters } from './Ingesters/ingesters';

export default defineModule(
  {
    name: 'FCRoutesApp',
    events: ['Common', 'RoutesApp', 'ApiRequests~RoutesApp'],
  },
  [controller, ...ingesters]
);
