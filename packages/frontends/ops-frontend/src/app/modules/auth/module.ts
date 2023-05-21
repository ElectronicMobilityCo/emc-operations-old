import { PhShieldCheck } from '@phosphor-icons/vue';
import { ApplicationModule } from '../../../types/ApplicationModule';

import AuthLayout from './front/layout.vue';
import AuthLogin from './front/views/login.vue';

import DashLayout from './dash/layout.vue';

const OpsAuthenticate: ApplicationModule = {
  name: 'Security',
  id: 'ops-auth',
  scope: 'builtin:ops',
  icon: PhShieldCheck,
  routes: [
    {
      path: '/access',
      component: DashLayout,
      children: [],
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'validate',
          name: 'builtin:ops-authenticate.validate',
          component: AuthLogin,
          meta: {
            showSidebar: false,
          },
        },
      ],
    },
  ],
};

export default OpsAuthenticate;
