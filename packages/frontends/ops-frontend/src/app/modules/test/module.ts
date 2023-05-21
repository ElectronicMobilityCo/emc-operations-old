import { ApplicationModule } from '../../../types/ApplicationModule';

import Testlayout from './layout.vue';
import { PhPenNib } from '@phosphor-icons/vue';

const OpsModule: ApplicationModule = {
  name: 'UI Tests',
  id: 'mod-test',
  scope: 'module:',
  icon: PhPenNib,
  routes: [
    {
      path: '/m/test',
      component: Testlayout,
      meta: {
        headerDisplayName: 'UI Tests',
      },
      children: [
        {
          path: 'test2',
          name: 'module:test.test2',
          component: Testlayout,
        },
      ],
    },
  ],
};

export default OpsModule;
