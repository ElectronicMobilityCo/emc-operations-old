import { useAuthStore } from '../logic/AuthStore';
import { OpsApiRoutes } from './routes';

type ApiRequest = <R extends keyof OpsApiRoutes>(
  route: R,
  reqdata: OpsApiRoutes[R]['req']
) => Promise<OpsApiRoutes[R]['res']>;

export const useApi: ApiRequest = (route, reqdata) => {
  const AuthStore = useAuthStore();
  return new Promise((resolve, reject) => {
    fetch(`/api${route}`, {
      body: JSON.stringify(reqdata),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthStore.UseTicket()}`,
      },
      method: 'POST',
    })
      .then(async (response) => {
        if (response?.ok) {
          const resdata = await response.json();
          resolve(resdata);
        } else {
          reject(response?.status || 0);
        }
      })
      .catch(reject);
  });
};
