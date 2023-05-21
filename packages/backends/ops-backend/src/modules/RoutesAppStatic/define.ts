import { defineModule } from '../../bootstrap/define';
import worker from './src/index';

export default defineModule(
  {
    name: 'RoutesAppStatic',
    events: ['RoutesApp', 'Common'],
  },
  [worker]
);
