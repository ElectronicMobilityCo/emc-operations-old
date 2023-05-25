import {
  GeolocationPosition,
  OperationDates,
  Station,
  Stop,
  Trip,
} from '../../../../../CoreTypes';

type GTFS_TRIPS_TYPE = {
  block_id: string;
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  direction_id: string;
  shape_id: string;
  wheelchair_accessible: number;
};

type GTFS_STOP_TIMES_TYPE = {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: string;
  pickup_type: string;
  drop_off_type: string;
};

type GTFS_CALENDAR_TYPE = {
  service_id: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  start_date: string;
  end_date: string;
};

const Prefix = '[AUSYD:TfNSW/SydneyBuses]';

export const parseTrips = async (
  GTFSFiles: Map<
    string,
    Array<GTFS_TRIPS_TYPE | GTFS_STOP_TIMES_TYPE | GTFS_CALENDAR_TYPE>
  >
) => {
  const gtfsTrips = GTFSFiles.get('trips.txt');
  const gtfsStopTimes = GTFSFiles.get('stop_times.txt');
  const gtfsCalendar = GTFSFiles.get('calendar.txt');

  if (gtfsTrips == null || gtfsStopTimes == null) return;
  console.log('Got', gtfsTrips.length, gtfsStopTimes.length);

  //if (gtfsTrips == null || gtfsStopTimes) return;

  const calendar_lookup = new Map<string, OperationDates>();

  const trips = new Map<string, Trip>();

  for (const service of gtfsCalendar as Array<GTFS_CALENDAR_TYPE>) {
    calendar_lookup.set(service.service_id, {
      days_operating: [
        Number(service.monday) == 1 ? 'MON' : null,
        Number(service.tuesday) == 1 ? 'TUE' : null,
        Number(service.wednesday) == 1 ? 'WED' : null,
        Number(service.thursday) == 1 ? 'THU' : null,
        Number(service.friday) == 1 ? 'FRI' : null,
        Number(service.saturday) == 1 ? 'SAT' : null,
        Number(service.sunday) == 1 ? 'SUN' : null,
      ].filter((x) => x !== null) as OperationDates['days_operating'],
      start_date: Number(service.start_date),
      end_date: Number(service.end_date),
    });
  }

  for (const trip of gtfsTrips as Array<GTFS_TRIPS_TYPE>) {
    trips.set(trip.trip_id, {
      trip_tbid: `${Prefix}${trip.trip_id}`,
      trip_svid: trip.service_id,
      trip_routeid: trip.route_id,
      trip_shapeid: trip.shape_id,
      trip_blockid: trip.block_id,
      trip_headsign: trip.trip_headsign,
      trip_accessible: trip.wheelchair_accessible == 0 ? false : true,
      trip_vehicledata: {
        vd_isconfirmed: 0,
        vd_vehicleid: '',
      },
      trip_stops: [],
      trip_operation_dates: calendar_lookup.get(trip.service_id) || {
        start_date: 0,
        end_date: 0,
        days_operating: [],
      },
      trip_stops_prefix: Prefix,
    });
  }

  for (const stopTime of gtfsStopTimes as Array<GTFS_STOP_TIMES_TYPE>) {
    const trip = trips.get(stopTime.trip_id);
    if (trip == null) continue;

    trip.trip_stops.push({
      stop_refid: `${Prefix}${stopTime.trip_id}(${stopTime.stop_sequence})`,
      stop_tripid: `${Prefix}${stopTime.trip_id}`,
      stop_sequence: Number(stopTime.stop_sequence),
      stop_id: `${Prefix}${stopTime.stop_id}`,
      stop_arrivaltime: stopTime.arrival_time,
      stop_departuretime: stopTime.departure_time,
      stop_arrivaltype: Number(stopTime.pickup_type),
      stop_departuretype: Number(stopTime.drop_off_type),
    });
  }

  const trippayload = {
    trips: Array.from(trips.values()),
  };
  return trippayload;
};
