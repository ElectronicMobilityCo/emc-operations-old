<script setup lang="ts">
import { ref } from 'vue';
import { ops_modules } from '../../../modules';
import GlobalNavLink from './GlobalNavLink.vue';
import GlobalNavButton from './GlobalNavButton.vue';
import GlobalNavSeperator from './GlobalNavSeperator.vue';
import EMCLogoIcon from '../EMCLogoIcon.vue';


const state = ref({
  isExpanded: false
})

</script>

<template>
  <div class="eo-globalnavWrapper">
    <aside class="eo-globalnav" :expanded="state.isExpanded">
      <section class="eo-globalnav-section">
        <GlobalNavButton title="Operations Control Plane" @click="() => state.isExpanded = !state.isExpanded">
          <EMCLogoIcon />
        </GlobalNavButton>
        <GlobalNavSeperator />
        <template v-for="mod of ops_modules.filter(m => m.scope == 'builtin:dash')">
          <GlobalNavLink :mod="mod" @click="() => state.isExpanded = false" />
        </template>
        <GlobalNavSeperator />
        <template v-for="mod of ops_modules.filter(m => m.scope == 'module:')">
          <GlobalNavLink :mod="mod" @click="() => state.isExpanded = false" />
        </template>
      </section>
      <section class="eo-globalnav-section">
        <GlobalNavSeperator />
        <template v-for="mod of ops_modules.filter(m => m.scope == 'builtin:ops')">
          <GlobalNavLink :mod="mod" @click="() => state.isExpanded = false" />
        </template>
      </section>
    </aside>
    <div class="eo-globalnav-backdrop" @click="() => state.isExpanded = false"></div>
  </div>
</template>

<style scoped>
div.eo-globalnavWrapper {
  width: 64px;
}

aside {
  position: absolute;
  height: 100vh;
  transition: width var(--eo-transition-interactive);
  display: flex;
  flex-flow: column;
  align-items: center;
  background-color: var(--eo-color-interactive-0-base);
  padding: 7px;
  justify-content: space-between;
  width: 64px;
  z-index: 50;
}

.eo-globalnav-backdrop {
  content: "";
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000;
  opacity: 0;
  z-index: 48;
  pointer-events: none;
  transition: opacity var(--eo-transition-interactive);
}

aside section.eo-globalnav-section {
  width: 100%;
  display: flex;
  flex-flow: column;
}

div.eo-globalnavWrapper aside[expanded="true"] {
  width: 300px;
}

div.eo-globalnavWrapper aside[expanded="true"]+.eo-globalnav-backdrop {
  opacity: 0.1;
  pointer-events: 'auto';
}
</style>