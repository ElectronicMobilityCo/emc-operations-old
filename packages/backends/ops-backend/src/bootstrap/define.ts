import { OpsEvents } from './bus/buses/eventbus';
//import { OpsEventConformingScope } from './bus/registry';
import { OpsSubsystemEvents } from './bus/buses/subsystembus';
import { OpsConfig } from './config/config_loader';
import { Report_Environment } from './reports/report_environment';

export type ModuleDefinition = {
  name: string;
  events: string[]; //OpsEventConformingScope[];
};

export type SubsytemDefinition = {
  name: string;
};

export type WorkerProvides = {
  sb: OpsSubsystemEvents;
  mb: OpsEvents;
  env: Awaited<ReturnType<typeof Report_Environment>>;
  config: OpsConfig;
};

export type WorkerModule = {
  fname: string;
  context: (provides: WorkerProvides) => void;
};

export type LoadableModule = {
  meta: ModuleDefinition;
  workers: WorkerModule[];
};
export type LoadableSubsystem = {
  meta: SubsytemDefinition;
  workers: WorkerModule[];
};

export const defineModule = (
  module: ModuleDefinition,
  workers: WorkerModule[]
) => {
  return {
    meta: module,
    workers,
  } as LoadableModule;
};

export const defineSubsystem = (
  module: SubsytemDefinition,
  workers: WorkerModule[]
) => {
  return {
    meta: module,
    workers,
  } as LoadableSubsystem;
};

export const createModule = (
  filename: string,
  init: (provides: WorkerProvides) => void
) => {
  return {
    fname: filename,
    context: init,
  };
};
