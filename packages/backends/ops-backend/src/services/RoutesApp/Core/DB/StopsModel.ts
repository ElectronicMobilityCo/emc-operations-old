import { DataTypes, Sequelize } from 'sequelize';

export const stopsModel = (sequelize: Sequelize) => {
  const Stop = sequelize.define(
    'Stops',
    {
      stop_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      }, // Stop ID
      stop_code: {
        type: DataTypes.STRING,
      }, // Stop Code
      parent_station: {
        type: DataTypes.STRING,
      }, // Parent Station ID

      position_lat: {
        type: DataTypes.NUMBER,
      }, // Stop Position
      position_lon: {
        type: DataTypes.NUMBER,
      }, // Stop Position

      stop_name: {
        type: DataTypes.STRING,
      }, // Stop Name
      stop_description: {
        type: DataTypes.STRING,
      }, // Stop Description

      wheelchair_boarding: {
        type: DataTypes.NUMBER,
      }, // Station Wheelchair Accessibility
    },
    {}
  );
  const Station = sequelize.define(
    'Stations',
    {
      station_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      }, // Station ID
      stop_code: {
        type: DataTypes.STRING,
      }, // Station Code

      position_lat: {
        type: DataTypes.NUMBER,
      }, // Station Position
      position_lon: {
        type: DataTypes.NUMBER,
      }, // Station Position

      station_zone: {
        type: DataTypes.STRING,
      }, // Station Zone

      station_name: {
        type: DataTypes.STRING,
      }, // Station Name
      station_description: {
        type: DataTypes.STRING,
      }, // Station Description
      station_url: {
        type: DataTypes.STRING,
      }, // Station URL

      station_stops: {
        type: DataTypes.STRING,
      }, // Station URL

      wheelchair_boarding: {
        type: DataTypes.NUMBER,
      }, // Station Wheelchair Accessibility
    },
    {}
  );

  return { Stop, Station };
};
