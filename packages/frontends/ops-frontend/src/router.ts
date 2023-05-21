import { createRouter, createWebHistory } from 'vue-router';
import { ops_modules } from './modules';
import { useAuthStore } from './app/logic/AuthStore';

const ops_modules_routes = ops_modules.map((module) => module.routes).flat();

export const router = createRouter({
  history: createWebHistory(),
  routes: [...ops_modules_routes],
});

router.beforeEach(async (to) => {
  const AuthStore = useAuthStore();

  await AuthStore.Initialise();

  if (
    !AuthStore.IsAuthenticated() &&
    to.name !== 'builtin:ops-authenticate.validate'
  ) {
    return { name: 'builtin:ops-authenticate.validate' };
  } else {
    return true;
  }
});
router.beforeResolve(async (to) => {
  if (to.meta.requiresRevalidation) {
    console.log('requires revalidation');
  }
});
