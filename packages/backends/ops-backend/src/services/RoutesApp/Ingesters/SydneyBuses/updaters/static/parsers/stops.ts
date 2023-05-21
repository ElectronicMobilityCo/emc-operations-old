import { GeolocationPosition, Station, Stop } from '../../../../../CoreTypes';

type GTFS_STOPS_TYPE = {
  location_type: number;
  parent_station: string;
  stop_code: string;
  stop_desc: string;
  stop_id: string;
  stop_lat: number;
  stop_lon: number;
  stop_name: string;
  stop_timezone: string;
  stop_url: string;
  wheelchair_boarding: number;
  zone_id: string;
};

export const parseStops = async (
  GTFSFiles: Map<string, Array<GTFS_STOPS_TYPE>>
) => {
  const gtfsStops = GTFSFiles.get('stops.txt');

  if (gtfsStops == null) return;

  const rawstops: GTFS_STOPS_TYPE[] = gtfsStops.map((s: GTFS_STOPS_TYPE) => {
    return {
      location_type: Number(s.location_type),
      parent_station: `[AUSYD:TfNSW/SydneyBuses]${s.parent_station}`,
      stop_code: s.stop_code,
      stop_desc: s.stop_desc,
      stop_id: `[AUSYD:TfNSW/SydneyBuses]${s.stop_id}`,
      stop_lat: Number(s.stop_lat),
      stop_lon: Number(s.stop_lon),
      stop_name: s.stop_name,
      stop_timezone: s.stop_timezone,
      stop_url: s.stop_url,
      wheelchair_boarding: Number(s.wheelchair_boarding),
      zone_id: `[AUSYD:TfNSW/SydneyBuses]${s.zone_id}`,
    };
  });

  console.log(`Parsing ${rawstops.length} stops`);

  const stations = new Map();
  const stops = new Map();

  const contents = rawstops.sort((a, b) => b.location_type - a.location_type);

  for (const entity of contents) {
    if (entity.location_type == 1) {
      // is parent station
      stations.set(entity.stop_id, {
        station_id: entity.stop_id,
        stop_code: entity.stop_code,

        position: {
          latitude: Number(entity.stop_lat),
          longitude: Number(entity.stop_lon),
        } as GeolocationPosition,
        station_zone: entity.zone_id,

        station_name: entity.stop_name,
        station_description: entity.stop_desc,
        station_url: entity.stop_url,

        wheelchair_boarding: 1,

        station_stops: [],
      });
    } else if (entity.location_type == 0) {
      // is parent station
      stops.set(entity.stop_id, {
        stop_id: entity.stop_id,
        stop_code: entity.stop_code,
        parent_station: entity.parent_station,

        position: {
          latitude: Number(entity.stop_lat),
          longitude: Number(entity.stop_lon),
        } as GeolocationPosition,

        stop_name: entity.stop_name,
        stop_description: entity.stop_desc,

        wheelchair_boarding: 1,
      });

      if (stations.has(entity.parent_station)) {
        stations.get(entity.parent_station).station_stops.push(entity.stop_id);
      }
    }
  }

  const stoppayload = {
    header: {
      timestamp: Date.now(),
      version: 0,
    },
    stations: [] as Station[],
    stops: [] as Stop[],
  };
  stations.forEach((station) => stoppayload.stations.push(station));
  stops.forEach((stop) => stoppayload.stops.push(stop));

  return stoppayload;
};
