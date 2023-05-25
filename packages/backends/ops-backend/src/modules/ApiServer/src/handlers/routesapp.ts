import { Logger } from '../../../../bootstrap/logging/logger';
import { DAY_OF_WEEK } from '../../../../services/RoutesApp/CoreTypes';
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

  server.get<{
    Querystring: {
      stop_id: string;
      day_of_week: DAY_OF_WEEK;
      current_date: number;
      current_time: number;
    };
  }>(usePath('static/departures'), {}, async (request, reply) => {
    if (
      !request.query.stop_id ||
      !request.query.day_of_week ||
      !request.query.current_date ||
      !request.query.current_time
    ) {
      reply.statusCode = 417;
      return {};
    } else {
      //console.log('asking...');
      const data = await mb.ask(
        'RoutesApp:GetDepartures',
        'RoutesApp:GetDeparturesResponse',
        {
          stop_id: request.query.stop_id,
          day_of_week: request.query.day_of_week,
          current_date: request.query.current_date,
          current_time: request.query.current_time,
        }
      );
      return {
        departures: data.departures,
      };
    }
  });
};
