import process from 'node:process';
import os from 'node:os';
import { HRTstamp } from '../utils/HRTstamp';

export const Report_Environment = async () => {
  const cpus = os
    .cpus()
    .reduce((acc, cur) => {
      if (acc.find((x) => x.model === cur.model && x.speed === cur.speed)) {
        return acc;
      } else {
        return [...acc, { model: cur.model, speed: cur.speed }];
      }
    }, [] as Array<{ model: string; speed: number }>)
    .map((cpu) => ({
      model: cpu.model.trim(),
      speed: cpu.speed,
    }));

  const report = {
    hardware: {
      arch: os.arch(),
      processors: cpus,
      proc_count: os.cpus().length,
      parallelism: {
        avalible: os.cpus().length > 1, // dual threads or more,
        factor: 4,
      },
    },
    host: {
      hostname: os.hostname(),
      platform: os.platform(),
      type: os.type(),
      tempdir: os.tmpdir(),
    },
    process: {
      pid: process.pid,
      ppid: process.ppid,
      versions: {
        node: process.versions.node,
        v8: process.versions.v8,
      },
      origin: HRTstamp(),
    },
  };
  return report;
};
