import { createModule } from '../../bootstrap/define';
import { Logger } from '../../bootstrap/logging/logger';

import { Sequelize } from 'sequelize';
import { defineModels } from './defineModels';
import { SHA256, enc } from 'crypto-js';
import { randomUUID } from 'crypto';

export const HashPassword = (password: string) => {
  // PROVIDE A BETTER FUCKING IMPLEMENTATION HERE
  // THIS IS GODAWFUL SHIT

  const hash = SHA256(password);
  return hash.toString(enc.Hex);
};

export const CreateRefresh = () => {
  // PROVIDE A BETTER FUCKING IMPLEMENTATION HERE
  // THIS IS GODAWFUL SHIT
  const hash = SHA256(randomUUID());
  return hash.toString(enc.Hex);
};

export default createModule(__filename, async ({ mb, config }) => {
  const l = new Logger({ scope: 'Auth' });
  //l.debug('CONFIG', config);

  const Tickets = new Map();

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.auth.db,
    logging: false, //(msg) => l.debug('SequelizeQuery', msg),
  });

  const db = await defineModels(sequelize, config);

  mb.on('Auth:VerifyRequestedResourceAccess', (data) => {
    l.info('Got Auth Request', data);
  });

  mb.respond(
    'Auth:VerifyRequestedRefreshAccess',
    'Auth:VerifyRequestedRefreshAccessResponse',
    async (data) => {
      l.info('Got request for refresh token', data.username);

      try {
        const dbResult:
          | undefined
          | Array<{ id: string; username: string; passwordhash: string }> =
          (await db?.AccessTicket.findAll({
            where: {
              username: data.username,
            },
          })) as unknown as
            | undefined
            | Array<{ id: string; username: string; passwordhash: string }>;
        const OuterPassHash = HashPassword(data.password);
        if (dbResult !== undefined && dbResult.length == 1) {
          if (
            dbResult[0].username == data.username &&
            dbResult[0].passwordhash == OuterPassHash
          ) {
            const refresh = CreateRefresh();
            await db?.RefreshToken.create({
              belongsTo: dbResult[0].id,
              token: refresh,
            });
            return {
              error: 'none',
              refresh_token: refresh,
            };
          } else throw 'Auth Faliure';
        } else throw 'Auth Faliure';
      } catch (e) {
        l.warn('Auth Faliure');
        return {
          error: 'invalid',
          refresh_token: '',
        };
      }
    }
  );

  mb.respond(
    'Auth:VerifyRequestedTicketAccess',
    'Auth:VerifyRequestedTicketAccessResponse',
    async (data) => {
      l.info('Got request for ticket token', data.refresh_token);

      try {
        const DBRefreshToken:
          | undefined
          | Array<{ belongsTo: string; token: string }> =
          (await db?.RefreshToken.findAll({
            where: {
              token: data.refresh_token,
            },
          })) as unknown as
            | undefined
            | Array<{ belongsTo: string; token: string }>;
        if (DBRefreshToken !== undefined && DBRefreshToken.length == 1) {
          const DBUserToken: undefined | Array<{ id: string }> =
            (await db?.AccessTicket.findAll({
              where: {
                id: DBRefreshToken[0].belongsTo,
              },
            })) as unknown as undefined | Array<{ id: string }>;

          if (DBUserToken !== undefined && DBUserToken.length == 1) {
            const ticket = CreateRefresh();

            await db?.Ticket.create({
              ticket,
              belongsTo: DBUserToken[0].id,
              expires: new Date(Date.now() + 1000 * 60 * 60),
            });

            return {
              error: 'none',
              ticket,
            };
          } else throw 'Auth Faliure';
        } else throw 'Auth Faliure';
      } catch (e) {
        l.warn('Auth Faliure');
        return {
          error: 'invalid',
          ticket: '',
        };
      }
    }
  );
});
