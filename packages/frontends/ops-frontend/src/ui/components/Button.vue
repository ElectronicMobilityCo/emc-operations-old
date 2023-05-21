<script setup lang="ts">
defineProps<{
  style?: 'primary' | 'secondary';
  disabled?: boolean;
  fullwidth?: boolean;
}>();
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <button
    @click="handleClick"
    :data-style="style"
    :disabled="disabled"
    :fullwidth="fullwidth"
  >
    <slot />
  </button>
</template>

<style scoped>
button {
  padding: 0.75rem;
  background-color: var(--eo-color-interactive-1-base);
  color: var(--eo-color-background);
  border: 1px solid transparent;
  border-radius: var(--eo-radius-interactive);
  min-width: min(300px, 100%);
  max-width: 100%;
  outline: 0px;
  cursor: pointer;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
}

button:focus-visible {
  outline: 2px solid var(--eo-color-text);
}

button[fullwidth='true'] {
  width: 100%;
}

button:hover {
  background-color: var(--eo-color-interactive-1-elevate);
}

button:active {
  background-color: var(--eo-color-interactive-1-press);
}

button[disabled] {
  transition: opacity var(--eo-transition-interactive-quick);
  pointer-events: none;
  opacity: 0.5;
}
</style>
