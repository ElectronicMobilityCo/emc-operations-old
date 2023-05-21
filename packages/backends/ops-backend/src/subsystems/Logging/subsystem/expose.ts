import { S_LogEvents } from '../../../bootstrap/bus/types/subsystem/Log';
import { LogIngestable } from './loggersubsystem';

export { LoggerSubsystem } from './loggersubsystem';

export const ConformIngestable = (
  idx: number,
  ts: number | bigint,
  bindings: { pid: number; ppid: number; hostname: string },
  p: S_LogEvents['Log:DelegateLog']
) => {
  return <LogIngestable>{
    level: p.level,

    idx,

    tstmp: ts,

    hname: bindings.hostname,

    mod: p.context.mod,
    scope: p.context.scope,
    ...(p.context.seg ? { seg: p.context.seg } : {}),
    ...(p.context.sseg ? { sseg: p.context.sseg } : {}),

    pid: bindings.pid,
    ppid: bindings.ppid,

    msg: typeof p.data[0] == 'string' ? p.data[0] : '',
    data: p.data,
  };
};
