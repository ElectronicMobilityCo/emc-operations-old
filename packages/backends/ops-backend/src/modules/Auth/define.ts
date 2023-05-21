import { defineModule } from '../../bootstrap/define';
import worker from './entry';

export default defineModule(
  {
    name: 'Auth',
    events: ['Auth'],
  },
  [worker]
);
