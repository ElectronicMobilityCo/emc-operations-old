<script setup lang="ts">
import { ref } from 'vue';

import Button from '../../../../../ui/components/Button.vue';
import Icon from '../../../../../ui/components/Icon.vue';
import Spinner from '../../../../../ui/components/Spinner.vue';
import TextEntry from '../../../../../ui/components/TextEntry.vue';
import { useAuthStore } from '../../../../logic/AuthStore';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const auth = useAuthStore();
const endUrl = ref({ path: '/' });
const passwordInput = ref<HTMLInputElement | null>(null);
const credentials = ref({
  username: '',
  password: '',
  incorrect: false,
});

const handle_signin = async () => {
  if (credentials.value.incorrect) return;
  const result = await auth.RequestSignin(
    credentials.value.username,
    credentials.value.password
  );
  if (result == 200) {
    credentials.value.incorrect = false;
    router.push(endUrl.value)
  } else {
    credentials.value.incorrect = true;
    if (passwordInput.value) passwordInput.value.focus();
  }
};

const handle_event = () => {
  credentials.value.incorrect = false;
};

onMounted(() => {
  if (route.redirectedFrom) {
    endUrl.value = route.redirectedFrom;
  }
  if (auth.IsAuthenticated()) router.push(endUrl.value)
})

</script>

<template>
  <main class="ops-login">
    <section>
      <h1>Sign In</h1>
      <p>
        Use your EMC passkey to access Operations Control Plane.
      <details class="ops-login--help">
        <summary><span>What's this?</span></summary>
        <span>
          Operations is the centralised control plane for EMC. Manage cluster
          workloads, runtimes and databases during development and
          throughought the lifetime of EMC applications and services. Monitor
          and update configurations and view diagnostic logs and metrics for
          runtimes and workloads of current services.
        </span>
      </details>
      </p>
    </section>

    <form @submit.prevent="handle_signin">
      <TextEntry type="text" title="Username" v-model="credentials.username" @input="handle_event"
        :disabled="auth.status.loading" autofocus />
      <TextEntry type="password" title="Password" v-model="credentials.password" @input="handle_event"
        :disabled="auth.status.loading" ref="passwordInput" />
      <div :data-incorect="credentials.incorrect">
        <Button @click="handle_signin" fullwidth :disabled="credentials.username == '' ||
          credentials.password == '' ||
          credentials.incorrect ||
          auth.status.loading
          ">
          <span>
            <span>
              {{ auth.status.loading ? 'Authenticating...' : 'Sign In' }}
            </span>
            <span>Try again</span>
          </span>
          <Icon icon="arrow-right" v-if="!auth.status.loading && !credentials.incorrect" />
          <Icon icon="cross" v-if="!auth.status.loading && credentials.incorrect" />
          <Spinner v-if="auth.status.loading" />
        </Button>
      </div>
    </form>
  </main>
</template>

<style scoped>
main.ops-login,
main.ops-login section,
main.ops-login form {
  display: flex;
  flex-flow: column;
  gap: 2rem;
}

main.ops-login section,
main.ops-login form {
  gap: 0.5rem;
}

main.ops-login form div {
  width: 100%;
}

main.ops-login form div[data-incorect='true'] {
  animation: login_shake 0.5s ease-in-out;
}

main.ops-login form div button span span {
  display: none;
}

main.ops-login form div[data-incorect='false'] button span span:nth-child(1) {
  display: initial;
}

main.ops-login form div[data-incorect='true'] button span span:nth-child(2) {
  display: initial;
}

details.ops-login--help,
details.ops-login--help summary {
  padding: 0;
  display: contents;
}

details.ops-login--help summary span {
  text-decoration: underline;
  cursor: pointer;
}

details.ops-login--help>span {
  font-style: italic;
  display: block;
}

@keyframes login_shake {
  0% {
    transform: translateX(0px);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }

  100% {
    transform: translateX(0px);
  }
}
</style>
