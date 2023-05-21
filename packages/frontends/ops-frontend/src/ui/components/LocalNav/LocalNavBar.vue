<script setup lang="ts">
import LocalNavHeader from './LocalNavHeader.vue';

defineProps<{
  showHeader?: boolean;
}>();
</script>


<template>
  <nav>
    <p>B</p>
  </nav>
  <div class="slot-div" v-if="showHeader">
    <LocalNavHeader />
  </div>
  <hr class="content-div d1" />
  <hr class="content-div d2" />
</template>

<style scoped>
nav {
  background-color: var(--eo-color-background);
  display: grid;
  position: sticky;
  top: 0px;
  height: 67px;
  overflow: hidden;
  z-index: 501;
}

.slot-div {
  position: relative;
  z-index: 500;
  background-color: var(--eo-color-background);
}

hr.content-div {
  width: calc(calc(100vw - 64px) - 14px);
  margin: 0px 7px;
  height: 1px;
  border: transparent;
  position: sticky;
}

hr.content-div.d1 {
  background-color: var(--eo-color-background);
  top: 66px;
  z-index: 499;
}

hr.content-div.d2 {
  top: 67px;
  background-color: var(--eo-color-interactive-0-press);
  z-index: 498;
  box-shadow: 0px 0px 25px 25px var(--eo-color-background);
}
</style>