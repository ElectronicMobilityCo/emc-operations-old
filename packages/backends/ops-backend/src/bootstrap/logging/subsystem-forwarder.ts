import diagnostics_channel from 'node:diagnostics_channel';
import { OpsBus } from '../bus/bus';
import { OpsSubsystemEvents } from '../bus/buses/subsystembus';
import { S_LogEvents } from '../bus/types/subsystem/Log';

type ChannelListener = (message: unknown, name: string) => void;

export const SubsystemLogForwarder = (subsystembus: OpsBus) => {
  const forwarder_port = subsystembus.addChannel(
    'log-forwarder',
    ['Log'],
    true
  );
  const forwarder_context = new OpsSubsystemEvents(
    forwarder_port,
    'log-forwarder'
  );
  const log_channel = diagnostics_channel.channel('ops:diagnostics:log');

  const handle_log = (data: S_LogEvents['Log:DelegateLog']) => {
    forwarder_context.emit('Log:DelegateLog', data);
  };

  log_channel.subscribe(handle_log as ChannelListener);
};

export const SubsystemLogDelegator = (subsystembus: OpsSubsystemEvents) => {
  const log_channel = diagnostics_channel.channel('ops:diagnostics:log');

  const handle_log = (data: S_LogEvents['Log:DelegateLog']) => {
    subsystembus.emit('Log:DelegateLog', data);
  };

  log_channel.subscribe(handle_log as ChannelListener);
};
