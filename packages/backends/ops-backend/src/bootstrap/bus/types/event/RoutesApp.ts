import {
  DAY_OF_WEEK,
  Line,
  Station,
  Stop,
  Trip,
} from '../../../../services/RoutesApp/CoreTypes';

export interface RoutesAppEvents {
  'RoutesApp:GetStaticHydrationHash': {
    region: string;
    country: string;
  };
  'RoutesApp:GetStaticHydrationHashResponse': {
    hash: string;
  };
  'RoutesApp:GetStaticData': {
    region: string;
    country: string;
  };
  'RoutesApp:GetStaticDataResponse': {
    staticdata: object;
    hash: string;
  };
  'RoutesApp:DBModified': {
    shouldCalculateHash: true;
  };
  'RoutesApp:GotNewStopData': {
    stops: Stop[];
    stations: Station[];
    prefix: string;
  };
  'RoutesApp:GotNewTripData': {
    trips: Trip[];
    prefix: string;
  };
  'RoutesApp:GotNewRoutesData': {
    lines: Line[];
    prefix: string;
  };
  'RoutesApp:GetDepartures': {
    stop_id: string;
    day_of_week: DAY_OF_WEEK;
    current_date: number;
    current_time: number;
  };
  'RoutesApp:GetDeparturesResponse': {
    departures: Array<{
      line_identifier: string;
      line_color: string;
      stop_arrivaltime_computed: number;
      stop_departuretime: string;
      stop_id: string;
      stop_prefix: string;
      stop_sequence: 13;
      trip_end: string;
      trip_operation_dates: string;
      trip_operation_dates_end: number;
      trip_operation_dates_start: number;
      trip_shapeid: string;
    }>;
  };
}
