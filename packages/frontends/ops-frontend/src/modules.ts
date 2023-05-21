import { ApplicationModule } from './types/ApplicationModule';

const modules = import.meta.glob('./app/modules/*/module.ts', {
  import: 'default',
  eager: true,
});

export const ops_modules = Object.values(
  modules
) as unknown as ApplicationModule[];
