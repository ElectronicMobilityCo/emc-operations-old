import { MD5 } from 'crypto-js';
import { OpsEvents } from '../../../../bootstrap/bus/buses/eventbus';
import { Stop, GeolocationPosition, Station } from '../../CoreTypes';
import { useDatabases } from '../DB/db';

const GenerateStaticData = async (
  db: Awaited<ReturnType<typeof useDatabases>>
) => {
  const StaticStopsData = (await db.Stop.findAll()) as unknown as Array<
    Omit<Stop, 'position'> & {
      position_lat: number;
      position_lon: number;
    }
  >;
  const StaticStationsData = (await db.Station.findAll()) as unknown as Array<
    Omit<Station, 'position' | 'station_stops'> & {
      position_lat: number;
      position_lon: number;
      station_stops: string;
    }
  >;

  //console.log(
  //  'GotNewStopData',
  //  JSON.stringify(StaticStopsData[0], null, 2),
  //  StaticStopsData,
  //  StaticStationsData
  //);

  const StaticData = {
    stops: [] as Stop[],
    stations: [] as Station[],
  };

  for (const s of StaticStopsData) {
    StaticData.stops.push({
      stop_id: s.stop_id,
      stop_code: s.stop_code,
      parent_station: s.parent_station,

      position: {
        latitude: s.position_lat,
        longitude: s.position_lon,
      } as GeolocationPosition,

      stop_name: s.stop_name,
      stop_description: s.stop_description,

      wheelchair_boarding: s.wheelchair_boarding,
    });
  }

  for (const s of StaticStationsData) {
    if (s.station_stops === null) continue;
    StaticData.stations.push({
      station_id: s.station_id,
      stop_code: s.stop_code,

      position: {
        latitude: s.position_lat,
        longitude: s.position_lon,
      } as GeolocationPosition,
      station_zone: s.station_zone,

      station_name: s.station_name,
      station_description: s.station_description,
      station_url: s.station_url,

      wheelchair_boarding: s.wheelchair_boarding,

      station_stops: s.station_stops.split('~~~'),
      station_stops_prefix: s.station_stops_prefix,
    });
  }

  return StaticData;
};

export const usePackEgress = (
  mb: OpsEvents,
  db: Awaited<ReturnType<typeof useDatabases>>
) => {
  let StaticData = {};
  let Hash = MD5(JSON.stringify(StaticData)).toString();

  mb.on('RoutesApp:DBModified', async () => {
    console.log('DBModified');
    const stData = await GenerateStaticData(db);
    StaticData = stData;
    Hash = MD5(JSON.stringify(stData)).toString();
  });

  mb.respond(
    'RoutesApp:GetStaticHydrationHash',
    'RoutesApp:GetStaticHydrationHashResponse',
    async (data) => {
      console.log('GetStaticHydrationHash', data);
      return {
        hash: Hash,
      };
    }
  );
  mb.respond(
    'RoutesApp:GetStaticData',
    'RoutesApp:GetStaticDataResponse',
    async (data) => {
      //console.log('GetStaticData', data);
      return {
        staticdata: StaticData,
        hash: Hash,
      };
    }
  );
};
