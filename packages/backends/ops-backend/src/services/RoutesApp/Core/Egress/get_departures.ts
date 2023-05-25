import { OpsEvents } from '../../../../bootstrap/bus/buses/eventbus';
import { useDatabases } from '../DB/db';
import { RoutesAppEvents } from '../../../../bootstrap/bus/types/event/RoutesApp';

export const useDeparturesEgress = (
  mb: OpsEvents,
  db: Awaited<ReturnType<typeof useDatabases>>
) => {
  mb.respond(
    'RoutesApp:GetDepartures',
    'RoutesApp:GetDeparturesResponse',
    async (data) => {
      //console.log('GetDepartures', data);
      try {
        const query = `SELECT stop_arrivaltime_computed, stop_departuretime, stop_prefix, stop_id, trip_operation_dates, stop_sequence, trip_shapeid, trip_operation_dates_end, trip_operation_dates_start, trip_end, line_identifier, line_color FROM TripStops INNER JOIN Trips ON Trips.trip_tbid = TripStops.stop_tripid INNER JOIN Routes ON Routes.route_gid = Trips.trip_routeid INNER JOIN Lines ON Lines.line_tbid = Routes.parent_route WHERE stop_arrivaltime_computed > ${data.current_time} AND stop_id = '${data.stop_id}' AND trip_operation_dates LIKE "%${data.day_of_week}%" AND trip_operation_dates_start <= ${data.current_date} AND trip_operation_dates_end >= ${data.current_date} ORDER BY stop_arrivaltime_computed LIMIT 5`;
        const everything = await db.STATIC_ENGINE.query(query);

        //console.log(everything[0]);
        return {
          departures:
            everything[0] as RoutesAppEvents['RoutesApp:GetDeparturesResponse']['departures'],
        };
      } catch (e) {
        console.log(e);
        return {
          departures: [],
        };
      }
    }
  );
};
