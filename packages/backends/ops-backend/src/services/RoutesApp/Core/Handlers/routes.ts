import { OpsEvents } from '../../../../bootstrap/bus/buses/eventbus';
import { Logger } from '../../../../bootstrap/logging/logger';
import { useDatabases } from '../DB/db';

export const setup_handle_routes_ingest = (
  mb: OpsEvents,
  db: Awaited<ReturnType<typeof useDatabases>>
) => {
  const l = new Logger({ scope: 'RoutesApp', seg: 'Handlers:Routes' });
  mb.on('RoutesApp:GotNewRoutesData', async (data) => {
    try {
      //console.log('GotNewStopData', data);
      await db.Line.destroy({
        where: {
          line_prefix: data.prefix,
        },
      });
      await db.Route.destroy({
        where: {
          route_prefix: data.prefix,
        },
      });

      const lines_insert = [];
      const routes_insert = [];

      for (const line of data.lines) {
        const line_routes = line.line_routes.map((route) => ({
          route_gid: route.route_tbid.replace(data.prefix, ''),
          route_prefix: data.prefix,
          route_tbid: route.route_tbid,
          route_id: route.route_id,
          route_direction: route.route_direction,
          parent_route: route.parent_route,
          route_name: route.route_name,
        }));

        lines_insert.push({
          line_tbid: line.line_tbid,
          line_prefix: data.prefix,
          line_id: line.line_id,
          line_type: line.line_type,
          line_identifier: line.line_identifier,
          line_name: line.line_name,
          line_color: line.line_color,
          line_text_color: line.line_text_color,
          line_routes: line_routes.map((route) => route.route_gid).join('~~~'),
        });
        routes_insert.push(...line_routes);
      }
      await db.Line.bulkCreate(lines_insert);
      await db.Route.bulkCreate(routes_insert);

      l.info('RoutesApp:GotNewRoutesData', data.prefix, {
        routes: data.lines.length,
      });
    } catch (e) {
      console.log(e);
      l.error('errror: ', e);
    } finally {
      //mb.emit('RoutesApp:DBModified', { shouldCalculateHash: true });
    }
  });
};
