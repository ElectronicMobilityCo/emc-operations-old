import { createModule } from '../../../bootstrap/define';
import { Logger } from '../../../bootstrap/logging/logger';
import { Sequelize } from 'sequelize';

import { estonia_tallinn_tlt } from './connectors/estonia_tallinn_tlt';
import { OpsEvents } from '../../../bootstrap/bus/buses/eventbus';

import type { CommonEvents } from '../../../bootstrap/bus/types/event/Common';
import bootVDB from './databases/volatile';
import {
  VehicleDeltaApplication,
  VehicleRealtimeDataUpdateDelta,
} from './models/vehicle_class';

export interface DataConnector {
  AgencyName: string;
  Region: string;
  Country: string;
  RefreshVolatileInterval: number;
  RefreshStaticInterval: number;
  FetchVolatile: () => Promise<VehicleRealtimeDataUpdateDelta[]>;
  FetchStatic: () => unknown;
}

export default createModule(__filename, ({ mb, config }) => {
  const l = new Logger({
    scope: 'RoutesApp',
    seg: 'Server',
  });

  const data_connectors: Array<DataConnector> = [estonia_tallinn_tlt];

  l.debug('CONFIG', config);

  const DB_extend = {
    static: new Sequelize({
      dialect: 'sqlite',
      storage: config.Service_RoutesApp.DATABASE.static,
      logging: false, //(msg) => l.debug('SequelizeQuery', msg),
    }),
    volatile: new Sequelize({
      dialect: 'sqlite',
      storage: config.Service_RoutesApp.DATABASE.volatile,
      logging: false, //(msg) => l.debug('SequelizeQuery', msg),
    }),
  };

  const DB = {
    V: bootVDB(DB_extend.volatile),
  };

  const handle_data = async (data: Array<VehicleRealtimeDataUpdateDelta>) => {
    const added = data.filter(
      (d) => d.application == VehicleDeltaApplication.VEHICLE_ADD
    ).length;
    const modified = data.filter(
      (d) => d.application == VehicleDeltaApplication.VEHICLE_MODIFY
    ).length;
    const removed = data.filter(
      (d) => d.application == VehicleDeltaApplication.VEHICLE_REMOVE
    ).length;

    l.info('output', 'Got data from connector.', {
      totalVehicles: data.length,
      added,
      modified,
      removed,
    });

    for (const d of data) {
      if (d.application == VehicleDeltaApplication.VEHICLE_ADD) {
        DB.V.RegisterRealtimeVehicle(d.vehicle);
      }
      if (d.application == VehicleDeltaApplication.VEHICLE_MODIFY) {
        DB.V.UpdateRealtimeVehicle(d.vehicle);
      }
      if (d.application == VehicleDeltaApplication.VEHICLE_REMOVE) {
        DB.V.RemoveRealtimeVehicle(d.vehicle);
      }
    }

    const Allvehicles = await DB.V.GetAllVehicles();
    l.info('Got all vehicles', Allvehicles.length);
    //l.info('Got ', 'got data');
  };

  run_volatile_connectors_and_fetch_data(mb, data_connectors, handle_data);

  mb.on('Common:Clock', async (dclock: unknown) => {
    const Allvehicles = await DB.V.GetAllVehicles();
    l.info('Got V', Allvehicles.length);
  });
});

const run_volatile_connectors_and_fetch_data = async (
  mb: OpsEvents,
  data_connectors: DataConnector[],
  data_handler: (data: Array<VehicleRealtimeDataUpdateDelta>) => void
) => {
  //mb.wait('Common:Clock');
  const Runners = new Map();

  for (const connector of data_connectors) {
    Runners.set(connector, {
      prevTime: 0,
      hasInitialRun: false,
    });
    const data = await connector.FetchVolatile();
    data_handler(data);
  }

  const start_runner = async (connector: DataConnector) => {
    const data = await connector.FetchVolatile();
    data_handler(data);
  };

  mb.on('Common:Clock', (dclock: unknown) => {
    const clock = dclock as CommonEvents['Common:Clock'];
    for (const connector of data_connectors) {
      const runnerConfig = Runners.get(connector);
      if (!runnerConfig.hasInitialRun) {
        start_runner(connector);
        Runners.set(connector, {
          prevTime: clock.WALL,
          hasInitialRun: true,
        });
      } else if (
        clock.WALL - runnerConfig.prevTime >
        connector.RefreshVolatileInterval
      ) {
        start_runner(connector);
        Runners.set(connector, {
          prevTime: clock.WALL,
          hasInitialRun: true,
        });
      }
    }
  });
};
