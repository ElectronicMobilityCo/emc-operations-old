<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ApplicationModule } from '../../../types/ApplicationModule';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import GlobalNavButton from './GlobalNavButton.vue';

const props = defineProps<{
  mod: ApplicationModule
}>();
const emit = defineEmits(['click']);

const route = useRoute();
const router = useRouter();

const active = computed(() => props.mod.routes.some((mro) => route.matched.some((rro) => rro.path === `${mro.path}`)));

const handleClick = () => {
  router.push(props.mod.routes[0].path);
  emit('click');
};
</script>

<template>
  <GlobalNavButton @click="handleClick" :title="mod.name" :active="active">
    <component :is="mod.icon" :weight="active ? 'fill' : 'regular'" />
  </GlobalNavButton>
</template>

<style scoped></style>
