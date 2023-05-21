<script setup lang="ts">
defineProps<{
  title: string;
  active?: boolean;
}>();
const emit = defineEmits(['click']);
const handleClick = () => {
  emit('click');
};
</script>

<template>
  <button @click="handleClick" class="eo-globalnav--button" :active="active">
    <section class="icon">
      <slot />
    </section>
    <section class="text">
      <p>{{ title }}</p>
    </section>
  </button>
</template>

<style scoped>
button.eo-globalnav--button {
  height: 50px;
  display: grid;
  grid-template-columns: 50px 200px;
  background-color: var(--eo-color-interactive-0-base);
  color: var(--eo-color-text);
  border: 0px solid transparent;
  border-radius: var(--eo-radius-interactive);
  outline: 0px;
  cursor: pointer;
  align-items: center;
  padding: 0px;
  overflow: hidden;
}

button.eo-globalnav--button section.icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button.eo-globalnav--button section {
  flex-shrink: 0;
}


button.eo-globalnav--button section.icon svg {
  width: 1.5rem;
  height: 1.5rem;
}


button.eo-globalnav--button section.text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

button.eo-globalnav--button:focus-visible {
  outline: 2px solid var(--eo-color-text);
  z-index: 100;
}

button.eo-globalnav--button:hover {
  background-color: var(--eo-color-interactive-0-elevate);
}

button.eo-globalnav--button:active,
button.eo-globalnav--button[active="true"] {
  background-color: var(--eo-color-interactive-0-press);
}

button.eo-globalnav--button[disabled] {
  transition: opacity var(--eo-transition-interactive-quick);
  pointer-events: none;
  opacity: 0.5;
}
</style>
