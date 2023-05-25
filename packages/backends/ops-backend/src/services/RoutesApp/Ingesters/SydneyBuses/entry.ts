import { OpsConfig } from '../../../../bootstrap/config/config_loader';
import { defineIngester } from '../../Core/Ingest/defineIngester';
import { StaticUpdate } from './updaters/static';

const IngesterURLs = {
  SBundle: 'https://api.transport.nsw.gov.au/v1/gtfs/schedule/buses',
};

const SydneyBusesIngester = defineIngester(__filename, {
  id: 'AUSYD:TfNSW/Sydney Buses',
  agencyInformation: {
    agencyName: 'Sydney Buses',
    region: 'Sydney',
    country: 'Australia',
    prefix: '[AUSYD:TfNSW/SydneyBuses]',
  },
  dataUpdaters: [
    {
      id: 'SydneyBuses:Static',
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
  ],
});
export default SydneyBusesIngester;
