<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { RouterView } from 'vue-router';
import GlobalNav from './ui/components/GlobalNav/GlobalNav.vue';
import { onMounted } from 'vue';

useDark();

const route = useRoute();

onMounted(() => {
  document.documentElement.classList.add('mounted');
})

</script>

<template>
  <div class="eo-app">
    <aside :data-show="route.meta.showSidebar !== false">
      <GlobalNav v-if="route.meta.showSidebar !== false" />
    </aside>
    <main :data-main="route.meta.showSidebar !== false">
      <RouterView />
    </main>
  </div>
</template>


<style scoped>
.eo-app {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100%;
}

aside {
  position: sticky;
  top: 0px;
  height: 100vh;
  z-index: 1000;
}

aside[data-show="true"] {
  animation: slide-in 640ms cubic-bezier(0.23, 1, 0.32, 1);
}

main[data-main="true"] {
  animation: fade-in 640ms cubic-bezier(0.23, 1, 0.32, 1);
}


@keyframes slide-in {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }

  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>