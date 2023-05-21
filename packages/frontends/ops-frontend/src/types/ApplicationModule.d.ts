import { RouteRecordRaw } from 'vue-router';

declare type ApplicationModule = {
  name: string;
  id: string;
  icon: unknown;
  scope: 'builtin:ops' | 'builtin:dash' | 'module:';

  routes: readonly RouteRecordRaw[];
};
