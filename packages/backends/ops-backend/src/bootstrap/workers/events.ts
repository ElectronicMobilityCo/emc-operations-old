import { Worker, parentPort } from 'node:worker_threads';

interface InternalEventConforming {
  IWE_BootstrapBegin: {
    bootstrap_time: number;
    perf_time: number;
  };
  IWE_BootstrapEnd: {
    perf_time: number;
    status: 'success' | 'failure';
    error?: Error;
  };
}

interface InternalEvent {
  type: keyof InternalEventConforming;
  data: object | undefined;
}

export class InternalWorkerComms {
  portContext: typeof parentPort | Worker | null;

  constructor(context: typeof parentPort | Worker | null) {
    this.portContext = context;
  }

  #EmitInternals = (data: InternalEvent) => {
    if (this.portContext !== null) this.portContext.postMessage(data);
  };

  emit<T extends keyof InternalEventConforming>(
    event: keyof InternalEventConforming,
    data: InternalEventConforming[T]
  ) {
    this.#EmitInternals({ data, type: event });
  }

  on<T extends keyof InternalEventConforming>(
    event: keyof InternalEventConforming,
    callback: (data: InternalEventConforming[T]) => void
  ) {
    if (this.portContext !== null)
      this.portContext.on('message', (message) => {
        if (message.type === event)
          callback(message.data as InternalEventConforming[T]);
      });
  }

  wait<T extends keyof InternalEventConforming>(
    event: keyof InternalEventConforming
  ): Promise<InternalEventConforming[T]> {
    return new Promise((resolve) => {
      if (this.portContext !== null)
        this.portContext.on('message', (message) => {
          if (message.type === event)
            resolve(message.data as InternalEventConforming[T]);
        });
    });
  }
}
