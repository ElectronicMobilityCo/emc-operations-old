import { EventEmitter } from 'node:events';
import { MessagePort, MessageChannel } from 'node:worker_threads';

interface MBPacket {
  author: string;
  type: string;
  data: unknown;
}

type ELfnCB = (...args: unknown[]) => void;

const EventScope = (evt_type: string) => evt_type.split(':')[0];

type MessagePortConforming = {
  on: (scope: 'message', cb: ELfnCB) => void;
  postMessage: (p: unknown) => void;
};

export type MBPortConforming = MessagePort | MessagePortConforming;

const MessageBusConforming = () => {
  const emitterInstance = new EventEmitter();

  return {
    port1: {
      on: (scope: 'message', cb: ELfnCB) => emitterInstance.on('to1', cb),
      postMessage: (p: unknown) => {
        emitterInstance.emit('to2', p);
      },
    },
    port2: {
      on: (scope: 'message', cb: ELfnCB) => emitterInstance.on('to2', cb),
      postMessage: (p: unknown) => {
        emitterInstance.emit('to1', p);
      },
    },
  } as { port1: MessagePortConforming; port2: MessagePortConforming };
};

export class OpsBusInstance {
  emitterInstance: EventEmitter = new EventEmitter();
  #author = '';
  #channel: MBPortConforming | null = null;
  constructor(port: MBPortConforming, author: string) {
    this.#channel = port;
    this.#author = author;
    this.#channel.on('message', this._iport_handle);
  }

  _iport_handle = (p: MBPacket) => {
    this.emitterInstance.emit(p.type, p.data);
  };

  _iport_send = (type: string, data: unknown) => {
    this.#channel?.postMessage(<MBPacket>{
      author: this.#author,
      type,
      data,
    });
  };
}

export class OpsBus {
  emitterInstance: EventEmitter = new EventEmitter();
  channels: Map<MBPortConforming, { author: string; subscriptions: string[] }> =
    new Map();
  prefix = 'evt';

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  #handle_distribute = (p: MBPacket) => {
    this.emitterInstance.emit(`${this.prefix}:${EventScope(p.type)}`, p);
    this.emitterInstance.emit(`${this.prefix}:*`, p);
  };
  addChannel = (author: string, subscriptions: string[], isMain?: boolean) => {
    if (isMain) {
      const mconform = MessageBusConforming();
      return this.#addChannelInternals(author, subscriptions, mconform);
    } else {
      const mchannel = new MessageChannel();
      return this.#addChannelInternals(author, subscriptions, mchannel);
    }
  };

  #addChannelInternals = (
    author: string,
    subscriptions: string[],
    mchannel: MessageChannel | ReturnType<typeof MessageBusConforming>
  ) => {
    this.channels.set(mchannel.port1, {
      author,
      subscriptions,
    });

    const handle_evt = (p: MBPacket) => {
      mchannel.port1.postMessage(p);
    };
    mchannel.port1.on('message', this.#handle_distribute);
    for (const evt_sub of subscriptions) {
      this.emitterInstance.on(`${this.prefix}:${evt_sub}`, handle_evt);
    }
    return mchannel.port2;
  };
}
