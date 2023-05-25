import { OpsEvents } from '../../../../bootstrap/bus/buses/eventbus';
import { Logger } from '../../../../bootstrap/logging/logger';
import { useDatabases } from '../DB/db';

const time_converter = (time: string) => {
  return time
    .split(':')
    .map((v) => Number(v))
    .map((v, i) => v * Math.pow(60, 2 - i))
    .reduce((p, c) => p + c);
};
export const setup_handle_trips_ingest = (
  mb: OpsEvents,
  db: Awaited<ReturnType<typeof useDatabases>>
) => {
  const l = new Logger({ scope: 'RoutesApp', seg: 'Handlers:Trips' });
  mb.on('RoutesApp:GotNewTripData', async (data) => {
    try {
      //console.log('GotNewStopData', data);
      await db.Trip.destroy({
        where: {
          trip_prefix: data.prefix,
        },
      });
      await db.TripStop.destroy({
        where: {
          stop_prefix: data.prefix,
        },
      });

      const trips_insert = [];
      const tripStops_insert = [];

      for (const trip of data.trips) {
        if (trip.trip_stops.length < 1) continue;
        const trip_stops = trip.trip_stops
          .map((stop) => ({
            stop_refid: stop.stop_refid,
            stop_prefix: data.prefix,
            stop_tripid: stop.stop_tripid.replace(data.prefix, ''),
            stop_sequence: stop.stop_sequence,
            stop_id: stop.stop_id.replace(data.prefix, ''),
            stop_arrivaltime: stop.stop_arrivaltime,
            stop_arrivaltime_computed: time_converter(stop.stop_arrivaltime),
            stop_arrivaltype: stop.stop_arrivaltype,
            stop_departuretime: stop.stop_departuretime,
            stop_departuretime_computed: time_converter(
              stop.stop_departuretime
            ),
            stop_departuretype: stop.stop_departuretype,
          }))
          .sort((a, b) => a.stop_sequence - b.stop_sequence);

        trips_insert.push({
          trip_id: trip.trip_tbid,
          trip_tbid: trip.trip_tbid.replace(data.prefix, ''),
          trip_prefix: data.prefix,
          trip_svid: trip.trip_svid,
          trip_routeid: trip.trip_routeid,
          trip_shapeid: trip.trip_shapeid,
          trip_blockid: trip.trip_blockid,
          trip_headsign: trip.trip_headsign,
          trip_accessible: trip.trip_accessible,
          trip_vehicledata_vd_isconfirmed: trip.trip_vehicledata.vd_isconfirmed,
          trip_vehicledata_vd_vehicleid: trip.trip_vehicledata.vd_vehicleid,
          trip_stops: trip_stops
            .map((stop) => stop.stop_refid.replace(data.prefix, ''))
            .join('~~~'),
          trip_start: trip_stops[0].stop_id,
          trip_end: trip_stops[Math.abs(trip_stops.length - 1)].stop_id,
          trip_operation_dates:
            trip.trip_operation_dates.days_operating.join('~~~'),
          trip_operation_dates_start: trip.trip_operation_dates.start_date,
          trip_operation_dates_end: trip.trip_operation_dates.end_date,
          trip_stops_prefix: data.prefix,
        });
        tripStops_insert.push(...trip_stops);
      }
      await db.Trip.bulkCreate(trips_insert);
      await db.TripStop.bulkCreate(tripStops_insert);

      l.info('RoutesApp:GotNewTripData', data.prefix, {
        trips: data.trips.length,
        tripsInsert: trips_insert.length,
        tripStopsInsert: tripStops_insert.length,
      });
    } catch (e) {
      console.log(e);
      l.error('errror: ', e);
    } finally {
      //mb.emit('RoutesApp:DBModified', { shouldCalculateHash: true });
    }
  });
};
