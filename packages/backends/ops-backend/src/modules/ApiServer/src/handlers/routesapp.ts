import { Logger } from '../../../../bootstrap/logging/logger';
import { Handler } from '../handlers';

export const routesapp_api_handler: Handler = (server, mb, config) => {
  const l = new Logger({
    scope: 'ApiServer',
    seg: 'Handler',
    sseg: 'APIRoutesApp',
  });

  const usePath = (path: string) =>
    `${config.Service_RoutesApp.API_SUBPATH}${path}`;

  server.get<{
    Body: { region: string; country: string };
  }>(usePath('hashes/staticdata'), {}, async (request, reply) => {
    const hash = await mb.ask(
      'RoutesApp:GetStaticHydrationHash',
      'RoutesApp:GetStaticHydrationHashResponse',
      { region: request.body.region, country: request.body.country }
    );
    return {
      hash: hash.hash,
    };
  });

  server.get<{
    Params: { region: string; country: string };
  }>(usePath('artifacts/staticdata'), {}, async (request, reply) => {
    const data = await mb.ask(
      'RoutesApp:GetStaticData',
      'RoutesApp:GetStaticDataResponse',
      { region: request.params.region, country: request.params.country }
    );
    return {
      staticdata: data.staticdata,
      hash: data.hash,
    };
  });
};
