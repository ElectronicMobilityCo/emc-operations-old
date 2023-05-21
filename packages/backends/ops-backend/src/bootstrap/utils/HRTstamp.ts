import { performance } from 'node:perf_hooks';
//import { hrtime } from 'node:process';

export const HRTstamp = () => {
  //const t = hrtime.bigint();
  return performance.timeOrigin + performance.now();
};
