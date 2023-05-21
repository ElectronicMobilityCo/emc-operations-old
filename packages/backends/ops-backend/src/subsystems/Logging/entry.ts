import { createModule } from '../../bootstrap/define';
import { ConformIngestable, LoggerSubsystem } from './subsystem/expose';
import { ConsoleTransport } from './transports/console';

export default createModule(__filename, ({ sb, env }) => {
  let log_idx = 0;
  const bindings = {
    pid: env.process.pid,
    ppid: env.process.ppid,
    hostname: env.host.hostname,
  };

  const lsubsystem = new LoggerSubsystem([new ConsoleTransport(true)]);

  sb.on('Log:DelegateLog', (p) => {
    const ingestable = ConformIngestable(log_idx, p.ts, bindings, p);
    lsubsystem.handle(ingestable);
    log_idx++;
  });
});
