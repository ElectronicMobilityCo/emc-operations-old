import { FastifyInstance } from 'fastify';
import { auth_api_handler } from './handlers/auth';
import { OpsEvents } from '../../../bootstrap/bus/buses/eventbus';
import { OpsConfig } from '../../../bootstrap/config/config_loader';
import { routesapp_api_handler } from './handlers/routesapp';

export type Handler = (
  server: FastifyInstance,
  mb: OpsEvents,
  config: OpsConfig
) => void;

export const Handlers = [auth_api_handler, routesapp_api_handler];
