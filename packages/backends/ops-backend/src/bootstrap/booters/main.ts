import { ops_service } from '../../main/main';
import { boot_primary } from '../booters/primary';
import { MBPortConforming } from '../bus/bus';
import { OpsEvents } from '../bus/buses/eventbus';
import { OpsSubsystemEvents } from '../bus/buses/subsystembus';
import { SubsystemLogDelegator } from '../logging/subsystem-forwarder';
import { ProvidesMain, providesToMain } from '../provides/to-main';

export const boot_main = async (
  init_result: Awaited<ReturnType<typeof boot_primary>>,
  eventbus: MBPortConforming,
  subsystembus: MBPortConforming
) => {
  const provides: ProvidesMain = providesToMain({
    config: init_result.config,
    events: new OpsEvents(eventbus, 'primary'),
    subsystem: new OpsSubsystemEvents(subsystembus, 'primary'),
  });
  SubsystemLogDelegator(provides.subsystem);
  await ops_service(provides);
};
