import Fastify from 'fastify';
import { createModule } from '../../bootstrap/define';
import { Logger } from '../../bootstrap/logging/logger';
import { Handlers } from './src/handlers';

export default createModule(__filename, async ({ mb, config }) => {
  const l = new Logger({ scope: 'ServerBoot' });

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const server = Fastify({
    logger: false,
  });

  Handlers.map((handler) => handler(server, mb, config));

  await mb.wait('Common:FinishedStartup');

  server.listen({ port, host }, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    } else {
      l.info(`[ ready ] http://${host}:${port}`);
    }
  });
});
