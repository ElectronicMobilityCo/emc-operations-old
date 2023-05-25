import { DataTypes, Sequelize } from 'sequelize';

export const routesModel = (sequelize: Sequelize) => {
  const Line = sequelize.define(
    'Lines',
    {
      line_tbid: {
        type: DataTypes.STRING,
        primaryKey: true,
      }, // Timetabled ID = "APS" NOT "APS_1a"
      line_prefix: {
        type: DataTypes.STRING,
      },
      line_id: {
        type: DataTypes.STRING,
      }, // Line ID = T1
      line_type: {
        type: DataTypes.STRING,
      }, // Line type = 2(heavy rail)

      line_identifier: {
        type: DataTypes.STRING,
      }, // Line ID = T1
      line_name: {
        type: DataTypes.STRING,
      }, // Line Name = T9 Northern Line

      line_color: {
        type: DataTypes.STRING,
      }, // line color
      line_text_color: {
        type: DataTypes.STRING,
      },

      line_routes: {
        type: DataTypes.STRING,
      }, // List of Routes in this line
    },
    {}
  );
  const Route = sequelize.define(
    'Routes',
    {
      route_gid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      route_prefix: {
        type: DataTypes.STRING,
      },
      route_tbid: {
        type: DataTypes.STRING,
      }, // Timetabled ID = APS_1a
      route_id: {
        type: DataTypes.STRING,
      }, // ID = a
      route_direction: {
        type: DataTypes.STRING,
      }, // Direction = 1

      parent_route: {
        type: DataTypes.STRING,
      }, // Parent Route = APS;

      route_name: {
        type: DataTypes.STRING,
      }, // Route name = City Circle to Macarthur via Airport
    },
    {}
  );

  return { Line, Route };
};
