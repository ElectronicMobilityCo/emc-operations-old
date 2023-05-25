// Position
export interface GeolocationPosition {
  latitude: number; // Degrees North, in the WGS-84 coordinate system.
  longitude: number; // Degrees East, in the WGS-84 coordinate system.
}

export enum LandWheelchairAccessibility {
  UNKNOWN = 0,
  YES = 1,
  NO = 2,
}

export type DAY_OF_WEEK = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type OperationDates = {
  start_date: number; // YYYYMMDD
  end_date: number; // YYYYMMDD
  days_operating: DAY_OF_WEEK[];
};
// Time
export type Time = string; // seconds from the start of the day

// Describes a Station which can contain stops
export interface Station {
  station_id: string; // Station ID
  stop_code: string; // Station Code

  position: GeolocationPosition; // Station Position
  station_zone: string; // Station Zone

  station_name: string; // Station Name
  station_description: string; // Station Description
  station_url: string; // Station URL

  wheelchair_boarding: LandWheelchairAccessibility; // Station Wheelchair Accessibility

  station_stops: string[]; // List of Stops
  station_stops_prefix: string; // Prefix for Trip Stops = "1--A"
}

export interface Stop {
  stop_id: string; // Stop ID
  stop_code: string; // Stop Code
  parent_station: string; // Parent Station ID

  position: GeolocationPosition; // Stop Position

  stop_name: string; // Stop Name
  stop_description: string; // Stop Description

  wheelchair_boarding: LandWheelchairAccessibility; // Station Wheelchair Accessibility
}

export interface Trip {
  trip_tbid: string; // Timetabled ID = "1--A.1241.121.60.B.8.73409025"
  trip_svid: string; // Service ID = "1241.121.60"
  trip_routeid: string; // Route ID = "BNK_2a"

  trip_shapeid: string; // Shape ID = "BNK_2a"
  trip_blockid: string; // Block ID = "32602"

  trip_headsign: string; // Headsign = "City Circle via Museum"
  trip_accessible: boolean; // Trip Accessible Flag = "0"

  trip_vehicledata: VehicleData; // Trip vehicle data

  trip_operation_dates: OperationDates;

  trip_stops: TripStop[]; // List of Trip Stops in this line
  trip_stops_prefix: string; // Prefix for Trip Stops ID
}

export enum VehicleDataStatus {
  UNKNOWN = 0,
  TIMETABLED = 1,
  CONFIRMED = 2,
}

export interface VehicleData {
  vd_isconfirmed: VehicleDataStatus; // Vehicle Confirmed (if Timetabled, false)
  vd_vehicleid: string; // Vehicle Data
}

export enum StopBoardingType {
  DECLINE = 0,
  ACCEPT = 1,
  MUSTCONFIRM = 2,
  MUSTCONTACT = 3,
}

export interface TripStop {
  stop_refid: string;

  stop_tripid: string; // Stop Trip ID
  stop_sequence: number;

  stop_id: string;

  stop_arrivaltime: Time; // Stop Arrival time
  stop_arrivaltype: StopBoardingType;

  stop_departuretime: Time;
  stop_departuretype: StopBoardingType;
}

export interface Line {
  line_tbid: string; // Timetabled ID = "APS" NOT "APS_1a"
  line_id: string; // Line ID = T1
  line_type: string; // Line type = 2(heavy rail)

  line_identifier: string; // Line ID = T1
  line_name: string; // Line Name = T9 Northern Line

  line_color: string; // line color
  line_text_color: string;

  line_routes: Route[]; // List of Routes in this line
}

export interface Route {
  route_tbid: string; // Timetabled ID = APS_1a
  route_id: string; // ID = a
  route_direction: string; // Direction = 1

  parent_route: string; // Parent Route = APS;

  route_name: string; // Route name = City Circle to Macarthur via Airport
}

export interface Agency {
  agency_id: string;
  agency_name: string;

  agency_lang: string;
  agency_timezone: string;

  agency_url: string;
}
