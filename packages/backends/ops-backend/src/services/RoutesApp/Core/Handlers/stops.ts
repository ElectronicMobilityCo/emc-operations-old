import { OpsEvents } from '../../../../bootstrap/bus/buses/eventbus';
import { Logger } from '../../../../bootstrap/logging/logger';
import { useDatabases } from '../DB/db';

export const setup_handle_stops_ingest = (
  mb: OpsEvents,
  db: Awaited<ReturnType<typeof useDatabases>>
) => {
  const l = new Logger({ scope: 'RoutesApp', seg: 'Handlers:Stops' });
  mb.on('RoutesApp:GotNewStopData', async (data) => {
    try {
      //console.log('GotNewStopData', data);
      await db.Stop.destroy({
        where: {
          stop_prefix: data.prefix,
        },
      });
      await db.Station.destroy({
        where: {
          station_prefix: data.prefix,
        },
      });
      await db.Stop.bulkCreate(
        data.stops.map((stop) => ({
          stop_id: stop.stop_id,
          stop_prefix: data.prefix,
          stop_code: stop.stop_code,
          parent_station: stop.parent_station,

          position_lat: Number(stop.position.latitude),
          position_lon: Number(stop.position.longitude),

          stop_name: stop.stop_name,
          stop_description: stop.stop_description,

          wheelchair_boarding: Number(stop.wheelchair_boarding),
        }))
      );
      await db.Station.bulkCreate(
        data.stations.map((station) => ({
          station_id: station.station_id, // Station ID
          station_prefix: data.prefix,
          stop_code: station.stop_code, // Station Code

          position_lat: station.position.latitude, // Station Position
          position_lon: station.position.longitude, // Station Position

          station_zone: station.station_zone, // Station Zone

          station_name: station.station_name, // Station Name
          station_description: station.station_description, // Station Description
          station_url: station.station_url, // Station URL

          station_stops: station.station_stops.join('~~~'),

          wheelchair_boarding: station.wheelchair_boarding, // Station Wheelchair Accessibility
        }))
      );
      l.info('RoutesApp:GotNewStopData', data.prefix, {
        stops: data.stops.length,
        stations: data.stations.length,
      });
    } catch (e) {
      l.error(e);
    } finally {
      mb.emit('RoutesApp:DBModified', { shouldCalculateHash: true });
    }
  });
};
