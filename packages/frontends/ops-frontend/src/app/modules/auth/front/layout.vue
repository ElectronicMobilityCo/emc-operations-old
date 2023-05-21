<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
import EMCLogo from '../../../../ui/components/EMCLogo.vue';
import { onMounted } from 'vue';


const router = useRouter();
const route = useRoute();


onMounted(() => {
  if (route.matched.length !== 2) { router.push("/") }
})
</script>

<template>
  <main class="ops-auth">
    <section>
      <EMCLogo />
    </section>
    <section>
      <RouterView />
    </section>
    <section></section>
    <div class="art">
      <img src="../../../../assets/logos/platform27-class345-art.svg" />
    </div>
  </main>
</template>

<style scoped>
main.ops-auth {
  --padding-v: clamp(50px, 6rem, 5vh);
  --padding-h: clamp(30px, 6rem, 5vw);
  height: 100%;
  width: 100%;
  max-width: calc(calc(var(--padding-h) * 2) + 375px);
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  padding: var(--padding-v) var(--padding-h);
}

main.ops-auth section:nth-child(1) {
  display: flex;
  justify-content: flex-start;
  align-items: start;
  animation: slide-in 640ms cubic-bezier(0.22, 0.61, 0.36, 1);
  transform: translateX(0px) !important;
}

main.ops-auth section:nth-child(2) {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  animation: slide-in 640ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

main.ops-auth section:nth-child(3) {
  display: flex;
  justify-content: flex-start;
  align-items: end;
}

@media screen and (max-width: calc(calc(clamp(30px, 6rem, 5vh) * 2) + 375px)) {
  main.ops-auth {
    grid-template-rows: 100px auto 1fr;
  }

  main.ops-auth section:nth-child(2) {
    align-items: start;
  }

  div.art img {
    display: none;
  }
}

html:not(.dark) div.art {
  opacity: 0.05;
}

div.art img {
  height: min(80vh, 500px);
  object-fit: cover;
  object-position: left;
  animation: slide-in 5s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.art {
  width: calc(100vw - 600px);
  height: 100%;
  position: fixed;
  left: 600px;
  top: 0px;
  display: flex;
  align-items: end;
  z-index: -1;
}

@keyframes slide-in {

  0%,
  50% {
    transform: translateX(20px);
    opacity: 0;
  }

  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
</style>
