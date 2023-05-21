import { ApplicationModule } from '../../../types/ApplicationModule';

import DashLayout from './layout.vue';
import { PhHouse } from '@phosphor-icons/vue';

const OpsDashboard: ApplicationModule = {
  name: 'Dashboard',
  id: 'ops-dash',
  scope: 'builtin:dash',
  icon: PhHouse,
  routes: [
    {
      path: '/',
      component: DashLayout,
    },
  ],
};

export default OpsDashboard;
