import { OpsConfig } from '../../../../bootstrap/config/config_loader';
import { createModule } from '../../../../bootstrap/define';
import { Logger } from '../../../../bootstrap/logging/logger';
import { Station, Stop } from '../../CoreTypes';

interface AgencyInformation {
  agencyName: string;
  region: string;
  country: string;
}

type DataUpdaterType = 'REALTIME' | 'STATIC';

interface DataUpdater {
  id: string;
  type: DataUpdaterType;
  interval: number;
  run: (config: OpsConfig) => Promise<unknown>;
}

interface IngesterParams {
  id: string;
  agencyInformation: AgencyInformation;
  dataUpdaters: DataUpdater[];
}

export const defineIngester = (filename: string, data: IngesterParams) => {
  return createModule(filename, async ({ mb, config }) => {
    const l = new Logger({ scope: 'RoutesApp', seg: `Ingester:${data.id}` });
    await mb.wait('Common:FinishedStartup');

    // Register the updaters
    l.info('Registering Ingester', data.agencyInformation.agencyName, {
      updaters: data.dataUpdaters.length,
    });

    for (const updater of data.dataUpdaters) {
      l.info('Registering Updater', updater.id, {
        type: updater.type,
        interval: updater.interval,
      });

      const timings = {
        lastUpdated: 0,
        hasRunFirstTime: false,
      };

      const RunUpdater = async () => {
        if (updater.type === 'REALTIME') {
          const DeltaCollection = await updater.run(config);
          console.log('Delta', DeltaCollection);
        } else if (updater.type === 'STATIC') {
          const ReplaceCollection = (await updater.run(config)) as unknown as {
            stops: {
              stops: Stop[];
              stations: Station[];
            };
          };
          console.log('Replace', ReplaceCollection);
          mb.emit('RoutesApp:GotNewStopData', {
            stops: ReplaceCollection.stops.stops,
            stations: ReplaceCollection.stops.stations,
          });
          console.log(mb);
        }
      };

      mb.on('Common:Clock', async (clock) => {
        if (timings.hasRunFirstTime) {
          if (clock.EPOCH - timings.lastUpdated > updater.interval) {
            timings.lastUpdated = clock.EPOCH;
            await RunUpdater();
          }
        } else {
          timings.lastUpdated = clock.EPOCH;
          timings.hasRunFirstTime = true;
          await RunUpdater();
        }
      });
    }
  });
};
