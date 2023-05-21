import { S_LogEvents } from './types/subsystem/Log';

import { ApiServerEvents } from './types/event/ApiServer';
import { AuthEvents } from './types/event/Auth';
import { CommonEvents } from './types/event/Common';
import { RoutesAppEvents } from './types/event/RoutesApp';

export interface OpsEventConforming
  extends CommonEvents,
    ApiServerEvents,
    AuthEvents,
    RoutesAppEvents {
  '*': unknown;
}

export interface OpsSubsystemEventConforming extends S_LogEvents {
  '*': unknown;
}
/*
type ExtractOpsScope<OpsScope extends string> =
  OpsScope extends `${infer scope}:${string}` ? scope : OpsScope;

export type OpsEventConformingScope = ExtractOpsScope<keyof OpsEventConforming>;
export type OpsSubsystemEventConformingScope = ExtractOpsScope<
  keyof OpsSubsystemEventConforming
>;
*/
