<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
  <header>
    <h1>{{ route.meta.headerDisplayName }}</h1>
  </header>
</template>

<style scoped>
header {
  padding: 1rem;
  display: flex;
  flex-flow: column;
  justify-content: end;
  height: 300px;
}
</style>