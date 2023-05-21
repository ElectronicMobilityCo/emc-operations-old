import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    showSidebar?: boolean;
    requiresRevalidation?: boolean;
    headerDisplayName?: string;
  }
}
