import { OpsSubsystemEventConforming } from '../registry';
import { MBPortConforming, OpsBusInstance } from '../bus';
import { v4 as uuidv4 } from 'uuid';

export class OpsSubsystemEvents extends OpsBusInstance {
  constructor(port: MBPortConforming, author: string) {
    super(port, author);
  }

  emit<T extends keyof OpsSubsystemEventConforming>(
    event: T,
    data: OpsSubsystemEventConforming[T]
  ) {
    const __iport_cb_tag = uuidv4();
    this._iport_send(event, { data, __iport_cb_tag });
  }

  on<T extends keyof OpsSubsystemEventConforming>(
    event: T,
    cb: (data: OpsSubsystemEventConforming[T]) => void
  ) {
    this.emitterInstance.on(event, (data) => cb(data.data));
  }
}
