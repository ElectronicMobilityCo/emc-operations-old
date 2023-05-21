import { defineModule } from '../../bootstrap/define';
import worker from './entry';

export default defineModule(
  {
    name: 'ApiServer',
    events: ['Common', 'ApiServer', 'Auth', 'RoutesApp'],
  },
  [worker]
);
