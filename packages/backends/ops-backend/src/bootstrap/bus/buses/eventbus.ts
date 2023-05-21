import { OpsEventConforming } from '../registry';
import { MBPortConforming, OpsBusInstance } from '../bus';
import { v4 as uuidv4 } from 'uuid';

export class OpsEvents extends OpsBusInstance {
  constructor(port: MBPortConforming, author: string) {
    super(port, author);
  }

  emit<T extends keyof OpsEventConforming>(
    event: T,
    data: OpsEventConforming[T]
  ) {
    const __iport_cb_tag = uuidv4();
    this._iport_send(event, { data, __iport_cb_tag });
  }

  on<T extends keyof OpsEventConforming>(
    event: T,
    cb: (data: OpsEventConforming[T]) => unknown | Promise<unknown>
  ) {
    this.emitterInstance.on(event, (data) => {
      cb(data.data);
    });
  }

  wait<T extends keyof OpsEventConforming>(
    event: T
  ): Promise<OpsEventConforming[T]> {
    return new Promise((resolve) => {
      this.emitterInstance.once(
        event,
        (data: { data: OpsEventConforming[T] }) => {
          resolve(data.data);
        }
      );
    });
  }

  ask<T extends keyof OpsEventConforming, A extends keyof OpsEventConforming>(
    event: T,
    responseEvent: A,
    data: OpsEventConforming[T]
  ): Promise<OpsEventConforming[A]> {
    return new Promise((resolve) => {
      const __iport_cb_tag = uuidv4();
      const callback = (cbdata: {
        data: OpsEventConforming[A];
        __iport_cb_tag: string;
      }) => {
        console.log(cbdata.data, cbdata.__iport_cb_tag);
        this.emitterInstance.removeListener(responseEvent, callback);
        resolve(cbdata.data);
      };
      this.emitterInstance.on(responseEvent, callback);
      this._iport_send(event, {
        data,
        __iport_cb_tag,
        __iport_cb_type: responseEvent,
      });
    });
  }

  respond<
    T extends keyof OpsEventConforming,
    A extends keyof OpsEventConforming
  >(
    event: T,
    responseEvent: A,
    cb: (data: OpsEventConforming[T]) => Promise<OpsEventConforming[A]>
  ) {
    this.emitterInstance.on(event, async (data) => {
      const res = await cb(data.data);
      this._iport_send(responseEvent, {
        data: res,
        __iport_cb_tag: data.__iport_cb_tag,
      });
    });
  }
}
