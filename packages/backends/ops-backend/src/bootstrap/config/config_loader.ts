import { Config_Definition, Config_Type } from './config_definition';
import md5 from 'crypto-js/md5';

export interface OpsConfig extends Config_Type {
  config_hash: string;
}

export const Config_Load = async () => {
  const parsed = Config_Definition.parse({});
  const config = {
    ...parsed,
    config_hash: md5(JSON.stringify(parsed)).toString(),
  };
  return config as OpsConfig;
};
