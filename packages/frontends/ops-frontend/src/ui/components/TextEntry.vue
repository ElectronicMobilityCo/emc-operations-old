<script setup lang="ts">
import { onMounted, ref } from 'vue';
const props = defineProps<{
  title: string;
  disabled?: boolean;
  label?: string;
  modelValue?: string;
  type: 'text' | 'password';
  autocomplete?: string;
  autofocus?: boolean;
}>();
const emit = defineEmits(['update:modelValue', 'input']);

const input = ref<HTMLInputElement | null>(null);

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
  emit('input', (event.target as HTMLInputElement).value);
};

const focus = () => {
  if (input.value) {
    input.value.focus();
  }
};
defineExpose({ focus });

onMounted(() => {
  if (props.autofocus) focus();
});
</script>

<template>
  <div>
    <label :for="label" v-if="label">{{ label }}</label>
    <input
      ref="input"
      :id="label"
      :value="modelValue"
      @input="updateValue"
      :placeholder="title"
      :type="type"
      :disabled="disabled"
      :autocomplete="autocomplete"
    />
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-flow: column;
}
input {
  border-radius: var(--eo-radius-interactive);
  padding: 0.75rem;
  border: 1px solid transparent;
  min-width: min(300px, 100%);
  max-width: 100%;
  outline: 0px;
  background-color: var(--eo-color-interactive-0-base);
  color: var(--eo-color-text);
}

input:hover {
  background-color: var(--eo-color-interactive-0-elevate);
}

input:active,
input:focus {
  background-color: var(--eo-color-interactive-0-press);
}

input[disabled] {
  transition: opacity var(--eo-transition-interactive-quick);
  pointer-events: none;
  opacity: 0.5;
}
</style>
