import { Station, Stop } from '../../../../services/RoutesApp/CoreTypes';

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
  };
}
