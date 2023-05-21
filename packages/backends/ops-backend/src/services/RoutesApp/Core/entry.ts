import { createModule } from '../../../bootstrap/define';
import { Logger } from '../../../bootstrap/logging/logger';
import { useDatabases } from './DB/db';
import { usePackEgress } from './Egress/pack';
export default createModule(__filename, async ({ mb, config }) => {
  const l = new Logger({ scope: 'RoutesApp' });

  const db = await useDatabases(config);

  await usePackEgress(mb, db);

  mb.on('RoutesApp:GotNewStopData', async (data) => {
    console.log('GotNewStopData', data);

    for (const stop of data.stops) {
      const StopData = {
        stop_id: stop.stop_id,
        stop_code: stop.stop_code,
        parent_station: stop.parent_station,

        position_lat: Number(stop.position.latitude),
        position_lon: Number(stop.position.longitude),

        stop_name: stop.stop_name,
        stop_description: stop.stop_description,

        wheelchair_boarding: Number(stop.wheelchair_boarding),
      };
      const MightHaveStop = await db.Stop.findByPk(stop.stop_id);
      if (!MightHaveStop) await db.Stop.create(StopData);
      else await MightHaveStop.update(StopData);
    }
    for (const station of data.stations) {
      const StationData = {
        station_id: station.station_id, // Station ID
        stop_code: station.stop_code, // Station Code

        position_lat: station.position.latitude, // Station Position
        position_lon: station.position.longitude, // Station Position

        station_zone: station.station_zone, // Station Zone

        station_name: station.station_name, // Station Name
        station_description: station.station_description, // Station Description
        station_url: station.station_url, // Station URL

        station_stops: station.station_stops.join('~~~'),

        wheelchair_boarding: station.wheelchair_boarding, // Station Wheelchair Accessibility
      };
      const MightHaveStation = await db.Station.findByPk(station.station_id);
      if (!MightHaveStation) await db.Station.create(StationData);
      else await MightHaveStation.update(StationData);
      await db.Station.create();
    }
    mb.emit('RoutesApp:DBModified', { shouldCalculateHash: true });
  });

  await mb.wait('Common:FinishedStartup');
  l.info('RoutesApp: Starting', config.services.RoutesApp);
});
