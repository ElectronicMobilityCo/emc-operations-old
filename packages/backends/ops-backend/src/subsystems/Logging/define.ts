import { defineSubsystem } from '../../bootstrap/define';
import worker from './entry';

export default defineSubsystem(
  {
    name: 'Logging',
  },
  [worker]
);
