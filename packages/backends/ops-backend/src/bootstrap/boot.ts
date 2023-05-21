import 'dotenv/config';

import { isMainThread } from 'node:worker_threads';
import { boot_main } from './booters/main';
import { boot_worker } from './booters/worker';
import { boot_primary } from './booters/primary';
import { OpsBus } from './bus/bus';
import { SubsystemLogForwarder } from './logging/subsystem-forwarder';

const init_filename = __filename;

const bootstrap = async () => {
  if (isMainThread == true) {
    const SubsystemBus = new OpsBus('sub');
    const PrimarySubsystemBus = SubsystemBus.addChannel('main', ['*'], true);

    SubsystemLogForwarder(SubsystemBus);
    const EventBus = new OpsBus('evt');
    const PrimaryEventBus = EventBus.addChannel('primary', ['*']);

    const provides = await boot_primary({
      init_filename,
      eventbus: EventBus,
      subsystembus: SubsystemBus,
    });
    await boot_main(provides, PrimaryEventBus, PrimarySubsystemBus);
  } else {
    await boot_worker();
  }
};

const entry = () => {
  //const boot_time = Date.now();
  bootstrap(); /*.then(() => {
    const shutdown_time = Date.now();
    if (isMainThread) {
      console.log(
        `Service process has exited. Ran for ${shutdown_time - boot_time}ms`
      );
    }
  });
  //.catch((e) => {
  //  console.error('Service process has exited with an error.', e);
  //});*/
};

entry();
