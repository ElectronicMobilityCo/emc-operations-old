import { LogLevel } from '../../../bootstrap/logging/logger';

export type LogIngestable = {
  level: LogLevel;

  idx: number;

  tstmp: number | bigint;

  hname: string;

  mod: string;
  scope: string;
  seg?: string;
  sseg?: string;

  pid: number;
  ppid: number;

  msg: string;
  data: unknown[];
};

export type LogTransportType = 'VIRTUAL' | 'CONSOLE' | 'FILE' | 'NETWORK';

export class LoggerSubsystem {
  transports = {
    VIRTUAL: new Set<LogSubsystemTransport>(),
    CONSOLE: new Set<LogSubsystemTransport>(),
    FILE: new Set<LogSubsystemTransport>(),
    NETWORK: new Set<LogSubsystemTransport>(),
  };

  constructor(transports: LogSubsystemTransport[]) {
    for (const t of transports) {
      const tinit = t.LoggerSubsystem_Attach();
      this.transports[tinit.type].add(t);
    }
  }

  handle(i: LogIngestable): void {
    this.transports.FILE.forEach((t) => t.ingest(i));
    this.transports.VIRTUAL.forEach((t) => t.ingest(i));
    this.transports.CONSOLE.forEach((t) => t.ingest(i));
    this.transports.NETWORK.forEach((t) => t.ingest(i));
  }
}

export class LogSubsystemTransport {
  #LTS_TransportType: LogTransportType = 'VIRTUAL';
  constructor(type: LogTransportType) {
    this.#LTS_TransportType = type;
  }

  LoggerSubsystem_Attach() {
    return {
      type: this.#LTS_TransportType,
    };
  }

  ingest: (i: LogIngestable) => void = () => {
    null;
  };
  flush: () => void = () => {
    null;
  };
}
