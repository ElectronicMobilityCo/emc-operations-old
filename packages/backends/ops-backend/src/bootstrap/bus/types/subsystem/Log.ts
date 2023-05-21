import { LogLevel, LoggerContext } from '../../../logging/logger';

export interface S_LogEvents {
  'Log:DelegateLog': {
    context: LoggerContext;
    data: unknown[];
    level: LogLevel;
    ts: number|bigint;
  };
}
