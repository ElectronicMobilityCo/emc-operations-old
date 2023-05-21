import { Vehicle } from '../models/vehicle_class';
import { Sequelize } from 'sequelize';

const bootVDB = (sequelize: Sequelize) => {
  const DBRealtimeVehicle = sequelize.define(
    'RealtimeVehicle',
    Vehicle.DBModel
  );
  sequelize.sync();

  async function RegisterRealtimeVehicle(vehicle: Vehicle) {
    try {
      const DoesExist = await GetRealtimeVehicle(String(vehicle.id));
      if (DoesExist) UpdateRealtimeVehicle(vehicle);
      else {
        const DBVehicle = await DBRealtimeVehicle.create({
          id: String(vehicle.id),
          position_lat: Number(vehicle.position.lat),
          position_lon: Number(vehicle.position.lon),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function UpdateRealtimeVehicle(vehicle: Vehicle) {
    try {
      const DBVehicle = await DBRealtimeVehicle.update(
        {
          position_lat: Number(vehicle.position.lat),
          position_lon: Number(vehicle.position.lon),
        },
        {
          where: {
            id: String(vehicle.id),
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function RemoveRealtimeVehicle(vehicle: Vehicle) {
    try {
      const DBVehicle = await DBRealtimeVehicle.destroy({
        where: {
          id: String(vehicle.id),
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function GetRealtimeVehicle(id: string) {
    try {
      const DBVehicle = await DBRealtimeVehicle.findOne({
        where: {
          id: String(id),
        },
      });
      if (!DBVehicle) return null;
      return DBVehicle;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async function GetAllVehicles() {
    try {
      const vehicles = await DBRealtimeVehicle.findAll();
      return vehicles;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  return {
    RegisterRealtimeVehicle,
    UpdateRealtimeVehicle,
    RemoveRealtimeVehicle,
    GetRealtimeVehicle,
    GetAllVehicles,
  };
};
export default bootVDB;
