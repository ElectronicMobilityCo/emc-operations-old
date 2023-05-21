import {
  LogIngestable,
  LogSubsystemTransport,
} from '../subsystem/loggersubsystem';

import chalk from 'chalk';

export class ConsoleTransport extends LogSubsystemTransport {
  pretty = false;

  ConsoleLevelMap = {
    trace: console.debug,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    fatal: console.error,
    silent: console.log,
  };

  ConsoleStyleMap = {
    trace: chalk.dim,
    debug: chalk.cyan,
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red,
    fatal: chalk.red,
    silent: chalk.dim,
  };

  constructor(pretty = false) {
    super('CONSOLE');
    this.pretty = pretty;
  }
  ingest = (i: LogIngestable) => {
    if (this.pretty) {
      this.writePretty(i);
    } else {
      this.writeJSON(i);
    }
  };

  writeJSON = (i: LogIngestable) => {
    this.ConsoleLevelMap[i.level](JSON.stringify(i));
  };
  writePretty = (i: LogIngestable) => {
    const TimeTag = `${chalk.dim(new Date(Number(i.tstmp)).toISOString())}`;

    const ContextTag = `${i.mod
      .replace('entscr:', '[')
      .replace('module:', 'worker[')
      .replace('subsys:', 'subsystem[')}
      .
      ${i.scope}
      ${i.seg ? i.seg + '.' : ''}
      ${i.sseg ? i.sseg + '.' : ''}
    ]`.replace(/\n| /g, '');

    const LevelTag = this.ConsoleStyleMap[i.level](
      `[${i.level.toLowerCase()}]`.padEnd(8, ' ')
    );

    const MessageTag = i.msg;

    const DataTag = i.data
      .slice(1, i.data.length)
      .map((d) => String(JSON.stringify(d, null, 2)).replace(/\n^ */gm, ' '))
      .join(' ');

    const FinalTag = `${TimeTag} ${LevelTag} ${ContextTag} ${MessageTag} ${DataTag}`;
    this.ConsoleLevelMap[i.level](FinalTag);
  };
}
