import { parentPort, resourceLimits, workerData } from 'node:worker_threads';
import { InternalWorkerComms } from '../workers/events';
import { performance } from 'node:perf_hooks';
import { OpsEvents } from '../bus/buses/eventbus';
import { WorkerProvides } from '../define';
import { OpsSubsystemEvents } from '../bus/buses/subsystembus';
import { SubsystemLogDelegator } from '../logging/subsystem-forwarder';

export const boot_worker = async () => {
  if (!parentPort) throw new Error('No parent port!');
  const IEB = new InternalWorkerComms(parentPort);
  const mb = new OpsEvents(workerData.mb, workerData.workername);
  const sb = new OpsSubsystemEvents(workerData.sb, workerData.workername);

  SubsystemLogDelegator(sb);

  const environment = workerData.env;

  IEB.emit('IWE_BootstrapBegin', {
    bootstrap_time: Date.now(),
    perf_time: performance.now(),
  });

  const fn = await require(workerData.fname);

  //console.log(resourceLimits);

  IEB.emit('IWE_BootstrapEnd', {
    perf_time: performance.now(),
    status: 'success',
  });

  await fn.default.context({
    mb,
    sb,
    env: environment,
    config: workerData.config,
  } as WorkerProvides);
};
