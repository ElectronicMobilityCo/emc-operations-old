import { Logger } from '../../../../bootstrap/logging/logger';
import { Handler } from '../handlers';

export const auth_api_handler: Handler = (server, mb) => {
  const l = new Logger({ scope: 'ApiServer', seg: 'Handler', sseg: 'AuthAPI' });

  server.post<{
    Body: { refresh: string };
  }>('/api/auth/request_ticket', {}, async (request, reply) => {
    l.debug('Recieved Auth Ticket Request', request.body);

    if (!request.body.refresh) {
      reply.statusCode = 400;
      return {};
    }

    const auth_ticket = await mb.ask(
      'Auth:VerifyRequestedTicketAccess',
      'Auth:VerifyRequestedTicketAccessResponse',
      { refresh_token: request.body.refresh }
    );

    await new Promise((r) => setTimeout(r, Math.random() * 1024 + 69));

    if (auth_ticket.error === 'none') {
      return {
        ticket: auth_ticket.ticket,
      };
    } else {
      reply.statusCode = 401;
      return {};
    }
  });

  server.post<{
    Body: { username: string; password: string };
  }>('/api/auth/request_refresh', {}, async (request, reply) => {
    l.debug('Recieved Auth Refresh Request', request.body);

    if (!request.body.username || !request.body.password) {
      reply.statusCode = 400;
      return {};
    }

    const auth_refresh = await mb.ask(
      'Auth:VerifyRequestedRefreshAccess',
      'Auth:VerifyRequestedRefreshAccessResponse',
      { username: request.body.username, password: request.body.password }
    );

    await new Promise((r) => setTimeout(r, Math.random() * 1024 + 69));

    if (auth_refresh.error === 'none') {
      return {
        refresh: auth_refresh.refresh_token,
      };
    } else {
      reply.statusCode = 401;
      return {};
    }
  });
};
