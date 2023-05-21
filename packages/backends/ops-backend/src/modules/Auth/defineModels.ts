import { Sequelize, DataTypes } from 'sequelize';
import { HashPassword } from './entry';
import { OpsConfig } from '../../bootstrap/config/config_loader';

export const defineModels = async (sequelize: Sequelize, config: OpsConfig) => {
  try {
    const AccessTicket = sequelize.define(
      'AccessTickets',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
        },
        passwordhash: {
          type: DataTypes.STRING,
        },
      },
      {}
    );
    const RefreshToken = sequelize.define(
      'RefreshTokens',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        belongsTo: {
          type: DataTypes.UUID,
        },
        token: {
          type: DataTypes.STRING,
        },
      },
      {}
    );
    const Ticket = sequelize.define(
      'Tickets',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        belongsTo: {
          type: DataTypes.UUID,
        },
        ticket: {
          type: DataTypes.STRING,
        },
        expires: {
          type: DataTypes.DATE,
        },
      },
      {}
    );

    await sequelize.sync();

    const initialDefState = await AccessTicket.findAll({
      where: {
        username: config.auth.default.user,
      },
    });

    if (initialDefState.length == 0) {
      await AccessTicket.create({
        username: config.auth.default.user,
        passwordhash: HashPassword(config.auth.default.pass),
      });
    }

    return {
      AccessTicket,
      RefreshToken,
      Ticket,
    };
  } catch (e: unknown) {
    const err: { message: string } = e as unknown as { message: string };
    console.log(err.message);
  }
};
