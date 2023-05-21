import { MessagePort, Worker, isMainThread } from 'node:worker_threads';
import { WorkerModule } from '../define';
import { InternalWorkerComms } from './events';
import { OpsBus } from '../bus/bus';
import { Report_Environment } from '../reports/report_environment';
import { OpsConfig } from '../config/config_loader';

export const spawnWorker = async (
  init_filename: string,
  workerinit: WorkerModule,
  eventbus: OpsBus,
  subsystembus: OpsBus,
  env: Awaited<ReturnType<typeof Report_Environment>>,
  events: string[],
  worker_id: string,
  config: OpsConfig
) => {
  if (!isMainThread) throw new Error('Cannot spawn worker from worker!');
  const workerMB = eventbus.addChannel(
    worker_id,
    events
  ) as unknown as MessagePort;
  const workerSB = subsystembus.addChannel(worker_id, [
    '*',
  ]) as unknown as MessagePort;
  const worker = new Worker(init_filename, {
    workerData: {
      fname: workerinit.fname,
      env,
      config,
      mb: workerMB,
      sb: workerSB,
      workername: worker_id,
    },
    //name: worker_id,
    transferList: [workerMB, workerSB],
  });
  const IEB = new InternalWorkerComms(worker);
  const setupdata = await IEB.wait('IWE_BootstrapBegin');
  console.log(
    `    Booted module: ${worker_id} in ${setupdata.perf_time.toFixed(3)}ms`
  );
  return {
    worker,
    bus: IEB,
  };
};
