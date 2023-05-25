import { OpsConfig } from '../../../../bootstrap/config/config_loader';
import { defineIngester } from '../../Core/Ingest/defineIngester';
import { StaticUpdate } from './updaters/static';

const IngesterURLs = {
  SBundle: 'https://api.transport.nsw.gov.au/v1/gtfs/schedule/sydneytrains',
  RVehiclePositions:
    'https://api.transport.nsw.gov.au/v2/gtfs/vehiclepos/sydneytrains',
  RTripUpdates:
    'https://api.transport.nsw.gov.au/v2/gtfs/realtime/sydneytrains',
  RServiceAlerts:
    'https://api.transport.nsw.gov.au/v2/gtfs/alerts/sydneytrains',
};

const SydneyTrainsIngester = defineIngester(__filename, {
  id: 'AUSYD:TfNSW/SydneyTrains',
  agencyInformation: {
    agencyName: 'Sydney Trains',
    region: 'Sydney',
    country: 'Australia',
    prefix: '[AUSYD:TfNSW/SydneyTrains]',
  },
  dataUpdaters: [
    {
      id: 'SydneyTrains:Realtime',
      type: 'STATIC',
      interval: 1000 * 60 * 60 * 24,
      run: (config: OpsConfig) => {
        return StaticUpdate(
          config,
          IngesterURLs.SBundle,
          config.services.RoutesApp.apiKey_TransportForNSW
        );
      },
    },
    {
      id: 'SydneyTrains:Realtime',
      type: 'REALTIME',
      interval: 1000 * 10,
      run: async () => {
        //console.log('Sydney Trains Realtime');
      },
    },
  ],
});
export default SydneyTrainsIngester;
