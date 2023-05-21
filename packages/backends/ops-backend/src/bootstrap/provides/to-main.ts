import { OpsConfig } from '../config/config_loader';
import { OpsEvents } from '../bus/buses/eventbus';
import { OpsSubsystemEvents } from '../bus/buses/subsystembus';

export interface ProvidesMain {
  config: OpsConfig;
  events: OpsEvents;
  subsystem: OpsSubsystemEvents;
}

export const providesToMain = (provide: ProvidesMain) => {
  return provide as ProvidesMain;
};
