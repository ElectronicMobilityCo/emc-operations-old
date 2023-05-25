import { DataTypes, Sequelize } from 'sequelize';

export const tripsModel = (sequelize: Sequelize) => {
  const Trip = sequelize.define(
    'Trips',
    {
      trip_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      }, // Timetabled ID = "1--A.1241.121.60.B.8.73409025"
      trip_tbid: {
        type: DataTypes.STRING,
      }, // Timetabled ID = "1--A.1241.121.60.B.8.73409025"
      trip_prefix: {
        type: DataTypes.STRING,
      }, // the prefix for updating and deleting
      trip_svid: {
        type: DataTypes.STRING,
      }, // Service ID = "1241.121.60"
      trip_routeid: {
        type: DataTypes.STRING,
      }, // Route ID = "BNK_2a"

      trip_shapeid: {
        type: DataTypes.STRING,
      }, // Shape ID = "BNK_2a"
      trip_blockid: {
        type: DataTypes.STRING,
      }, // Block ID = "32602"

      trip_headsign: {
        type: DataTypes.STRING,
      }, // Headsign = "City Circle via Museum"
      trip_accessible: {
        type: DataTypes.BOOLEAN,
      }, // Trip Accessible Flag = "0"

      trip_vehicledata_vd_isconfirmed: {
        type: DataTypes.NUMBER,
      }, // Trip vehicle data

      trip_vehicledata_vd_vehicleid: {
        type: DataTypes.STRING,
      }, // Trip vehicle data

      trip_stops: {
        type: DataTypes.STRING,
      }, // List of Trip Stops in this line

      trip_start: {
        type: DataTypes.STRING,
      },
      trip_end: {
        type: DataTypes.STRING,
      },

      trip_operation_dates: {
        type: DataTypes.STRING,
      }, // days of the week the trip operates
      trip_operation_dates_start: {
        type: DataTypes.NUMBER,
      },
      trip_operation_dates_end: {
        type: DataTypes.NUMBER,
      },

      trip_stops_prefix: {
        type: DataTypes.STRING,
      }, // Prefix for Trip Stops ID
    },
    {}
  );
  const TripStop = sequelize.define(
    'TripStops',
    {
      stop_refid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      stop_prefix: {
        type: DataTypes.STRING,
      }, // the prefix for updating and deleting

      stop_tripid: {
        type: DataTypes.STRING,
      }, // Stop Trip ID
      stop_sequence: {
        type: DataTypes.NUMBER,
      },

      stop_id: {
        type: DataTypes.STRING,
      },

      stop_arrivaltime: {
        type: DataTypes.STRING,
      }, // Stop Arrival time

      stop_arrivaltime_computed: {
        type: DataTypes.NUMBER,
      }, // Stop Arrival time
      stop_arrivaltype: {
        type: DataTypes.NUMBER,
      },

      stop_departuretime: {
        type: DataTypes.STRING,
      },
      stop_departuretime_computed: {
        type: DataTypes.NUMBER,
      },
      stop_departuretype: {
        type: DataTypes.NUMBER,
      },
    },
    {}
  );

  return { Trip, TripStop };
};
