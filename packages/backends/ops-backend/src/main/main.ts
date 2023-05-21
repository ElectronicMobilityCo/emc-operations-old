import { Logger } from '../bootstrap/logging/logger';
import { ProvidesMain } from '../bootstrap/provides/to-main';
//import diagnostics_channel from 'diagnostics_channel';
//const log_channel = diagnostics_channel.channel('ops:diagnostics:log');
//log_channel.subscribe((data) => {
//  console.log('Got Log', data);
//});

export const ops_service = async (provides: ProvidesMain) => {
  const l = new Logger({ scope: 'OpsService' });
  const BootupClock = performance.now();

  const mb = provides.events;
  //const sb = provides.subsystem;
  setTimeout(() => {
    mb.emit('Common:FinishedStartup', { hello: '🏳️‍🌈❤️' });
  }, 1000);

  setInterval(() => {
    mb.emit('Common:Clock', {
      WALL: Date.now(),
      EPOCH: performance.now() - BootupClock,
    });
  }, 500);
};
