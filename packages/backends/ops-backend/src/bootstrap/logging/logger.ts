import diagnostics_channel from 'node:diagnostics_channel';
import { isMainThread, workerData } from 'node:worker_threads';
import { HRTstamp } from '../utils/HRTstamp';

export type LoggerContext = {
  mod: string;
  scope: string;
  seg?: string;
  sseg?: string;
};

export type LogLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal'
  | 'silent';

export class Logger {
  context: LoggerContext = {
    mod: 'entscr:main',
    scope: '',
  };

  channel: diagnostics_channel.Channel | null = null;

  constructor(
    ctx: Partial<Omit<LoggerContext, 'scope'>> & Pick<LoggerContext, 'scope'>
  ) {
    if (ctx.mod) this.context.mod = ctx.mod;
    if (!isMainThread && !ctx.mod) this.context.mod = workerData.workername;
    this.context.scope = ctx.scope;
    if (ctx.seg) this.context.seg = ctx.seg;
    if (ctx.sseg) this.context.sseg = ctx.sseg;
    this.channel = diagnostics_channel.channel('ops:diagnostics:log');
  }

  #log = (level: LogLevel, ...args: unknown[]) => {
    this.channel?.publish({
      context: this.context,
      data: args,
      level,
      ts: HRTstamp(),
    });
  };

  trace = (...args: unknown[]) => this.#log('trace', ...args);
  debug = (...args: unknown[]) => this.#log('debug', ...args);
  info = (...args: unknown[]) => this.#log('info', ...args);
  warn = (...args: unknown[]) => this.#log('warn', ...args);
  error = (...args: unknown[]) => this.#log('error', ...args);
  fatal = (...args: unknown[]) => this.#log('fatal', ...args);
  silent = (...args: unknown[]) => this.#log('silent', ...args);
}
