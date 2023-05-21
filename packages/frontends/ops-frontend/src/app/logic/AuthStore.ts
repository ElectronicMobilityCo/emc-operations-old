import { defineStore } from 'pinia';
import { useApi } from '../api/utils';
import { ref } from 'vue';

const token_names = {
  ls_refreshtoken: 'EMCOps:Auth:RefreshToken',
};

export const useAuthStore = defineStore('Auth', () => {
  const status = ref<{
    initialised: boolean;
    authenticated: boolean;
    loading: boolean;
  }>({
    initialised: false,
    authenticated: false,
    loading: false,
  });

  const ticket = ref<string | null>(null);
  const refresh = ref<string | null>(null);

  const Initialise = async () => {
    if (!status.value.initialised) {
      const LS_AttemptGetRefresh = localStorage.getItem(
        token_names.ls_refreshtoken
      );

      if (LS_AttemptGetRefresh !== null) {
        refresh.value = LS_AttemptGetRefresh;
        await RequestTicket();
        status.value.authenticated = true;
      }
      document.documentElement.classList.add('initalised-auth');
      status.value.initialised = true;
    }
  };

  const RequestTicket = async () => {
    if (refresh.value == null) return 600;
    ticket.value = null;
    try {
      const ReturnReciept = await useApi('/auth/request_ticket', {
        refresh: refresh.value,
      });
      ticket.value = ReturnReciept.ticket;
      return 200;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const RequestRefresh = async (username: string, password: string) => {
    refresh.value = null;
    try {
      const ReturnReciept = await useApi('/auth/request_refresh', {
        username,
        password,
      });
      refresh.value = ReturnReciept.refresh;
      localStorage.setItem(token_names.ls_refreshtoken, ReturnReciept.refresh);
      return 200;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const RequestSignin = async (username: string, password: string) => {
    status.value.authenticated = false;
    status.value.loading = true;
    try {
      await RequestRefresh(username, password);
      await RequestTicket();
      if (ticket.value !== null) {
        status.value.authenticated = true;
        status.value.loading = false;
        return 200;
      } else throw 600;
    } catch (e) {
      status.value.loading = false;
      return e;
    }
  };

  const UseTicket = () => {
    if (status.value.authenticated && ticket.value !== null) {
      return ticket.value;
    } else return '';
  };

  const IsAuthenticated = () => {
    if (status.value.authenticated && ticket.value !== null) return true;
    else return false;
  };

  return { status, Initialise, RequestSignin, UseTicket, IsAuthenticated };
});
