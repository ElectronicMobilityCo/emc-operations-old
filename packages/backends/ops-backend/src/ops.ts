import sub_logging from './subsystems/Logging/define';

import mod_apiserver from './modules/ApiServer/define';
import mod_auth from './modules/Auth/define';

import RoutesApp from './services/RoutesApp/controller';

export const ops_subsystems = [sub_logging];

export const ops_modules = [mod_apiserver, mod_auth, RoutesApp];
