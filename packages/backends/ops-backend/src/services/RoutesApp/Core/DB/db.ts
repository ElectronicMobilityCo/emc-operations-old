import { Sequelize } from 'sequelize';
import { OpsConfig } from '../../../../bootstrap/config/config_loader';
import { Logger } from '../../../../bootstrap/logging/logger';
import { stopsModel } from './StopsModel';
import { tripsModel } from './TripsModel';
import { routesModel } from './RoutesModel';

const CreateNewSequelize = (path: string) => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: path,
    logging: false, //(msg) => l.debug('SequelizeQuery', msg),
  });
};

export const useDatabases = async (config: OpsConfig) => {
  const l = new Logger({ scope: 'RoutesApp', seg: 'Database' });

  const STATIC_ENGINE = CreateNewSequelize(config.services.RoutesApp.db_static);
  const VOLATILE_ENGINE = CreateNewSequelize(
    config.services.RoutesApp.db_volatile
  );

  const { Stop, Station } = stopsModel(STATIC_ENGINE);
  const { Trip, TripStop } = tripsModel(STATIC_ENGINE);
  const { Line, Route } = routesModel(STATIC_ENGINE);

  await STATIC_ENGINE.sync();

  //l.info('Initalised Sequelize');

  return {
    STATIC_ENGINE,
    VOLATILE_ENGINE,
    Stop,
    Station,
    Trip,
    TripStop,
    Line,
    Route,
  };
};
