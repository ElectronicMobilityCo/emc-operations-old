import { Config_Load } from '../config/config_loader';
import {
  MessageUtils_Seperator,
  MessageUtils_ServerBootHeader,
  MessageUtils_ServiceEnvironmentReport,
} from '../utils/message_utils';
import { Report_Environment } from '../reports/report_environment';
import { ops_subsystems, ops_modules } from '../../ops';
import { spawnWorker } from '../workers/functions';
import { OpsBus } from '../bus/bus';

export const boot_primary = async ({
  init_filename,
  eventbus,
  subsystembus,
}: {
  init_filename: string;
  eventbus: OpsBus;
  subsystembus: OpsBus;
}) => {
  // Log the logo
  console.log(MessageUtils_ServerBootHeader);
  console.log(MessageUtils_Seperator);

  // Log an environment report
  const env = await Report_Environment();
  console.log(MessageUtils_ServiceEnvironmentReport(env));
  console.log(MessageUtils_Seperator);

  // load the config
  console.log('Loading configuration...');
  const config = await Config_Load();
  console.log(`Parsed successfully: (${config.config_hash})`);
  console.log(
    `${JSON.stringify(config, null, 4)
      .replace(/"/g, '')
      .replace(/},/g, '')
      .replace(/{|}/g, '')
      .replace(/^\s*$(?:\r\n?|\n)/gm, '')}`.trimEnd()
  );
  console.log(MessageUtils_Seperator);

  // load modules
  const subsys_modules_loaded = [];
  const subsys_workers = [];
  console.log(
    'Loading',
    ops_subsystems.length,
    ops_subsystems.length == 1 ? 'subsystem...' : 'subsystem...'
  );
  for (const sub of ops_subsystems) {
    for (const [i, wk] of sub.workers.entries()) {
      const worker = await spawnWorker(
        init_filename,
        wk,
        eventbus,
        subsystembus,
        env,
        ['*'],
        `subsys:${sub.meta.name}:${i}`,
        config
      );
      subsys_workers.push(worker);
    }
    subsys_modules_loaded.push(sub);
  }

  // load modules
  const modules_loaded = [];
  const workers = [];
  console.log(
    'Loading',
    ops_modules.length,
    ops_modules.length == 1 ? 'module...' : 'modules...'
  );
  for (const mod of ops_modules) {
    for (const [i, wk] of mod.workers.entries()) {
      const worker = await spawnWorker(
        init_filename,
        wk,
        eventbus,
        subsystembus,
        env,
        mod.meta.events,
        `module:${mod.meta.name}:${i}`,
        config
      );
      workers.push(worker);
    }
    modules_loaded.push(mod);
  }

  console.log('Booting main instance now...');

  console.log(MessageUtils_Seperator);
  return {
    config,
    modules_loaded,
    workers,
  };
};
