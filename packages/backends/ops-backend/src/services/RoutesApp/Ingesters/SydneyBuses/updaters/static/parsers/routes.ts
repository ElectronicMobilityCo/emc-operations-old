import { Line, Route } from '../../../../../CoreTypes';

type GTFS_ROUTES_TYPE = {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: string;
  route_url: string;
  route_color: string;
  route_text_color: string;
};

const parseRouteID = (rid: string) => {
  const parsedRid = rid.split('_');
  return [parsedRid[1], parsedRid[0], '0'];
};

const Prefix = '[AUSYD:TfNSW/SydneyBuses]';

export const parseRoutes = async (
  GTFSFiles: Map<string, Array<GTFS_ROUTES_TYPE>>
) => {
  const gtfsRoutes = GTFSFiles.get('routes.txt');

  if (gtfsRoutes == null) return;
  console.log('Got', gtfsRoutes.length, 'routes');

  const lines = new Map<string, Line>();

  for (const route of gtfsRoutes) {
    const parsedRID = parseRouteID(route.route_id);

    if (!lines.has(parsedRID[0])) {
      lines.set(parsedRID[0], {
        line_tbid: `${Prefix}${parsedRID[0]}`,
        line_id: route.route_short_name,
        line_type: route.route_type,
        line_identifier: route.route_short_name,
        line_name: route.route_desc,
        line_color: route.route_color,
        line_text_color: route.route_text_color,
        line_routes: [],
      });
    }
  }

  for (const route of gtfsRoutes) {
    const parsedRID = parseRouteID(route.route_id);
    const line = lines.get(parsedRID[0]);
    if (line == null) continue;
    line.line_routes.push({
      route_tbid: `${Prefix}${route.route_id}`,
      route_id: parsedRID[1],
      route_direction: parsedRID[2],
      parent_route: `${Prefix}${parsedRID[0]}`,
      route_name: route.route_long_name,
    });
  }

  const routespayload = {
    lines: Array.from(lines.values()),
  };
  return routespayload;
};
